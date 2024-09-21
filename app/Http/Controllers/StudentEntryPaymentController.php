<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
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
		$date = $dateRequest ?? $now->isoFormat('YYYY-MM-DD');
		$dateRef = Carbon::create($date);
		$refHeader = 'EP-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
		$newRef = $refHeader.'0001';

		$payment = StudentEntryPayment::whereOrganizationId($organization['id'])
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('EP-', $payment['no_ref']);
		}

		return $newRef;
	}
	public function index(Organization $organization)
	{
		$user = Auth::user();
		$search = request(['search']);

		// dd(request('studyYear'));

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

		return Inertia::render('StudentEntryPayment/Create',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => StudentEntryPaymentCategory::whereOrganizationId($organization['id'])
																							->whereIsActive(true)
																							->get(),
			'newRef' => $this->newRef($organization, request('date')),
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'studyYears' => StudentLevel::select('year')->distinct()->take(10)->get(),
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

	public function edit(Organization $organization, $id)
	{
		$payment = StudentEntryPayment::with('details', 'receivables')
																	->with('contact', function ($query) {
																		return $query->with('student', 'lastLevel');
																	})
																	->with('journal', function ($query) {
																		return $query->with('ledgers', function ($query){
																			return $query->with('account');
																		});
																	})						
																	->find($id);

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
			'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
			'studyYears' => StudentLevel::select('year')->distinct()->take(10)->get(),
			'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
			'payment' => $payment
		]);
	}

	public function update(Request $request, Organization $organization, $id)
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
				})->ignore($id),
			],
		];

		$validator = Validator::make($request->all(), $rules);
		$user = Auth::user();

		$validator->sometimes('cash_account_id', 'required|exists:accounts,id', function ($input) {
			return $input->paidValue > 0;  // Hanya validasi 'cash_account_id' jika 'paidValue' bernilai > 0
		});

		$validated = $validator->validated();

		// cek apakah sudah ada transaksi pembayaran antara siswa dan tahun ajaran
		$payment = StudentEntryPayment::where('organization_id', $organization['id'])->where('contact_id', $validated['contact_id'])
																		->where('study_year', $validated['study_year'])
																		->first();

		if ($payment && ($payment['id'] !== (int)$id)) {
			return redirect()->back()->withErrors(['error' => 'Data is existed']);
		}
		
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

		DB::transaction(function () use ($validated, $organization, $user, $id){
			// cek apakah sudah dibuatkan piutang
			// jika sudah ada maka kurangi piutang
			$studentReceivable = StudentEntryReceivable::where('organization_id', $organization['id'])
																							->where('contact_id', $validated['contact_id'])
																							->first();

			$payment = StudentEntryPayment::find($id);

			$tempStudentReceivableValue = 0;
			if ($studentReceivable) {

				// cek apakah jika piutang baru lebih kecil dari jumlah yang telah dibayarkan, maka kirimkan pesan error
				$receivableDetails = StudentEntryReceivableLedger::where('payment_id', $id);

				$sumCredit = $receivableDetails->sum('credit');

				if ($validated['receivable_value'] < $sumCredit) {
					return redirect()->back()->withErrors(['paidValue' => 'Error']);
				}

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
					'debit' => $validated['receivable_value'],
				]);
			}

			// hapus detail pembayaran
			DB::table('s_yearly_payment_details')
					->where('payment_id', $id)
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
					'debit' => $validated['receivable_value'],
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

	public function show(Organization $organization, $id)
	{
		$user = Auth::user();

		$payment = StudentEntryPayment::with('details')->find($id);

		return Inertia::render('StudentEntryPayment/Show',[
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'user' => $user,
			'payment' => $payment,
			'contact' => Contact::with(['student', 'lastLevel'])->find($payment['contact_id']),
		]);
	}

	public function destroy(Organization $organization, StudentEntryPayment $payment)
	{
		// cek apakah sudah dilakukan pembayaran piutang
		$receivableLedger = StudentEntryReceivableLedger::where('payment_id', $payment['id']);

		if ($receivableLedger->where('credit', '>', 0)->count() > 0) {
			return redirect()->back()->withErrors(['error' => "Can't deleted"]);
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
}
