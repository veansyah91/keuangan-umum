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
use App\Models\ContactStaff;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\SalaryCategory;
use App\Models\ContactCategory;
use App\Models\StaffSalaryPayment;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Models\StaffSalaryPaymentDetail;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StaffSalaryPaymentController extends Controller
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
		$refHeader = 'PG-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
		$newRef = $refHeader.'0000';

		$payment = StaffSalaryPayment::whereOrganizationId($organization['id'])
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('PG-', $payment['no_ref']);
		}

		return $newRef;
	}

  public function index(Organization $organization)
	{
		$user = Auth::user();

		$search = request(['search']);
		
		return Inertia::render('StaffSalaryPayment/Index',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
			'newRef' => Inertia::lazy(fn () => $this->newRef($organization, request('date'))),
			'payments' => StaffSalaryPayment::where('organization_id', $organization['id'])
																			->with('journal', function ($query){
																				return $query->with('ledger', function ($query){
																					return $query->with('account')
																											->where('debit', '>', 0);
																				});
																			})
																			->orderBy('date', 'desc')
																			->paginate(50)->withQueryString(),
		]);
	}

  public function create(Organization $organization)
	{
		$user = Auth::user();

		$contactCategory = ContactCategory::whereOrganizationId($organization['id'])
																				->whereName('STAF')
																				->first();

		if (!$contactCategory) {
			return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak STAF terlebih dahulu!']);
		}

		return Inertia::render('StaffSalaryPayment/Create',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => SalaryCategory::where('is_active', true)
																			->where('organization_id', $organization['id'])																			
																			->orderBy('has_hour', 'asc')
																			->orderBy('is_cut', 'asc')
																			->get(),
			'history' => StaffSalaryPayment::where('organization_id', $organization['id'])
																			->with('details')
																			->latest()
																			->first(),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
			'studyYears' => StudentLevel::select('year')->distinct()->take(10)->get(),
			'contacts' => ContactStaff::whereHas('contact', function ($query) use ($organization){
																		return $query->where('organization_id', $organization['id'])
																								->where('is_active', true);
																	})
																	->with('contact')
																	->get()
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$validated = $request->validate([
			'value' => 'numeric|required',
			'date' => 'required|date',
			'no_ref' => 'string|required',
			'month' => 'required|numeric',
			'study_year' => 'required|string',
			'details' => 'required',
			'details.*.id' => 'required|exists:contacts,id',
			'details.*.value' => 'required|numeric',
			'details.*.categories' => 'required',
			'details.*.categories.*.id' => 'required|exists:salary_categories,id',
			'details.*.categories.*.id' => 'required|numeric',
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			],
		]);

		$user = Auth::user();
		$validated['description'] = 'Pembayaran Gaji Staf pada Bulan: ' . $validated['month'] . ', Tahun: ' . $validated['study_year'];
		$validated['organization_id'] = $organization['id'];
		$validated['user_id'] = $user['id'];
		$validated['created_by_id'] = $user['id'];

		// tautkan akun-akun
		$schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();
		$debitAccount = Account::find($schoolAccount['staff_salary_expense']);
		$creditAccount = Account::find($validated['cash_account_id']);
		$validated['accounts'] = [
			[
				'id' => $creditAccount['id'],
				'name' => $creditAccount['name'],
				'code' => $creditAccount['code'],
				'is_cash' => 1,
				'debit' => $validated['value'],
				'credit' => 0,
			],
			[
				'id' => $debitAccount['id'],
				'name' => $debitAccount['name'],
				'code' => $debitAccount['code'],
				'is_cash' => 0,
				'debit' => 0,
				'credit' => $validated['value'],
			],
		];		

		// validasi apakah sudah ada data dengan parameter bulan dan tahun yang sama
		$payment = StaffSalaryPayment::where('organization_id', $organization['id'])
																	->where('study_year', $validated['study_year'])
																	->where('month', $validated['month'])
																	->first();

		if ($payment)
		{
			return redirect()->back()->withErrors(['error' => 'Data is existed']);
		}

		DB::transaction(function() use ($validated, $organization, $user) {
			// buat jurnal
			$journal = $this->journalRepository->store($validated);
			$validated['journal_id'] = $journal['id'];

			// salary payment
			$payment = StaffSalaryPayment::create($validated);

			foreach ($validated['details'] as $detail) {
				$data = [];
				foreach ($detail['categories'] as $category) {
					$data[] = [
						'contact_id' => $detail['id'],
						'category_id' => $category['id'],
						'payment_id' => $payment['id'],
						'value' => $category['total'],
						'qty' => $category['qty'],
						'created_at' => $this->now->format('Y-m-d H:i:s'),
						'updated_at' => $this->now->format('Y-m-d H:i:s'),
					];
				}

				// salary payment details
				StaffSalaryPaymentDetail::insert($data);
			}

			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];
	
			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada PEMBAYARAN GAJI STAF dengan DATA : '.json_encode($log));
		});
		
		return redirect(route('cashflow.staff-salary-payment', $organization['id']))->with('success', 'Pembayaran Gaji Staff Berhasil');
	}

<<<<<<< Updated upstream
	public function update(Request $request, Organization $organization, StaffSalaryPayment $payment)
	{
		$validated = $request->validate([
			'value' => 'numeric|required',
			'date' => 'required|date',
			'no_ref' => 'string|required',
			'month' => 'required|numeric',
			'study_year' => 'required|string',
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			],
		]);

		$validated['description'] = 'Pembayaran Gaji Staf pada Bulan: ' . $validated['month'] . ', Tahun: ' . $validated['study_year'];
		$user = Auth::user();

		DB::transaction(function() use ($payment, $organization, $validated, $user) {
			// update payment
			$payment->update($validated);

			// update journal
			$journal = Journal::find($payment['journal_id']);
			$journal->update([
				'no_ref' => $validated['no_ref'],
				'date' => $validated['date'],
				'description' => $validated['description'],
			]);

			// update ledger
			$ledger = Ledger::whereJournalId($journal['id'])
												->where('debit', '>', 0)
												->first();

			$ledger->update([
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'account_id' => $validated['cash_account_id'],
				'description' => $validated['description'],
			]);

			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];
	
			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada PEMBAYARAN GAJI STAF dengan DATA : '.json_encode($log));
		});

		return redirect()->back()->with('success', 'Pembayaran Gaji Staff Berhasil Diubah');
	}

=======
>>>>>>> Stashed changes
	public function show(Organization $organization, $id)
	{
		$payment = StaffSalaryPayment::find($id);
		if (!$payment) {
			return abort(404);
		}
		$user = Auth::user();

		$details = StaffSalaryPaymentDetail::join('contacts', 's_salary_payment_details.contact_id', '=', 'contacts.id')
																				->join('contact_staff', 's_salary_payment_details.contact_id', '=', 'contact_staff.contact_id')
																				->when(request('search') ?? false, function ($query, $search) {
																					return $query->where('contacts.name', 'like', '%'.$search.'%')
																												->orWhere('contact_staff.no_ref', 'like', '%'.$search.'%');
																				})
																				->where('s_salary_payment_details.payment_id', $id)
																				->select('s_salary_payment_details.contact_id', 'contacts.name', 'contact_staff.position', 'contact_staff.no_ref',DB::raw('SUM(value) as total'))
																				->groupBy('s_salary_payment_details.contact_id','contact_staff.position', 'contact_staff.no_ref')
																				->orderBy('contacts.name', 'asc')
																				->paginate(50);

		return Inertia::render('StaffSalaryPayment/Show',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'details' => $details,
			'payment' => $payment,
		]);
	}

	public function editStaff(Organization $organization, $id, $staff)
	{
		$payment = StaffSalaryPayment::find($id);
		$contact = Contact::with('staff')->find($staff);
		if (!$payment || !$contact) {
			return abort(404);
		}

		$payment['details'] = StaffSalaryPaymentDetail::where('payment_id', $id)->where('contact_id', $staff)->get();		

		$user = Auth::user();
		
		return Inertia::render('StaffSalaryPayment/Edit', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => SalaryCategory::where('is_active', true)
																			->where('organization_id', $organization['id'])																			
																			->orderBy('has_hour', 'asc')
																			->orderBy('is_cut', 'asc')
																			->get(),
			'payment' => $payment,
			'contact' => $contact,
		]);
	}

	public function updateStaff(Request $request, Organization $organization, StaffSalaryPayment $payment, Contact $staff)
	{
		$validated = $request->validate([
			'value' => 'required|numeric',
			'details' => 'required',
			'details.*.id' => 'required|exists:salary_categories,id',
			'details.*.qty' => 'required|numeric|min:0',
			'details.*.total' => 'required|numeric'
		]);

		$user = Auth::user();
		
		DB::transaction(function() use ($validated, $organization, $staff, $payment, $user){
			// dapatkan nilai sebelumnya
			$updateValue = $payment['value'];
			$oldValue = StaffSalaryPaymentDetail::where('payment_id', $payment['id'])->where('contact_id', $staff['id'])->sum('value');
			$updateValue = $payment['value'] - (int)$oldValue + $validated['value'];

			// perbarui jurnal dan ledger
			$journal = Journal::find($payment['journal_id']);
			$journal->update([
				'value' => $updateValue
			]);

			$ledgers = Ledger::whereJournalId($payment['journal_id'])->get();
			foreach ($ledgers as $ledger) {
				if ($ledger['debit'] > 0) {
					$ledger->update([
						'debit' => $updateValue
					]);
				} else {
					$ledger->update([
						'credit' => $updateValue
					]);
				}
			}

			// perbarui payment
			$payment->update([
				'value' => $updateValue
			]);

			// hapus detail
			StaffSalaryPaymentDetail::where('payment_id', $payment['id'])->where('contact_id', $staff['id'])->delete();

			// buat baru
			foreach ($validated['details'] as $detail) {
				$data[] = [
					'contact_id' => $staff['id'],
					'category_id' => $detail['id'],
					'payment_id' => $payment['id'],
					'value' => $detail['total'],
					'qty' => $detail['qty'],
					'created_at' => $this->now->format('Y-m-d H:i:s'),
					'updated_at' => $this->now->format('Y-m-d H:i:s'),
				];
			}

			// salary payment details
			StaffSalaryPaymentDetail::insert($data);

			$log = [
				'description' => $payment['description'],
				'date' => $payment['date'],
				'no_ref' => $payment['no_ref'],
				'value' => $payment['value'],
			];
	
			$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada PEMBAYARAN GAJI STAF dengan DATA : '.json_encode($log));
		});
		
		return redirect(route('cashflow.staff-salary-payment.show', [
															'organization' => $organization['id'],
															'id' => $payment['id'],
													]))->with('success', 'Pembayaran Gaji Staff Nama: ' . $staff['name'] . ' Berhasil Diubah');
	}

	public function showStaff(Organization $organization, $id, $staff)
	{
		$payment = StaffSalaryPayment::find($id);
		$contact = Contact::with('staff')->find($staff);
		if (!$payment || !$contact) {
			return abort(404);
		}

		$payment['details'] = StaffSalaryPaymentDetail::where('payment_id', $id)
																										->where('contact_id', $staff)
																										->get();		

		$user = Auth::user();
		
		return Inertia::render('StaffSalaryPayment/ShowStaff', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => SalaryCategory::where('is_active', true)
																			->where('organization_id', $organization['id'])																			
																			->orderBy('has_hour', 'asc')
																			->orderBy('is_cut', 'asc')
																			->get(),
			'payment' => $payment,
			'contact' => $contact,
			'user' => $user,
		]);
	}

	public function print(Request $request, Organization $organization, StaffSalaryPayment $payment)
	{
		$user = Auth::user();

		$payments = [];
		$contacts = Contact::whereHas('staff')
												->where('organization_id', $organization['id'])
												->orderBy('name')
												->get();

		foreach ($contacts as $key => $contact) {
			$tempDetail = StaffSalaryPaymentDetail::wherePaymentId($payment['id'])
																				->whereContactId($contact['id'])
																				->with('category')
																				->get();
			$payments[$key] = $contact;
			$payments[$key]['value'] = $tempDetail->sum('value');
			$payments[$key]['categories'] = $tempDetail;
		}

		return Inertia::render('StaffSalaryPayment/Print',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'payment' => $payment,
			'payments' => $payments,
			'user' => $user,
		]);
	}
}
