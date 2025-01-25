<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SavingBalance;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class SavingBalanceController extends Controller
{
	protected $logRepository, $userRepository;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
		$this->now = CarbonImmutable::now();
	}

	protected function newRef($organization, $dateRequest = '')
	{
			$now = $this->now;
			$date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
			$dateRef = Carbon::create($date);
			$refHeader = 'S-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
			$newRef = $refHeader.'0001';

			$cashMutation = SavingBalance::whereOrganizationId($organization['id'])
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


		
		return Inertia::render('SavingBalance/Index',[
			'organization' => $organization,
			'user' => $user,
			'members' => SavingBalance::filter(request(['search']))
																	->with('savingCategory')
																	->whereOrganizationId($organization['id'])
																	->paginate(50)->withQueryString(),
		]);
	}
}
