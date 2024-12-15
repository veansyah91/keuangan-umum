<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
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
use App\Models\StudentEntryPayment;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentEntryReceivable;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Models\StudentEntryPaymentCategory;
use App\Models\StudentEntryReceivableLedger;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentEntryPaymentController extends Controller
{
	protected $userRepository;

	protected $logRepository;

	protected $journalRepository;

	protected $contactRepository;

	protected $accountRepository;

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
		$refHeader = 'IT-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
		$newRef = $refHeader.'0001';

		$payment = StudentEntryPayment::whereOrganizationId($organization['id'])
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('IT-', $payment['no_ref']);
		}

		return $newRef;
	}
	public function index(Organization $organization)
	{
		$user = Auth::user();
		$search = request(['search']);

		return Inertia::render('StudentEntryPayment/Index', [
			'organization' => $organization,
			'payments' => StudentEntryPayment::filter(request(['search','studyYear','start_date', 'end_date']))
																	->with('contact', function ($query) {
																			$query->with('student');
																	})
																	->whereOrganizationId($organization['id'])
																	->orderBy('study_year', 'desc')
																	->orderBy('date', 'desc')
																	->orderBy('no_ref', 'desc')
																	->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'searchFilter' => $search,
			'startDate' => request('start_date'),
			'endDate' => request('end_date'),
			'studyYears' => StudentLevel::select('year')->distinct()->get(),
			'studyYear' => request('studyYear')
		]);
	}

	public function create(Organization $organization)
	{
		$user = Auth::user();
		$organizationUser = $user->organizations()->where('organization_id', $organization['id'])->wherePivot('role', "<>", 'viewer')->first();
		
		if (!$organizationUser) {
			return redirect()->back()->withErrors(['message' => 'Pengguna Tidak Memiliki Hak Akses!']);
		}

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

		$studyYears = StudentLevel::select('year')->orderBy('year', 'desc')->distinct()->take(10)->get()->toArray();

		$explodeStudyYear = explode("/", $studyYears[0]['year']);
		$tempStudyYear = (string)((int)$explodeStudyYear[1]) . "/" . (string)((int)$explodeStudyYear[1] + 1);

		array_unshift($studyYears, [
			'year' => $tempStudyYear
		]);

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('StudentEntryPayment/Create',[
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => StudentEntryPaymentCategory::whereOrganizationId($organization['id'])
																							->whereIsActive(true)
																							->get(),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-M-DD'),
			'studyYears' => $studyYears,
			'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$rules = [
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
			'value' => [
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
				'exists:student_entry_payment_categories,id'
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
			'paidValue' => [
				'required',
				'numeric',
				'min:0',
			],
			'send_wa' => [
				'required',
				'boolean'
			],
			'no_ref' => [
				'required',
				'string',
				Rule::unique('student_entry_payments')->where(function ($query) use ($organization) {
					return $query->where('organization_id', $organization['id']);
				}),
			],
		];

		$validator = Validator::make($request->all(), $rules);

		$validator->sometimes('cash_account_id', 'required|exists:accounts,id', function ($input) {
			return $input->paidValue > 0;  // Hanya validasi 'cash_account_id' jika 'paidValue' bernilai > 0
		});

		$validated = $validator->validated();

		// cek apakah sudah ada transaksi pembayaran antara siswa dan tahun ajaran
		$payment = StudentEntryPayment::where('organization_id', $organization['id'])->where('contact_id', $validated['contact_id'])
																		->where('study_year', $validated['study_year'])
																		->first();

		if ($payment) {
			return redirect()->back()->withErrors(['error' => 'Data is existed']);
		}

		$user = Auth::user();
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];
		$validated['created_by_id'] = $user['id'];
		$validated['receivable_value'] = $validated['value'] - $validated['paidValue'];

		$accounts = SchoolAccountSetting::where('organization_id', $organization['id'])->first();
		$entryStudentAccount = Account::find($accounts['entry_student']);
		// buat akun-akun
		$validated['accounts'] = [
			// akun credit (pendapatan)
			[
				'id' => $entryStudentAccount['id'],
				'name' => $entryStudentAccount['name'],
				'code' => $entryStudentAccount['code'],
				'is_cash' => 0,
				'debit' => 0,
				'credit' => $validated['value'],
			]
		];

		// jika tidak dilakukan pembayaran maka debit kan pada akun piutang saja
		if ($validated['paidValue'] === 0) {
			$receivableEntryStudentAccount = Account::find($accounts['receivable_entry_student']);
			$validated['accounts'][] = [
				'id' => $accounts['receivable_entry_student'],
				'name' => $receivableEntryStudentAccount['name'],
				'code' => $receivableEntryStudentAccount['code'],
				'is_cash' => 0,
				'debit' => $validated['value'],
				'credit' => 0,
			];
		}

		// jika dilakukan pembayaran lunas $validated['value'] === $validated['paidValue'] maka debitkan pada akun kas
		if ($validated['paidValue'] === $validated['value']) {
			$cashAccount = Account::find($validated['cash_account_id']);
			$validated['accounts'][] = [
				'id' => $validated['cash_account_id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
				'debit' => $validated['value'],
				'credit' => 0,
			];
		}

		// jika dilakukan pembayaran sebagian atau ada sisa $validated['value'] > $validated['paidValue'] maka lakukan debit pada akun kas dan akun piutang
		if ($validated['paidValue'] > 0 && ($validated['value'] - $validated['paidValue']) > 0) {
			$cashAccount = Account::find($validated['cash_account_id']);
			$validated['accounts'][] = [
				'id' => $validated['cash_account_id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
				'debit' => $validated['paidValue'],
				'credit' => 0,
			];

			$receivableEntryStudentAccount = Account::find($accounts['receivable_entry_student']);
			$validated['accounts'][] = [
				'id' => $accounts['receivable_entry_student'],
				'name' => $receivableEntryStudentAccount['name'],
				'code' => $receivableEntryStudentAccount['code'],
				'is_cash' => 0,
				'debit' => $validated['value'] - $validated['paidValue'],
				'credit' => 0,
			];

		}

		DB::transaction(function () use ($validated, $organization, $user){
			// buat jurnal
				$journal = $this->journalRepository->store($validated);
				$validated['journal_id'] = $journal['id'];
					
				// buat data pada table entry payments
				$payment = StudentEntryPayment::create($validated);
				
				// Buat detail pembayaran
				foreach ($validated['details'] as $detail) {
					if ($detail['value'] > 0) {
						$data = [
							'payment_id' => $payment['id'],
							'student_payment_category_id' => $detail['id'],
							'value' => $detail['value'],
						];
	
						DB::table('s_yearly_payment_details')
							->insert($data);
					}
				}

			// jika ada piutang maka buat data pada piutang
			if ($validated['value'] > $validated['paidValue']) {
				// cek piutang 
				$receivable = StudentEntryReceivable::where('organization_id', $organization['id'])
																							->where('contact_id', $validated['contact_id'])
																							->first();

				$receivableValue = $validated['value'] - $validated['paidValue'];
				if ($receivable) {
					// jika sudah ada data, maka update
					$newValue = $receivable['value'] + $receivableValue;
					$receivable->update([
						'value' => $newValue
					]);

				} else {
					// jika belum, maka buat baru
					$validated['value'] = $receivableValue;
					$receivable = StudentEntryReceivable::create($validated);
				}

				// ledger
				$detail = StudentEntryReceivableLedger::create([
					'receivable_id' => $receivable['id'],
					'created_by_id' => $validated['created_by_id'],
					'payment_id' => $payment['id'],
					'journal_id' => $journal['id'],
					'debit' => $receivableValue,
					'credit' => 0,
					'no_ref' => $validated['no_ref'],
					'description' => $validated['description'],
					'date' => $validated['date'],
					'study_year' => $validated['study_year'],
				]);
			}				

			// send whatsapp
			if ($validated['send_wa']) {
				$whatsAppLog = WhatsappLog::create([
					'organization_id' => $organization['id'],
					'contact_id' => $validated['contact_id'],
					'description' => 'PEMBAYARAN IURAN TAHUNAN SISWA',
					'status' => 'waiting'
				]);

				$contact = Contact::with(['student', 'lastLevel'])->find($validated['contact_id']);
				$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

				$tempDetail = '';
				foreach ($validated['details'] as $key => $detail) {
					if ($detail['value'] > 0) {
						$tempDetail .= "\n" . ($key + 1) . ". " . $detail['name'] . ": IDR. " . number_format($detail['value'], 0, '', '.');
					}
				}

				$tempDetail .= "\nTotal: IDR. " . number_format($validated['value'], 0, '', '.') .
											 "\nJumlah Bayar: IDR. " . number_format($validated['paidValue'], 0, '', '.').
											 "\nSisa: IDR. " . number_format($validated['receivable_value'], 0, '', '.');

				$tempDate = new Carbon($validated['date']);

				$message = "*PEMBAYARAN IURAN TAHUNAN*\n-------------------------------------------------------\nNama : " . $contact['name'] . "\nNo. Siswa : " . $contact->student->no_ref . "\nTahun Masuk : " . $contact->student->entry_year . "\nKelas Sekarang : " . $contact->lastLevel->level . "\n-------------------------------------------------------\nNo. Ref : " . $validated['no_ref'] . "\nHari/Tanggal : " . $tempDate->isoFormat('D MMMM YYYY') . "\nTahun Ajaran: " . $validated['study_year'] . "\n\nDETAIL:" . $tempDetail . "\n\nTTD,\n\n" . strtoupper($organization['name']);
				$data = array(
					'appkey' => $whatsappPlugin['appKey'],
					'authkey' => $whatsappPlugin['authkey'],
					'to' => PhoneNumber::setFormat($contact['phone']),
					'message' => $message,
					'sandbox' => 'false'
				);
	
				SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp');
			}

			// buat log
			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];
	
			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada PEMBAYARAN IURAN TAHUNAN dengan DATA : '.json_encode($log));
		});

		return redirect()->back()->with('success', 'Pembayaran Iuran Tahunan Berhasil Ditambahkan');
	}

	public function edit(Organization $organization, StudentEntryPayment $payment)
	{
		$paymentWithDetail = StudentEntryPayment::with('details', 'receivables')
																	->with('contact', function ($query) {
																		return $query->with('student', 'lastLevel');
																	})
																	->with('journal', function ($query) {
																		return $query->with('ledgers', function ($query){
																			return $query->with('account');
																		});
																	})						
																	->find($payment['id']);

		$user = Auth::user();
		$organizationUser = $user->organizations()->where('organization_id', $organization['id'])->wherePivot('role', "<>", 'viewer')->first();
		
		if (!$organizationUser) {
			return redirect()->back()->withErrors(['message' => 'Pengguna Tidak Memiliki Hak Akses!']);
		}

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
		
		return Inertia::render('StudentEntryPayment/Edit',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => StudentEntryPaymentCategory::whereOrganizationId($organization['id'])
																							->whereIsActive(true)
																							->get(),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-M-DD'),
			'studyYears' => StudentLevel::select('year')->distinct()->take(10)->get(),
			'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
			'payment' => $paymentWithDetail
		]);
	}

	public function update(Request $request, Organization $organization, StudentEntryPayment $payment)
	{
		$rules = [
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
			'value' => [
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
				'exists:student_entry_payment_categories,id'
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
			'paidValue' => [
				'required',
				'numeric',
				'min:0',
			],
			'no_ref' => [
				'required',
				'string',
				Rule::unique('student_entry_payments')->where(function ($query) use ($organization) {
					return $query->where('organization_id', $organization['id']);
				})->ignore($payment['id']),
			],
		];

		$validator = Validator::make($request->all(), $rules);
		$user = Auth::user();

		$validator->sometimes('cash_account_id', 'required|exists:accounts,id', function ($input) {
			return $input->paidValue > 0;  // Hanya validasi 'cash_account_id' jika 'paidValue' bernilai > 0
		});

		$validated = $validator->validated();

		// cek apakah sudah ada transaksi pembayaran antara siswa dan tahun ajaran
		$checkPayment = StudentEntryPayment::where('organization_id', $organization['id'])->where('contact_id', $validated['contact_id'])
																		->where('study_year', $validated['study_year'])
																		->first();

		if ($checkPayment && ($payment['id'] !== (int)$payment['id'])) {
			return redirect()->back()->withErrors(['error' => 'Data is existed']);
		}

		// cek apakah sudah dilakukan pembayaran piutang
		$checkReceivable = StudentEntryReceivableLedger::where('payment_id', $payment['id'])
																										->where('credit', '>', 0)
																										->select('credit')
																										->sum('credit');

		// bandingkan jumlah nilai pembayaran dengan piutang yang telah dibayar
		if (($validated['value'] < (int)$checkReceivable) || ($validated['paidValue'] < (int)$checkReceivable)) {
			return redirect()->back()->withErrors(['error' => 'Jumlah Pembayaran tidak valid']);
		}
		
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];
		$validated['created_by_id'] = $user['id'];

		$validated['receivable_value'] = $validated['value'] - $validated['paidValue'];
		
		// pembayaran selain pembayaran pada piutang
		$tempPaidValue = $validated['paidValue'] - (int)$checkReceivable;
		$validated['paidValue'] = $tempPaidValue;

		$accounts = SchoolAccountSetting::where('organization_id', $organization['id'])->first();
		$entryStudentAccount = Account::find($accounts['entry_student']);
		// buat akun-akun
		$validated['accounts'] = [
			// akun credit (pendapatan)
			[
				'id' => $entryStudentAccount['id'],
				'name' => $entryStudentAccount['name'],
				'code' => $entryStudentAccount['code'],
				'is_cash' => 0,
				'debit' => 0,
				'credit' => $validated['value'],
			]
		];

		// jika tidak dilakukan pembayaran maka debit kan pada akun piutang saja
		if ($validated['paidValue'] === 0) {
			$receivableEntryStudentAccount = Account::find($accounts['receivable_entry_student']);
			$validated['accounts'][] = [
				'id' => $accounts['receivable_entry_student'],
				'name' => $receivableEntryStudentAccount['name'],
				'code' => $receivableEntryStudentAccount['code'],
				'is_cash' => 0,
				'debit' => $validated['value'],
				'credit' => 0,
			];
		}

		// jika dilakukan pembayaran lunas $validated['value'] === $validated['paidValue'] maka debitkan pada akun kas
		if ($validated['paidValue'] === $validated['value']) {
			$cashAccount = Account::find($validated['cash_account_id']);
			$validated['accounts'][] = [
				'id' => $validated['cash_account_id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
				'debit' => $validated['value'],
				'credit' => 0,
			];
		}

		// jika dilakukan pembayaran sebagian atau ada sisa $validated['value'] > $validated['paidValue'] maka lakukan debit pada akun kas dan akun piutang
		if ($validated['paidValue'] > 0 && ($validated['value'] - $validated['paidValue']) > 0) {
			$cashAccount = Account::find($validated['cash_account_id']);
			$validated['accounts'][] = [
				'id' => $validated['cash_account_id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
				'debit' => $validated['paidValue'],
				'credit' => 0,
			];

			$receivableEntryStudentAccount = Account::find($accounts['receivable_entry_student']);
			$validated['accounts'][] = [
				'id' => $accounts['receivable_entry_student'],
				'name' => $receivableEntryStudentAccount['name'],
				'code' => $receivableEntryStudentAccount['code'],
				'is_cash' => 0,
				'debit' => $validated['value'] - $validated['paidValue'],
				'credit' => 0,
			];
		}

		DB::transaction(function () use ($validated, $organization, $user, $payment, $checkReceivable){
			// cek apakah sudah dibuatkan piutang
			// jika sudah ada maka kurangi piutang
			$studentReceivable = StudentEntryReceivable::where('organization_id', $organization['id'])
																							->where('contact_id', $validated['contact_id'])
																							->first();
			$tempStudentReceivableValue = 0;
			if ($studentReceivable) {

				// cek apakah jika piutang baru lebih kecil dari jumlah yang telah dibayarkan, maka kirimkan pesan error
				$receivableDetails = StudentEntryReceivableLedger::where('payment_id', $payment['id']);

				$sumCredit = $receivableDetails->sum('credit');

				// if ($validated['receivable_value'] < $sumCredit) {
				// 	return redirect()->back()->withErrors(['error' => 'Jumlah Pembayaran tidak valid']);
				// }

				$tempStudentReceivableValue = $studentReceivable['value'] - $payment['receivable_value'] + $validated['receivable_value'];

				$studentReceivable->update([
					'value' => $tempStudentReceivableValue
				]);

				$debitData = $receivableDetails->where('debit', '>', 0)->first();

				$debitData->update([
					'no_ref' => $validated['no_ref'],
					'description' => $validated['description'],
					'date' => $validated['date'],
					'study_year' => $validated['study_year'],
					'debit' => $validated['receivable_value'] + $checkReceivable,
				]);
			}

			// hapus detail pembayaran
			DB::table('s_yearly_payment_details')
					->where('payment_id', $payment['id'])
					->delete();

			$payment->update($validated);

			// Buat detail pembayaran
			foreach ($validated['details'] as $detail) {
				if ($detail['value'] > 0) {
					$data = [
						'payment_id' => $payment['id'],
						'student_payment_category_id' => $detail['id'],
						'value' => $detail['value'],
					];

					DB::table('s_yearly_payment_details')
						->insert($data);
				}
			}

			// jika ada piutang maka buat data pada piutang
			if (($validated['value'] > $validated['paidValue']) && !$studentReceivable) {
				$receivable = StudentEntryReceivable::create($validated);

				// ledger
				$detail = StudentEntryReceivableLedger::create([
					'receivable_id' => $receivable['id'],
					'created_by_id' => $validated['created_by_id'],
					'payment_id' => $payment['id'],
					'journal_id' => $journal['id'],
					'debit' => $validated['receivable_value'] + $checkReceivable,
					'credit' => 0,
					'no_ref' => $validated['no_ref'],
					'description' => $validated['description'],
					'date' => $validated['date'],
					'study_year' => $validated['study_year'],
				]);
			}		

			// journal
			$this->journalRepository->update($validated, $payment->journal);

			// buat log
			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];

			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada PEMBAYARAN IURAN TAHUNAN dengan DATA : '.json_encode($log));
		});

		return redirect()->back()->with('success', 'Pembayaran Iuran Tahunan Berhasil Diubah');
	}

	public function show(Organization $organization, StudentEntryPayment $payment)
	{
		$user = Auth::user();

		$paymentWithDetail = StudentEntryPayment::with('details')->find($payment['id']);
		
		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('StudentEntryPayment/Show',[
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'user' => $user,
			'payment' => $paymentWithDetail,
			'contact' => Contact::with(['student', 'lastLevel'])->find($payment['contact_id']),
		]);
	}

	public function destroy(Organization $organization, StudentEntryPayment $payment)
	{
		// cek apakah sudah dilakukan pembayaran piutang
		$receivableLedger = StudentEntryReceivableLedger::where('payment_id', $payment['id']);

		if ($receivableLedger->where('credit', '>', 0)->count() > 0) {
			return redirect()->back()->withErrors(['error' => "Pembayaran tidak dapat dihapus"]);
		}

		$user = Auth::user();

		DB::transaction(function () use ($receivableLedger, $payment, $user){

			// hapus detail pembayaran
			DB::table('s_yearly_payment_details')
					->where('payment_id', $payment['id'])
					->delete();

			// hapus detail piutang
			$receivableDetail = StudentEntryReceivableLedger::where('payment_id', $payment['id'])->first();

			if ($receivableDetail) {
				$receivableDetail->delete();

				// kurangi piutang siswa
				$studentReceivable = StudentEntryReceivable::where('contact_id', $payment['contact_id'])
																										->first();

				$newStudentReceivableValue = $studentReceivable['value'] - $payment['receivable_value'];

				$studentReceivable->update([
					'value' => $newStudentReceivableValue
				]);
			}
			
			DB::table('s_yearly_payment_details')
					->where('payment_id', $payment['id'])
					->delete();

			$journal = Journal::find($payment['journal_id']);
			$payment->delete();

			$journal->delete();

			// buat log
			$log = [
				'description' => $journal['description'],
				'date' => $journal['date'],
				'no_ref' => $journal['no_ref'],
				'value' => $journal['value'],
			];
	
			$this->logRepository->store($payment['organization_id'], strtoupper($user['name']).' telah menghapus DATA pada PEMBAYARAN IURAN TAHUNAN dengan DATA : '.json_encode($log));
		});

		return redirect()->back()->with('success', 'Pembayaran Iuran Tahunan Berhasil Dihapus');

	}

	public function sendWhatsapp(Request $request, Organization $organization, StudentEntryPayment $payment)
	{
		if ($request['send_wa']) {
			$whatsAppLog = WhatsappLog::create([
				'organization_id' => $organization['id'],
				'contact_id' => $request['contact_id'],
				'description' => 'PEMBAYARAN IURAN TAHUNAN SISWA',
				'status' => 'waiting'
			]);

			$contact = Contact::with(['student', 'lastLevel'])->find($request['contact_id']);
			$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

			$tempDetail = '';
			foreach ($request['details'] as $key => $detail) {
				if ($detail['value'] > 0) {
					$tempDetail .= "\n" . ($key + 1) . ". " . $detail['name'] . ": IDR. " . number_format($detail['value'], 0, '', '.');
				}
			}

			$tempDetail .= "\nTotal: IDR. " . number_format($request['value'], 0, '', '.') .
										 "\nJumlah Bayar: IDR. " . number_format($request['paidValue'], 0, '', '.').
										 "\nSisa: IDR. " . number_format($request['receivable_value'], 0, '', '.');

			$tempDate = new Carbon($request['date']);

			$message = "*PEMBAYARAN IURAN TAHUNAN*\n-------------------------------------------------------\nNama : " . $contact['name'] . "\nNo. Siswa : " . $contact->student->no_ref . "\nTahun Masuk : " . $contact->student->entry_year . "\nKelas Sekarang : " . $contact->lastLevel->level . "\n-------------------------------------------------------\nNo. Ref : " . $request['no_ref'] . "\nHari/Tanggal : " . $tempDate->isoFormat('D MMMM YYYY') . "\nTahun Ajaran: " . $request['study_year'] . "\n\nDETAIL:" . $tempDetail . "\n\nTTD,\n\n" . strtoupper($organization['name']);
			$data = array(
				'appkey' => $whatsappPlugin['appKey'],
				'authkey' => $whatsappPlugin['authkey'],
				'to' => PhoneNumber::setFormat($contact['phone']),
				'message' => $message,
				'sandbox' => 'false'
			);

			SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp');
		}
		return redirect()->back()->with('success', 'Rincian Pembayaran Iuran Tahunan telah diteruskan Via Whatsapp');
	}
}
