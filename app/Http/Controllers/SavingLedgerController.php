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
use App\Repositories\Contact\ContactRepository;

class SavingLedgerController extends Controller
{
	protected $logRepository, $userRepository, $contactRepository;

	public function __construct(UserRepository $userRepository, ContactRepository $contactRepository)
	{
		$this->userRepository = $userRepository;
		$this->contactRepository = $contactRepository;
		$this->now = CarbonImmutable::now();
	}

	protected function newRef($organization, $dateRequest = '', $type)
	{
			$now = $this->now;
			$date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
			$dateRef = Carbon::create($date);
			$prefix = $type == 'debit' ? 'SD-' : 'SC-';
			$refHeader = $prefix.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
			$newRef = $refHeader.'0001';

			$cashMutation = SavingLedger::whereOrganizationId($organization['id'])
					->where('no_ref', 'like', $refHeader.'%')
					->orderBy('no_ref','desc')
					->first();

			if ($cashMutation) {
					$newRef = NewRef::create($prefix, $cashMutation['no_ref']);
			}

			return $newRef;
	}

  public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('SavingLedger/Index', [
			'organization' => $organization,
			'ledgers' => SavingLedger::filter(request(['search']))
																	->whereOrganizationId($organization['id'])
																	->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'newRefCredit' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD'), "credit"),
			'newRefDebit' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD'), "debit"),
		]);
	}
}
