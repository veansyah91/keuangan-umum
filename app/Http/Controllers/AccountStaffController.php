<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;

class AccountStaffController extends Controller
{
	public function index(Organization $organization)
	{
		$accounts = AccountStaff::where('organization_id', $organization['id'])
															->get();

		return Inertia::render('AccountStaff/Index',[
			'accounts' => $accounts
		]);
	}
}
