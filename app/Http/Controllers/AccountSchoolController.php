<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SchoolAccountSetting;

class AccountSchoolController extends Controller
{
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
		]);
	}
}
