<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Affiliation;
use Illuminate\Http\Request;
use App\Models\AffiliationWithdraw;
use Illuminate\Support\Facades\Auth;

class AffiliationController extends Controller
{
	public function index()
	{
		$user = Auth::user();

		$affiliation = Affiliation::whereUserId('user_id')->first();

		$affiliationWithdraw = AffiliationWithdraw::whereUserId('user_id')->get();

		// dd($user);

		return Inertia::render('Affiliation/Affiliation', [
			'user' => $user,
			'affiliation' => $affiliation,
			'affiliationWithdraw' => $affiliationWithdraw,
		]);
	}
}
