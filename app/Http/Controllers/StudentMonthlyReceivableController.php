<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Ledger;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Journal;
use App\Models\WhatsappLog;
use Carbon\CarbonImmutable;
use App\Helpers\PhoneNumber;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use App\Jobs\SendWhatsAppNotifJob;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentPaymentCategory;
use App\Repositories\Log\LogRepository;
use App\Models\StudentMonthlyReceivable;
use App\Repositories\User\UserRepository;
use App\Jobs\SendMonthlyReceivableBillingJob;
use App\Models\StudentMonthlyReceivableLedger;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentMonthlyReceivableController extends Controller
{
  protected $userRepository;
  protected $logRepository;
  protected $journalRepository;
  protected $contactRepository;
  protected $now;

  public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository, ContactRepository $contactRepository, AccountRepository $accountRepository)
  {
      $this->userRepository = $userRepository;
      $this->logRepository = $logRepository;
      $this->journalRepository = $journalRepository;
      $this->contactRepository = $contactRepository;
      $this->accountRepository = $accountRepository;
      $this->now = CarbonImmutable::now();
  }

  protected function newRef($organization, $dateRequest = '')
  {
      $now = $this->now;
      $date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
      $dateRef = Carbon::create($date);
      $refHeader = 'IB-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
      $newRef = $refHeader.'0001';

      $cashIn = StudentMonthlyPayment::whereOrganizationId($organization['id'])
          ->where('no_ref', 'like', $refHeader.'%')
          ->orderBy('no_ref','desc')
          ->first();

      if ($cashIn) {
          $newRef = NewRef::create('IB-', $cashIn['no_ref']);
      }

      return $newRef;
  }
    
  public function index(Organization $organization)
  {
    $user = Auth::user();

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

    return Inertia::render('StudentMonthlyReceivable/Index',[
      'organization' => $organization,
      'whatsappPlugin' => $whatsappPlugin ? true : false,
      'receivables' => StudentMonthlyReceivable::filter(request(['search']))
                                  ->with('contact', function ($query) {
                                      $query->with('student', 'lastLevel');
                                  })
                                  ->where('value', '>', 0)
                                  ->whereOrganizationId($organization['id'])
                                  ->orderBy('value', 'desc')
                                  ->paginate(50)->withQueryString(),
      'role' => $this->userRepository->getRole($user['id'], $organization['id']),
    ]);
  }

  public function create(Organization $organization)
  {
    $user = Auth::user();

    $schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();

    if (!$schoolAccount) {
        return redirect()->back()->withErrors(['message' => 'Silakan Tautkan Akun-Akun yang Dibutuhkan!']);
    }

    $contactCategory = ContactCategory::whereOrganizationId($organization['id'])
                                            ->whereName('SISWA')
                                            ->first();

    if (!$contactCategory) {
        return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak SISWA terlebih dahulu!']);
    }

    return Inertia::render('StudentMonthlyReceivable/Create',[
      'organization' => $organization,
      'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
																							->whereIsActive(true)
																							->get(),
      'role' => $this->userRepository->getRole($user['id'], $organization['id']),
      'newRef' => $this->newRef($organization, request('date')),
      'date' => request('date') ?? $this->now->isoFormat('YYYY-M-DD'),
      'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
      'selectedContactParam' => Contact::with(['contactCategories', 'student', 'lastLevel'])->find(request('selectedContact')),
    ]);
  }

  public function store(Request $request, Organization $organization)
  {
    $validated = $request->validate([
      'contact_id' => [
          'required',
          'exists:contacts,id',
      ],
      'date' => [
          'required',
          'date',
      ],
      'level' => [
          'required',
          'numeric',
      ],
      'student_id' => [
          'string',
          'nullable',
      ],
      'no_ref' => [
          'required',
          'string',
          Rule::unique('student_monthly_payments')->where(function ($query) use ($organization) {
              return $query->where('organization_id', $organization['id']);
          }),
      ],
      'value' => [
          'required',
          'numeric',
      ],
      'month' => [
          'required',
          'numeric',
      ],
      'study_year' => [
          'string',
          'required',
      ],
      'details' => [
          'required',
      ],
      'details.*.id' => [
          'required',
          'exists:student_payment_categories,id'
      ],
      'details.*.name' => [
          'required',
          'string'
      ],
      'details.*.value' => [
          'required',
          'numeric',
          'min:0',
      ],
      'description' => [
          'string',
          'nullable'
      ],
    ]);

    $user = Auth::user();
    $validated['type'] = 'receivable';
    $validated['organization_id'] = $organization['id'];
    $validated['user_id'] = $user['id'];
    $validated['created_by_id'] = $user['id'];

    // cek apakah pembayaran sudah dilakukan
    $payment = StudentMonthlyPayment::whereOrganizationId($organization['id'])
                                      ->whereContactId($validated['contact_id'])
                                      ->where('month', $validated['month'])
                                      ->where('study_year', $validated['study_year'])
                                      ->first();

    if ($payment) {
        return redirect()->back()->withErrors(['error' => 'Data is existed']);
    }

    DB::transaction(function() use ($validated, $payment, $organization, $user) {    
			$payment = StudentMonthlyPayment::create($validated);

			foreach ($validated['details'] as $detail) {
					if ($detail['value'] > 0) {
							$data = [
									'payment_id' => $payment['id'],
									'student_payment_category_id' => $detail['id'],
									'value' => $detail['value'],
							];

							DB::table('s_monthly_payment_details')
									->insert($data);
					}
			}

			$schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();
			$debitAccount = Account::find($schoolAccount['receivable_monthly_student']);

			$creditAccount = Account::find($schoolAccount['revenue_student']);

			$validated['accounts'] = [
				[
						'id' => $debitAccount['id'],
						'name' => $debitAccount['name'],
						'code' => $debitAccount['code'],
						'is_cash' => 0,
						'debit' => $validated['value'],
						'credit' => 0,
				],
				[
						'id' => $creditAccount['id'],
						'name' => $creditAccount['name'],
						'code' => $creditAccount['code'],
						'is_cash' => 0,
						'debit' => 0,
						'credit' => $validated['value'],
				],
			];

			// buat data pada table piutang bulanan
			// cek apakah sudah ada data
			// jika sudah ada, maka tambahkan lalu update sisa (value) 
			// jika belum ada maka buat data baru
			$receivable = StudentMonthlyReceivable::whereOrganizationId($organization['id'])
																							->whereContactId($validated['contact_id'])
																							->first();

			if($receivable)
			{
					$temp_receivable = $receivable['value'];
					$receivable->update([
							'value' => $temp_receivable + $validated['value']
					]);
			} else {
					$receivable = StudentMonthlyReceivable::create($validated);
			}

			$journal = $this->journalRepository->store($validated);

			$validated['journal_id'] = $journal['id'];

			$receivableLedger = StudentMonthlyReceivableLedger::create([
					'receivable_id' => $receivable['id'],
					'debit' => $validated['value'],
					'credit' => 0,
					'no_ref' => $validated['no_ref'],
					'description' => $validated['description'],
					'date' => $validated['date'],
					'study_year' => $validated['study_year'],
					'month' => $validated['month'],
					'journal_id' => $validated['journal_id'],
					'created_by_id' => $validated['created_by_id'],
					'payment_id' => $payment['id'],
			]);

			$log = [
					'description' => $validated['description'],
					'date' => $validated['date'],
					'no_ref' => $validated['no_ref'],
					'value' => $validated['value'],
			];

			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada PIUTANG IURAN BULANAN dengan DATA : '.json_encode($log));
    });

    return redirect(route('cashflow.student-monthly-receivable.create', $organization['id']))->with('success', 'Piutang Iuran Bulanan Berhasil Ditambahkan');
  }

  public function show(Organization $organization, StudentMonthlyReceivable $receivable)
  {
    $user = Auth::user();
		
		return Inertia::render('StudentMonthlyReceivable/Show',[
			'organization' => $organization,
			'receivable' => $receivable,
			'receivables' => StudentMonthlyReceivableLedger::where('receivable_id', $receivable['id'])
												->filter(request(['search']))
												->whereNull('paid_date')
												->with('receivable')
												->orderBy('study_year', 'desc')
												->orderBy('month', 'desc')
												->paginate(50),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'contact' => Contact::find($receivable['contact_id'])
		]);
  }

	public function edit(Organization $organization, StudentMonthlyReceivable $receivable, StudentMonthlyReceivableLedger $ledger)
	{
		$user = Auth::user();

		$contactCategory = ContactCategory::whereOrganizationId($organization['id'])
                                            ->whereName('SISWA')
                                            ->first();

		$payment =  StudentMonthlyPayment::find($ledger['payment_id']);

		$ledgerJournal = Ledger::whereJournalId($ledger['journal_id'])->where('credit', '>', 0)->first();

		return Inertia::render('StudentMonthlyReceivable/Edit', [
			'organization' => $organization,
      'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
                                                    ->whereIsActive(true)
                                                    ->get(),
      'role' => $this->userRepository->getRole($user['id'], $organization['id']),
      'date' => request('date') ?? $ledger['date'],
      'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'ledger' => $ledger,
			'receivable' => StudentMonthlyReceivable::find($ledger['receivable_id']),
			'payment' => $payment,
			'details' => DB::table('s_monthly_payment_details')->where('payment_id', $payment['id'])->get(),
      'newRef' => request('date') ? $this->newRef($organization, request('date')) : $ledger['no_ref'],
			'contact' => Contact::with('student')->find($payment['contact_id']),
			'lastLevel' => StudentLevel::whereContactId($payment['contact_id'])->latest()->first(),
		]);
	}

	public function update(Request $request, Organization $organization, StudentMonthlyReceivable $receivable, StudentMonthlyReceivableLedger $ledger)
	{
		$validated = $request->validate([
			'contact_id' => [
					'required',
					'exists:contacts,id',
			],
			'date' => [
					'required',
					'date',
			],
			'level' => [
					'required',
					'numeric',
			],
			'student_id' => [
					'string',
					'nullable',
			],
			'no_ref' => [
					'required',
					'string',
					Rule::unique('student_monthly_payments')->where(function ($query) use ($organization) {
							return $query->where('organization_id', $organization['id']);
					})->ignore($ledger['payment_id']),
			],
			'value' => [
					'required',
					'numeric',
			],
			'month' => [
					'required',
					'numeric',
			],
			'study_year' => [
					'string',
					'required',
			],
			'details' => [
					'required',
			],
			'details.*.id' => [
					'required',
					'exists:student_payment_categories,id'
			],
			'details.*.name' => [
					'required',
					'string'
			],
			'details.*.value' => [
					'required',
					'numeric',
					'min:0',
			],
			'description' => [
					'string',
					'nullable'
			],
		]);

		$user = Auth::user();
		$validated['type'] = 'receivable';
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];

		// Jika telah dilakukan pembayaran paid_date not null
		// maka tampilkan error
    DB::transaction(function() use ($validated, $organization, $user, $ledger, $receivable) {		
			$payment = StudentMonthlyPayment::find($ledger['payment_id']);
			$payment->update([
				'no_ref' => $validated['no_ref'],
				'contact_id' => $validated['contact_id'],
				'value' => $validated['value'],
				'month' => $validated['month'],
				'study_year' => $validated['study_year'],
				'date' => $validated['date'],
			]);

			$details = DB::table('s_monthly_payment_details')
										->where('payment_id', $payment['id'])
										->delete();
			
			foreach ($validated['details'] as $detail) {
				if ($detail['value'] > 0) {
					$data = [
						'payment_id' => $payment['id'],
						'student_payment_category_id' => $detail['id'],
						'value' => $detail['value'],
					];

					DB::table('s_monthly_payment_details')->insert($data);
				}
			}
			$schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();
			$debitAccount = Account::find($schoolAccount['receivable_monthly_student']);
			$creditAccount = Account::find($schoolAccount['revenue_student']);

			$validated['accounts'] = [
				[
						'id' => $debitAccount['id'],
						'name' => $debitAccount['name'],
						'code' => $debitAccount['code'],
						'is_cash' => 0,
						'debit' => $validated['value'],
						'credit' => 0,
				],
				[
						'id' => $creditAccount['id'],
						'name' => $creditAccount['name'],
						'code' => $creditAccount['code'],
						'is_cash' => 0,
						'debit' => 0,
						'credit' => $validated['value'],
				],
			];
			
			$temReceivableValue = $receivable['value'] - $ledger['debit'];

			$receivable->update([
				'contact_id' => $validated['contact_id'],
				'value' => $validated['value'] + $temReceivableValue
			]);

			$this->journalRepository->update($validated, $ledger->journal);

			$ledger->update([
				'debit' => $validated['value'],
				'credit' => 0,
				'no_ref' => $validated['no_ref'],
				'description' => $validated['description'],
				'date' => $validated['date'],
				'study_year' => $validated['study_year'],
				'month' => $validated['month'],
			]);

			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];

			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada PIUTANG IURAN BULANAN dengan DATA : '.json_encode($log));
		});

		return redirect()->back()->with('success', 'Piutang Iuran Bulanan Berhasil Diubah');
	}

	public function destroy(Request $request, Organization $organization, StudentMonthlyReceivable $receivable, StudentMonthlyReceivableLedger $ledger)
	{
		// cek pada payment
		// jika sudah dilakukan pembayaran, maka tampilkan error
		if ($ledger['paid_date']) 
		{
			return redirect()->back()->withErrors(['message' => 'Piutang Tidak Dapat Dihapus']);
		}

		$user = Auth::user();

    DB::transaction(function() use ($ledger, $organization, $user, $receivable) {
			// hapus data pada journal 
			$journal = Journal::find($ledger['journal_id']);
			$journal->delete();
			
			// cek kurangi jumlah piutang
			$value = $receivable['value'];
			$receivable->update([
				'value' => $value - $ledger['debit']
			]);

			$payment = StudentMonthlyPayment::find($ledger['payment_id']);

			// hapus data pada tabel s_monthly_payment_details
			DB::table('s_monthly_payment_details')
			->where('payment_id', $payment['id'])
			->delete();

			// hapus data pada tabel student_monthly_payments
			$payment->delete();

					// hapus data pada table student_monthly_receivable_ledgers
			$ledger->delete();

			$log = [
				'date' => $ledger['date'],
				'no_ref' => $ledger['no_ref'],
				'value' => $ledger['value'],
			];

			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada PIUTANG IURAN BULANAN dengan DATA : '.json_encode($log));

		});
		return redirect()->back()->with('success', 'Piutang Iuran Bulanan Berhasil Diubah');
	}

	public function print(Organization $organization, StudentMonthlyReceivable $receivable)
	{
		$user = Auth::user();
		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('StudentMonthlyReceivable/Print', [
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
			'receivable' => $receivable,
			'receivables' => StudentMonthlyReceivableLedger::where('receivable_id', $receivable['id'])
												->whereNull('paid_date')
												->with('receivable')
												->orderBy('study_year', 'desc')
												->orderBy('month', 'desc')
												->get(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'contact' => Contact::with(['student', 'lastLevel'])->find($receivable['contact_id']),
			'user' => $user
		]);
	}

	public function sendWhatsApp(Organization $organization, StudentMonthlyReceivable $receivable)
	{
		
		$receivables = StudentMonthlyReceivableLedger::where('receivable_id', $receivable['id'])
																										->whereNull('paid_date')
																										->with('receivable')
																										->orderBy('study_year', 'desc')
																										->orderBy('month', 'desc')
																										->get();

		$whatsAppLog = WhatsappLog::create([
			'organization_id' => $organization['id'],
			'contact_id' => $receivable['contact_id'],
			'description' => 'PENAGIHAN PIUTANG IURAN BULANAN SISWA',
			'status' => 'waiting'
		]);

		$contact = Contact::with(['student', 'lastLevel'])->find($receivable['contact_id']);
		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();
		$tempDetail = "\nDetail:";

		foreach ($receivables as $key => $detail) {
			$tempDetail .= "\nNo Ref: " . $detail['no_ref'] . "\nBulan: " . $detail['month'] . "\nTahun Ajaran: " . $detail['study_year'] . "\nJumlah: IDR. " . number_format($detail['debit'], 0, '', '.') . "\n";
		}

		$message = "*TAGIHAN IURAN BULANAN*\n-------------------------------------------------------\nNama: " . $contact['name'] .
		"\nNo. Siswa: " . $contact->student->no_ref .
		"\nTahun Masuk: " . $contact->student->entry_year .
		"\nKelas Sekarang: " . $contact->lastLevel->level . "\n" . $tempDetail .
		"\n\nTTD,\n\n" . strtoupper($organization['name']);

		// $data = array(
		// 	'appkey' => $whatsappPlugin['appKey'],
		// 	'authkey' => $whatsappPlugin['authkey'],
		// 	'to' => PhoneNumber::setFormat($contact['phone']),
		// 	'message' => $message,
		// 	'sandbox' => 'false'
		// );

		$data = array(
			'appkey' => $whatsappPlugin['appKey'],
			'authkey' => $whatsappPlugin['authkey'],
			'target' => PhoneNumber::setFormat($contact['phone']),
			'message' => $message,
			'sandbox' => 'false'
		);

		SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp');
		return redirect()->back()->with('success', 'Rincian Penagihan Tunggakan Iuran Bulanan telah diteruskan Via Whatsapp');
	}

	public function sendWhatsAppMulti(Organization $organization)
	{
		SendMonthlyReceivableBillingJob::dispatch($organization)->onQueue('whatsapp');
		return redirect()->back()->with('success', 'Penagihan Tunggakan Iuran Bulanan telah diteruskan Via Whatsapp');
	}
}
