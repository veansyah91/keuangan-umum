<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AccountStaff;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;

class AccountSchoolController extends Controller
{
	protected $accountRepository, $userRepository;

	public function __construct(AccountRepository $accountRepository, UserRepository $userRepository)
	{
			$this->accountRepository = $accountRepository;
			$this->userRepository = $userRepository;
	}
	
	public function index(Organization $organization)
	{
		$user = Auth::user();

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
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'organization' => $organization,
			'accountSchool' => $accountSchool,
			'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
		]);
	}

	public function update(Request $request, Organization $organization, SchoolAccountSetting $accounts)
	{
		$validated = $request->validate([
			'revenue_student' => [
				'required',
				'exists:accounts,id',
			],
			'receivable_monthly_student' => [
				'required',
				'exists:accounts,id',
			],
			'receivable_entry_student' => [
				'required',
				'exists:accounts,id',
			],
			'prepaid_student' => [
				'required',
				'exists:accounts,id',
			],			
			'entry_student' => [
				'required',
				'exists:accounts,id',
			],	
			'staff_salary_expense' => [
				'required',
				'exists:accounts,id',
			],			
		]);
		
		// cek apakah sudah ada data atau tidak
		$account = SchoolAccountSetting::find($request->id);

		AccountStaff::updateOrCreate([
			'organization_id' => $organization['id']
		],[
			'staff_salary_expense' => $validated['staff_salary_expense']
		]);

		if ($account) {
			$account->update($validated);
			return redirect()->back()->with('success', 'Tautan Akun Berhasil Diperbarui');
		}
		
		$validated['organization_id'] = $organization['id'];
		SchoolAccountSetting::create($validated);

		return redirect()->back()->with('success', 'Tautan Akun Berhasil Ditambahkan');
	}
}