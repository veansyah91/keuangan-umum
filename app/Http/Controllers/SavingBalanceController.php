<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Contact;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\SavingLedger;
use Illuminate\Http\Request;
use App\Models\SavingBalance;
use App\Models\SavingCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Contact\ContactRepository;

class SavingBalanceController extends Controller
{
	protected $logRepository, $userRepository, $contactRepository;

	public function __construct(UserRepository $userRepository, ContactRepository $contactRepository)
	{
		$this->userRepository = $userRepository;
		$this->contactRepository = $contactRepository;
		$this->now = CarbonImmutable::now();
	}

	public function ledgers($balance, $startDate, $endDate)
	{
		return SavingLedger::where('saving_balance_id', $balance['id'])
												->where('created_at', '>=', $startDate)
												->where('created_at', '<=', $endDate)
												->get();
	}

	public function sumLedgerBefore($balance, $startDate)
	{
		$ledgers = SavingLedger::where('saving_balance_id', $balance['id'])
								->where('created_at', '<', $startDate)
								->get();
		return count($ledgers) > 0 ? ((int)$ledgers['debit'] - (int)$ledgers['credit']) : 0;
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
					$newRef = NewRef::create('S-', $cashMutation['no_ref']);
			}

			return $newRef;
	}

	public function index(Organization $organization)
	{
		$user = Auth::user();

		$searchRequest = request('search');

		return Inertia::render('SavingBalance/Index',[
			'newRef' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD')),
			'organization' => $organization,
			'contacts' => $this->contactRepository->getData($organization['id'], request(['contact'])),
			'categories' => SavingCategory::filter(request(['search']))
																			->whereOrganizationId($organization['id'])->get(),
			'user' => $user,
			'members' => SavingBalance::filter(request(['search']))
																	->whereOrganizationId($organization['id'])
																	->with('savingCategory')
																	->with('contact', function ($query){
																		return $query->with(['contactCategories', 'student']);
																	})
																	->orderBy('value', 'desc')
																	->paginate(50)->withQueryString(),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$validator = Validator::make($request->all(), [
			'no_ref' => [
				'required',
				'string',
				Rule::unique('saving_balances')->where(function ($query) use ($organization) {
					return $query->where('organization_id', $organization['id']);
				}),
			],	
			'contact_id' => [
				'required',
				'exists:contacts,id',
			],
			'saving_category_id' => [
				'required',
				'exists:saving_categories,id',
			],
		]);

		if ($validator->fails()) {
			// Handle validation failure
			return redirect()->back()->withErrors($validator)->withInput();
		}

		$validated = $validator->validated();
		$validated['organization_id'] = $organization['id'];

		// cek apakah contact_id dan categoty pernah dibuat
		$balance = SavingBalance::whereOrganizationId($organization['id'])
															->whereSavingCategoryId($validated['saving_category_id'])
															->whereContactId($validated['contact_id'])
															->first();
	
		if ($balance) {
			return redirect()->back()->withErrors(['error' => 'Data is existed']);
		}

		$balance = SavingBalance::create($validated);

		// return redirect(route('cashflow.saving.balance', ['organization' => $organization['id']]))->with('success', 'Data tabungan berhasil ditambah');
		return redirect()->back()->with('success', 'Data tabungan berhasil ditambah');
	}

	public function update(Request $request, Organization $organization, SavingBalance $balance)
	{
		$validator = Validator::make($request->all(), [
			'no_ref' => [
				'required',
				'string',
				Rule::unique('saving_balances')->where(function ($query) use ($organization) {
					return $query->where('organization_id', $organization['id']);
				})->ignore($balance['id']),
			],	
			'contact_id' => [
				'required',
				'exists:contacts,id',
			],
			'saving_category_id' => [
				'required',
				'exists:saving_categories,id',
			],
		]);

		$validated = $validator->validated();

		$balance->update($validated);

		return redirect()->back()->with('success', 'Data tabungan berhasil diubah');
	}

	public function destroy(Request $request, Organization $organization, SavingBalance $balance)
	{
		// cek apakah data telah dipakai
		$ledger = SavingLedger::where('saving_balance_id', $balance['id'])->first();

		if ($ledger) {
			return redirect()->back()->withErrors(['error' => "Data can't be deleted"]);
		}

		// jika belum dipakai maka dihapus
		$balance->delete();

		return redirect()->back()->with('success', 'Data simpanan tabungan berhasil dihapus');
	}

	public function show(Organization $organization, SavingBalance $balance)
	{
		$user = Auth::user();
		 
		$ledgers = SavingLedger::where('saving_balance_id', $balance['id'])
																	->where('created_at', '>=', request('startDate') ?? '')
																	->where('created_at', '<=', request('endDate') ?? '')
																	->get();

		$ledgersBefore =  SavingLedger::where('saving_balance_id', $balance['id'])
																		->where('created_at', '<', request('startDate') ?? '')
																		->selectRaw('SUM(debit) - SUM(credit) AS amount')
    																->value('amount');

		return Inertia::render('SavingBalance/Show', [
			'balance' => $balance,
			'balanceCategory' => SavingCategory::find($balance['saving_category_id']),
			'contact' => Contact::with('contactCategories')->find($balance['contact_id']),
			'organization' => $organization,
			'ledgers' => $ledgers,
			'startDateFilter' => request('startDate'),
			'endDateFilter' => request('endDate'),
			'startedValue' => $ledgersBefore,
		]);
	}
}
