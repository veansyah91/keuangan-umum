<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\SavingLedger;
use Illuminate\Http\Request;
use App\Models\SavingBalance;
use Illuminate\Validation\Rule;
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
		$contact = request('contact');

		return Inertia::render('SavingLedger/Index', [
			'organization' => $organization,
			'date' => request('date') ?? $this->now->isoFormat('YYYY-M-DD'),
			'ledgers' => SavingLedger::filter(request(['search']))
																	->whereOrganizationId($organization['id'])
																	->paginate(50)->withQueryString(),
			'balances' => SavingBalance::whereOrganizationId($organization['id'])
																		->where(function ($query) use ($contact){
																			return $query->where('no_ref', 'like', '%' . $contact . '%')
																										->orWhereHas('contact', function ($query) use ($contact){
																											return $query->where('name', 'like', '%' . $contact . '%');
																										});
																		})
																		->with('contact', function ($query){
																			return $query->with(['student', 'contactCategories']);
																		})
																		->with('savingCategory')
																		->take(20)->get(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'newRefCredit' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD'), "credit"),
			'newRefDebit' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD'), "debit"),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$user = Auth::user();

		$validated = $request->validate([
			'date' => [
					'required',
					'date',
			],
			'type' => [
					'required',
					'string'
			],
			'description' => [
					'required',
					'string',
			],
			'no_ref' => [
					'required',
					'string',
					Rule::unique('saving_ledgers')->where(function ($query) use ($organization) {
							return $query->where('organization_id', $organization['id']);
					}),
			],
			'balance_value' => [
					'required',
					'numeric',
					'min:0'
			],
			'value' => [
					'required',
					'numeric',
					'min:0'
			],
			'balance_id' => [
					'required',
					'exists:saving_balances,id',
			],
		]);

		// cek tanggal
		// jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
		if ($validated['date'] > $this->now->isoFormat('YYYY-M-DD')) {
			return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
		}

		if ($validated['type'] !== 'credit' && $validated['value'] > $validated['balance_value']) {
			return redirect()->back()->withErrors(['value' => 'Value is Unexpected!']);
		}

		dd($validated);


	}
}
