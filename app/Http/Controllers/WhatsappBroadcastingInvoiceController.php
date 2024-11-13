<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Models\WhatsappInvoice;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class WhatsappBroadcastingInvoiceController extends Controller
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

	public function nextMonth()
	{
		
	}

	protected function newRef($organization, $dateRequest = '')
	{
		$now = $this->now;
		$date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
		$dateRef = Carbon::create($date);
		$refHeader = 'WI-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
		$newRef = $refHeader.'0001';

		$payment = WhatsappInvoice::whereOrganizationId($organization['id'])
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('WI-', $payment['no_ref']);
		}

		return $newRef;
	}
  
	public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('Addons/Whatsapp/Invoice/Index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'invoices' => WhatsappInvoice::whereOrganizationId($organization['id'])
																->orderBy('date', 'desc')
																->orderBy('no_ref', 'desc')
																->paginate(50)->withQueryString()
		]);
	}

	public function create(Organization $organization)
	{
		$user = Auth::user();

		$status = WhatsappPlugin::where('organization_id', $organization['id'])
															->first();

		$expiredDate = $this->now;
		dd($expiredDate);
		$expiredDate = new Carbon($status['expired_date']);

		return Inertia::render('Addons/Whatsapp/Invoice/Create', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		dd($request);
	}
}
