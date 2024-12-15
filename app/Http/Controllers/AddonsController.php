<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Repositories\User\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AddonsController extends Controller
{
	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
	}

	/**
	 * Handle the incoming request.
	 */
	public function __invoke(Request $request, Organization $organization): Response
	{
		$user = Auth::user();

		return Inertia::render('Addons/Index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}
}
