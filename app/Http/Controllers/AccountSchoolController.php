<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SchoolAccountSetting;
use App\Repositories\Account\AccountRepository;

class AccountSchoolController extends Controller
{
	protected $accountRepository;

	public function __construct(AccountRepository $accountRepository)
	{
			$this->accountRepository = $accountRepository;
	}
	public function index(Organization $organization)
	{
		$accountSchool = SchoolAccountSetting::whereOrganizationId($organization['id'])
																					->with([
																						'staffSalaryExpense',
																						'entryStudent',
																						'prepaidStudent',
																						'receivableEntryStudent',
																						'receivableMonthlyStudent',
																						'revenueStudent'
																					])
																					->first();

		return Inertia::render('AccountSchool/Index', [
			'organization' => $organization,
			'accountSchool' => $accountSchool,
			'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
		]);
	}
}
