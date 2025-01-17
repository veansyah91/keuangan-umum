<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AccountStaff;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Repositories\Account\AccountRepository;

class AccountStaffController extends Controller
{
	protected $accountRepository;

	public function __construct(AccountRepository $accountRepository)
	{
			$this->accountRepository = $accountRepository;
	}
	
	public function index(Organization $organization)
	{
		$accountStaff = AccountStaff::whereOrganizationId($organization['id'])
																					->with([
																						'staffSalaryExpense',
																					])
																					->first();

		return Inertia::render('AccountStaff/Index',[
			'accountStaff' => $accountStaff,
			'organization' => $organization,
			'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
		]);
	}

	public function update(Request $request, Organization $organization, AccountStaff $accounts)
	{
		$validated = $request->validate([
			'staff_salary_expense' => [
				'required',
				'exists:accounts,id',
			],			
		]);

		dd($validated);
	}
}
