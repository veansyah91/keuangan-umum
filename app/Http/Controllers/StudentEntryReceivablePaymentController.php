<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Contact;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\StudentEntryPayment;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentEntryReceivable;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Models\StudentEntryReceivableLedger;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentEntryReceivablePaymentController extends Controller
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
		$refHeader = 'REP-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
		$newRef = $refHeader.'0001';

		$payment = StudentEntryReceivableLedger::whereHas('payment', function ($query) use ($organization){
			return $query->where('organization_id', $organization['id']);
		})
				->where('credit', '>', 0)
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('REP-', $payment['no_ref']);
		}

		return $newRef;
	}

	public function index(Organization $organization)
	{
		$user = Auth::user();
		$search = request(['search']);
		return Inertia::render('StudentEntryReceivablePayment/Index', [
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'searchFilter' => $search,
			'organization' => $organization,
			'studyYears' => StudentLevel::select('year')->distinct()->get(),
			'studyYear' => request('studyYear'),
			'receivablePayments' => StudentEntryReceivableLedger::whereHas('payment', function ($query) use ($organization){
												return $query->where('organization_id', $organization['id']);
											})
											->with('payment', function ($query) {
												return $query->with('contact', function ($query){
													return $query->with(['student', 'lastLevel']);
												});
											})									
											->where('credit', '>', 0)
											->orderBy('study_year', 'desc')
											->orderBy('date', 'desc')
											->orderBy('no_ref', 'desc')
											->paginate(50)->withQueryString(),
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

		return Inertia::render('StudentEntryReceivablePayment/Create',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'contacts' => $this->contactRepository->getStudentEntryReceivable($organization['id'], $contactCategory['id'], request(['contact'])),
			'contact' => request('contact'),
			'selectedContactQuery' => Contact::with(['contactCategories', 'student', 'lastLevel'])->find(request('selectedContact')),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),			
			'payments' => StudentEntryPayment::where('contact_id', request('selectedContact'))
																				->where('receivable_value', '>', 0)
																				->select('id', 'receivable_value', 'no_ref', 'study_year', 'organization_id')
																				->get(),
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
			'paidValue' => [
				'required',
				'numeric',
			],
			'description' => [
				'string',
				'nullable'
			],
			'payment_id' => [
				'required',
				'exists:student_entry_payments,id',
			],
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			],
		]);

		$checkRule = StudentEntryReceivableLedger::whereHas('payment', function ($query) use ($organization){
																								return $query->whereOrganizationId($organization['id']);
																							})
																							->where('no_ref', $request['no_ref'])
																							->first();
		if ($checkRule) {
			return redirect()->back()->withErrors(['no_ref' => 'No Ref is invalid']);
		}

		$validated['no_ref'] = $request['no_ref'];
		$user = Auth::user();
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];
		$validated['created_by_id'] = $user['id'];
		$validated['receivable_value'] = $validated['value'] - $validated['paidValue'];

		$accounts = SchoolAccountSetting::where('organization_id', $organization['id'])->first();
		$receivableStudentAccount = Account::find($accounts['receivable_entry_student']);

		$cashAccount = Account::find($validated['cash_account_id']);

		$validated['accounts'] = [
			// akun debit (kas)
			[
				'id' => $cashAccount['id'],
				'name' => $cashAccount['name'],
				'code' => $cashAccount['code'],
				'is_cash' => 1,
				'debit' => $validated['paidValue'],
				'credit' => 0,
			],

			// akun credit (piutang)
			[
				'id' => $receivableStudentAccount['id'],
				'name' => $receivableStudentAccount['name'],
				'code' => $receivableStudentAccount['code'],
				'is_cash' => 0,
				'debit' => 0,
				'credit' => $validated['paidValue'],
			]
		];
	
		DB::transaction(function () use ($validated, $organization, $user){
			$validated['value'] = $validated['receivable_value'];

			// buat jurnal
			$journal = $this->journalRepository->store($validated);
			$validated['journal_id'] = $journal['id'];

			// update receivable per contact
			$receivable = StudentEntryReceivable::where('contact_id', $validated['contact_id'])
																					->first();

			$tempReceivableValue = $receivable['value'] - $validated['paidValue'];
			$receivable->update([
				'value' => $tempReceivableValue
			]);

			// update receivable value in payments
			$payment = StudentEntryPayment::find($validated['payment_id']);
			
			$tempPaymentValue = $payment['receivable_value'] - $validated['paidValue'];
			$payment->update([
				'receivable_value' => $tempPaymentValue
			]);

			$receivablePayment = StudentEntryReceivableLedger::create([
				'receivable_id' => $receivable['id'],
				'created_by_id' => $validated['created_by_id'],
				'payment_id' => $payment['id'],
				'journal_id' => $journal['id'],
				'debit' => 0,
				'credit' => $validated['paidValue'],
				'no_ref' => $validated['no_ref'],
				'description' => $validated['description'],
				'date' => $validated['date'],
				'study_year' => $payment['study_year'],
			]);

			// buat log
			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];
	
			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada PEMBAYARAN PIUTANG IURAN TAHUNAN dengan DATA : '.json_encode($log));
		});

		return redirect(route('cashflow.student-entry-receivable-payment.create', $organization['id']))->with('success', 'Pembayaran Iuran Tahunan Berhasil Ditambahkan');
	}

	public function edit(Organization $organization, $id)
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

		return Inertia::render('StudentEntryReceivablePayment/Edit',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'contacts' => $this->contactRepository->getStudentEntryReceivable($organization['id'], $contactCategory['id'], request(['contact'])),
			'contact' => request('contact'),
			'selectedContactQuery' => Contact::with(['contactCategories', 'student', 'lastLevel'])->find(request('selectedContact')),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),			
			'payments' => StudentEntryPayment::where('contact_id', request('selectedContact'))
																				->where('receivable_value', '>', 0)
																				->select('id', 'receivable_value', 'no_ref', 'study_year', 'organization_id')
																				->get(),
			'receivablePayment' => StudentEntryReceivableLedger::find($id),
		]);
	}
}
