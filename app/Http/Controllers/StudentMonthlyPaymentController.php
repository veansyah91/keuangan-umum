<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Ledger;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Journal;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentPaymentCategory;
use App\Repositories\Log\LogRepository;
use App\Models\StudentMonthlyReceivable;
use App\Repositories\User\UserRepository;
use App\Models\StudentMonthlyReceivableLedger;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentMonthlyPaymentController extends Controller
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
		$date = $dateRequest ?? $now->isoFormat('YYYY-MM-DD');
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

		$type = request('type') ?? 'now' ;

		$search = request(['search']);

		return Inertia::render('StudentMonthlyPayment/Index',[
			'organization' => $organization,
			'payments' => StudentMonthlyPayment::filter(request(['search']))  
																	->when($type !== 'all' ?? false, function ($query) use ($type){
																			$query->where('type', $type);
																	} )
																	->with('contact', function ($query) {
																			$query->with('student');
																	})
																	->with('receivableLedger')
																	->whereOrganizationId($organization['id'])
																	->orderBy('study_year', 'desc')
																	->orderBy('month', 'desc')
																	->orderBy('date', 'desc')
																	->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'type' => request('type') ?? 'now'
		]);
	}

	public function create(Organization $organization)
	{
		$user = Auth::user();

		$contactCategory = ContactCategory::whereOrganizationId($organization['id'])
																				->whereName('SISWA')
																				->first();

		if (!$contactCategory) {
			return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak SISWA terlebih dahulu!']);
		}

		$historyCategories = [];
		$historyPayment = null;

		if (request('selectedContact')) {
			// cek piutang
			$historyPayment = StudentMonthlyPayment::whereContactId(request('selectedContact'))
																	->where('month', request('month'))
																	->where('study_year', request('studyYear'))
																	->where('type', 'receivable')
																	->first();

			if ($historyPayment) {
					$historyCategories = DB::table('s_monthly_payment_details')
																	->where('payment_id', $historyPayment['id'])
																	->get();
			}
		}

		return Inertia::render('StudentMonthlyPayment/Create',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
																							->whereIsActive(true)
																							->get(),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'studyYears' => StudentLevel::select('year')->distinct()->take(10)->get(),
			'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
			'historyPayment' => Inertia::lazy(fn () => $historyPayment),
			'historyCategories' => Inertia::lazy(fn () => $historyCategories),
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
			'value' => [
				'required',
				'numeric',
			],
			'type' => [
				'required',
				'in:now,prepaid,receivable',
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
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			],
			'description' => [
				'string',
				'nullable'
			]
		]);

		$user = Auth::user();
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];
		$validated['created_by_id'] = $user['id'];
		$validated['no_ref'] = $request['no_ref'];

		// cek apakah pembayaran sudah dilakukan
		$payment = StudentMonthlyPayment::whereOrganizationId($organization['id'])
																			->whereContactId($validated['contact_id'])
																			->where('month', $validated['month'])
																			->where('study_year', $validated['study_year'])
																			->first();

		if ($payment) {
			if ($payment['type'] !== 'receivable') {
				return redirect()->back()->withErrors(['error' => 'Data is existed']);
			}
		}

		$schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();
		$creditAccount = Account::find($schoolAccount['revenue_student']);

		if ($validated['type'] == 'prepaid') 
		{
			// buat penjurnalan pembayaran iuran bulanan dibayar dimuka
			$creditAccount = Account::find($schoolAccount['prepaid_student']);

		} elseif ($validated['type'] == 'receivable')
		{
			// cek apakah ada piutang siswa di bulan yang akan dilakukan pembayaran
			$creditAccount = Account::find($schoolAccount['receivable_monthly_student']);
		}

		$cashAccount = Account::find($validated['cash_account_id']);

		$validated['accounts'] = [
			[
				'id' => $cashAccount['id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
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

		if ($payment) {
			// if ($payment['type'] !== 'receivable') {
			// 	return redirect()->back()->withErrors(['error' => 'Data is existed']);
			// }

			DB::transaction(function() use ($organization, $payment, $validated){				
				$journal = $this->journalRepository->store($validated);
				$validated['journal_id'] = $journal['id'];
				
				$payment->update([
					'journal_id' => $validated['journal_id'],
					'type' => 'now',
					'date' => $validated['date']
				]);
	
				$receivable = StudentMonthlyReceivable::whereOrganizationId($organization['id'])
																								->whereContactId($validated['contact_id'])
																								->first();

				$newValue = $receivable['value'] - $validated['value'];
				$receivable->update([
					'value' => $newValue
				]);

				$receivableLedger = StudentMonthlyReceivableLedger::wherePaymentId($payment['id'])->first();

				$receivableLedger->update([
					'credit' => $validated['value'],
					'paid_date' => $validated['date']
				]);
			});			
		}

		// jika belum ada data payment buat data payment baru        
		if (!$payment) {
			// validasi input no_ref
			$payment = StudentMonthlyPayment::whereOrganizationId($organization['id'])
																				->where('no_ref', $validated['no_ref'])
																				->first();

			if ($payment) {
				return redirect()->back()->withErrors(['no_ref' => 'Data is existed']);
			}

			DB::transaction(function() use ($validated){
				$journal = $this->journalRepository->store($validated);

				$validated['journal_id'] = $journal['id'];

				if ($validated['type'] == 'receivable') {
					$validated['type'] = 'now';
				}
	
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

				// throw new \Exception('Something went wrong');
			});			
		}      

		$log = [
			'description' => $validated['description'],
			'date' => $validated['date'],
			'no_ref' => $validated['no_ref'],
			'value' => $validated['value'],
		];

		$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada PEMBAYARAN IURAN BULANAN dengan DATA : '.json_encode($log));

		return redirect(route('cashflow.student-monthly-payment.create', $organization['id']))->with('success', 'Pembayaran Iuran Bulanan Berhasil Ditambahkan');

	}

	public function edit(Organization $organization, StudentMonthlyPayment $payment)
	{		
		$user = Auth::user();

		$payment->with('details');

		// cek apakah data berasal dari piutang
		$ledger = StudentMonthlyReceivableLedger::where('payment_id', $payment['id'])->first();

		if ($ledger) {
			return redirect()->back()->withErrors(['message' => "Data can't be deleted"]);
		}

		$contactCategory = ContactCategory::whereOrganizationId($organization['id'])
																				->whereName('SISWA')
																				->first();

		if (!$contactCategory) {
			return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak SISWA terlebih dahulu!']);
		}

		$historyCategories = [];
		$historyPayment = null;

		if (request('selectedContact')) {
			// cek piutang
			$historyPayment = StudentMonthlyPayment::whereContactId(request('selectedContact'))
																	->where('month', request('month'))
																	->where('study_year', request('studyYear'))
																	->where('type', 'receivable')
																	->first();

			if ($historyPayment) {
				$historyCategories = DB::table('s_monthly_payment_details')
																->where('payment_id', $historyPayment['id'])
																->get();
			}
		}

		$ledger = Ledger::whereJournalId($payment['journal_id'])->where('debit', '>', 0)->first();

		return Inertia::render('StudentMonthlyPayment/Edit',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
																							->whereIsActive(true)
																							->get(),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'studyYears' => StudentLevel::select('year')->distinct()->take(10)->get(),
			'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
			'historyPayment' => Inertia::lazy(fn () => $historyPayment),
			'historyCategories' => Inertia::lazy(fn () => $historyCategories),
			'payment' => $payment,
			'contact' => Contact::with(['student', 'lastLevel'])->find($payment['contact_id']),
			'details' => DB::table('s_monthly_payment_details')->where('payment_id', $payment['id'])->get(),
			'debitAccount' => Account::find($ledger['account_id'])
		]);
	}

	public function update(Request $request, Organization $organization, StudentMonthlyPayment $payment)
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
			'value' => [
				'required',
				'numeric',
			],
			'type' => [
				'required',
				'in:now,prepaid,receivable',
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
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			],
			'description' => [
				'string',
				'nullable'
			],
			'no_ref' => [
						'required',
						'string',
						Rule::unique('student_monthly_payments')->where(function ($query) use ($organization) {
								return $query->where('organization_id', $organization['id']);
						})->ignore($payment['id']),
				],
		]);

		$user = Auth::user();
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];

		// cek apakah pembayaran sudah dilakukan
		$tempPayment = StudentMonthlyPayment::whereOrganizationId($organization['id'])
																			->whereContactId($validated['contact_id'])
																			->where('month', $validated['month'])
																			->where('study_year', $validated['study_year'])
																			->first();
		
		if ($tempPayment) {
			if (($tempPayment['id'] !== $payment['id'])) {
				return redirect()->back()->withErrors(['error' => 'Data is existed']);
			}
		}

		$schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();
		$creditAccount = Account::find($schoolAccount['revenue_student']);

		if ($validated['type'] == 'prepaid')
		{
			// cek apakah ada piutang siswa di bulan yang akan dilakukan pembayaran
			$creditAccount = Account::find($schoolAccount['prepaid_student']);
		}

		$cashAccount = Account::find($validated['cash_account_id']);

		$validated['accounts'] = [
			[
				'id' => $cashAccount['id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
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

		$validated['debit_id'] = $cashAccount['id'];
		$validated['credit_id'] = $creditAccount['id'];

		DB::transaction(function() use ($validated, $payment, $creditAccount){
			//cek apakah telah dilakukan penjurnalan otomatis apakah pendapatan iuran adalah pendapatan dibayar dimuka atau tidak
			$ledger = Ledger::whereJournalId($payment['journal_id'])->where('credit', '>', 0)->count();

			// jika ledger > 1, berarti telah terjadi  pendapatan dari pembayaran di muka
			// journal
			$this->journalRepository->update($validated, $payment->journal);

			if ($ledger > 1) {
				$paymentAccount = Account::find($schoolAccount['revenue_student']);

				$accounts = [
					[
						'id' => $creditAccount['id'],
						'name' => $creditAccount['name'],
						'code' => $creditAccount['code'],
						'is_cash' => 0,
						'debit' => $validated['value'],
						'credit' => 0,
					],
					[
						'id' => $paymentAccount['id'],
						'name' => $paymentAccount['name'],
						'code' => $paymentAccount['code'],
						'is_cash' => 0,
						'debit' => 0,
						'credit' => $validated['value'],
					]
				];

				foreach ($accounts as $account) {
					Ledger::create($account);
				}
			}

			// update payment
			$payment->update($validated);

			// update detail
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

					DB::table('s_monthly_payment_details')
						->insert($data);
				}
			}			
		});

		$log = [
			'description' => $validated['description'],
			'date' => $validated['date'],
			'no_ref' => $validated['no_ref'],
			'value' => $validated['value'],
		];

		$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada PEMBAYARAN IURAN BULANAN dengan DATA : '.json_encode($log));

		return redirect()->back()->with('success', 'Pembayaran Iuran Bulanan Berhasil Diubah');

	}

	public function show(Organization $organization, $id)
	{
		$user = Auth::user();

		$payment = StudentMonthlyPayment::with('details')->find($id);

		return Inertia::render('StudentMonthlyPayment/Show',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'payment' => $payment,
			'contact' => Contact::with(['student', 'lastLevel'])->find($payment['contact_id']),
		]);
	}

	public function destroy(Organization $organization, StudentMonthlyPayment $payment)
	{
		// cek pada receivable ledger
		$ledger = StudentMonthlyReceivableLedger::where('payment_id', $payment['id'])->first();

		// jika bersumber dari piutang maka update piutang
		if ($ledger) {
			DB::transaction(function() use ($ledger, $organization, $payment) {
				$value = $ledger['credit'];

				// update ledger
				$ledger->update([
					'credit' => 0,
					'paid_date' => null
				]);

				// update student monthly receivable
				$receivable = StudentMonthlyReceivable::where('organization_id', $organization['id'])
																							->where('contact_id', $payment['contact_id'])
																							->first();

				$value += $receivable['value'];
				$receivable->update([
					'value' => $value
				]);

				$journal = Journal::find($payment['journal_id']);

				// update payment
				$payment->update([
					'journal_id' => null,
					'type' => 'receivable',
					'date' => $ledger['date']
				]);

				// hapus jurnal
				$journal->delete();

				return redirect()->back()->with('success', 'Data Pembayaran Berhasil Dihapus');
			});
		}

		if (!$ledger) {
			DB::transaction(function () use ($payment, $organization) {
				$journal = Journal::find($payment['journal_id']);

				DB::table('s_monthly_payment_details')
					->where('payment_id', $payment['id'])
					->delete();
					
				$payment->delete();
				$journal->delete();
			});

		}
	}
}
