<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\SavingLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;

class SavingCreditController extends Controller
{
	protected $userRepository, $accountRepository, $contactRepository, $now;

	public function __construct(UserRepository $userRepository, AccountRepository $accountRepository, ContactRepository $contactRepository)
	{
		$this->userRepository = $userRepository;
		$this->accountRepository = $accountRepository;
		$this->contactRepository = $contactRepository;
		$this->now = CarbonImmutable::now();
	}

	protected function newRef($organization, $dateRequest = '')
	{
			$now = $this->now;
			$date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
			$dateRef = Carbon::create($date);
			$refHeader = 'C-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
			$newRef = $refHeader.'0001';

			$cashMutation = SavingLedger::whereOrganizationId($organization['id'])
					->where('no_ref', 'like', $refHeader.'%')
					->orderBy('no_ref','desc')
					->first();

			if ($cashMutation) {
					$newRef = NewRef::create('C-', $cashMutation['no_ref']);
			}

			return $newRef;
	}
	
  public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('SavingLedger/Credit/Index', [
			'user' => $user,
			'searchQuery' => request('search'),
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'ledgers' => SavingLedger::filter(request(['search']))
																->with('savingBalance')
																->whereOrganizationId($organization['id'])
																->paginate(50)->withQueryString()
		]);
	}

	public function create(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('SavingLedger/Credit/Create', [
			'newRef' => $this->newRef($organization, request('date')),
			'user' => $user,
			'date' => request('date') ?? $this->now->isoFormat('YYYY-M-DD'),
			'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
			'organization' => $organization,
			'contacts' => $this->contactRepository->getData($organization['id'], request(['contact'])),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'ledgers' => SavingLedger::filter(request(['search']))
																->with('savingBalance')
																->whereOrganizationId($organization['id'])
																->paginate(50)->withQueryString()
		]);
	}
}
