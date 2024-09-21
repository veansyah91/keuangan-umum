<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use App\Models\StudentEntryPayment;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
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
			'receivables' => StudentEntryReceivableLedger::whereHas('payment', function ($query) use ($organization){
												return $query->where('organization_id', $organization['id']);
											})
											->with('contact', function ($query) {
												$query->with('student');
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
			'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
			'contact' => request('contact'),
			'selectedContact' => request('selectedContact'),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),			
			'payments' => StudentEntryPayment::where('contact_id', request('selectedContact'))
																				->where('receivable_value', '>', 0)
																				->select('id', 'receivable_value', 'no_ref', 'study_year', 'organization_id')
																				->get(),
		]);
	}
}
