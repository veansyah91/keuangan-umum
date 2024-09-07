<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use App\Models\StudentEntryPayment;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Models\StudentEntryPaymentCategory;
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

		return Inertia::render('StudentEntryPayment/Index', [
			'organization' => $organization,
			'payments' => StudentEntryPayment::filter(request(['search']))
																	->with('contact', function ($query) {
																			$query->with('student');
																	})
																	->whereOrganizationId($organization['id'])
																	->orderBy('study_year', 'desc')
																	->orderBy('date', 'desc')
																	->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'searchFilter' => $search
		]);
	}

	public function create(Organization $organization)
	{
		$user = Auth::user();
		// $organizationUser = OrganizationUser::where('organization_id', $organization['id'])
		// 																			->where('user_id', $user['id'])
		// 																			->whereNot('role', 'viewer')->first();

		// $organizationUser = Organization::with('users')->find($organization['id']);
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

		// dd($this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])));

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

		$accounts = SchoolAccountSetting::where('organization_id', $organization['id'])->first();

		// buat akun-akun
		$validated['accounts'] = [
			// akun credit (pendapatan)
			[
				'id' => $accounts['entry_student'],
				'is_cash' => 0,
				'debit' => 0,
				'credit' => $validated['value'],
			]
		];
		// jika tidak dilakukan pembayaran maka debit kan pada akun piutang saja
		if ($validated['paidValue'] === 0) {
			dd('paid value == 0');
		}

dd($validated);


		// jika dilakukan pembayaran lunas $validated['value'] === $validated['paidValue'] maka debitkan pada akun kas

		// jika dilakukan pembayaran sebagian atau ada sisa $validated['value'] > $validated['paidValue'] maka lakukan debit pada akun kas dan akun piutang

		// buat data pada table entry payments

		// jika ada piutang maka buat data pada piutang
			
		// buat jurnal

		// buat log
	}
}
