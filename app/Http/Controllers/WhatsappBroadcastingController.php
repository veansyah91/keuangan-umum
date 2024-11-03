<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappInvoice;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class WhatsappBroadcastingController extends Controller
{
	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
	}
	
	public function index(Organization $organization)
	{
		$user = Auth::user();
		
		return Inertia::render('Addons/Whatsapp/Index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}

	public function status(Organization $organization)
	{
		$user = Auth::user();

		$status = WhatsappInvoice::where('organization_id', $organization['id'])
															->first();
		
		return Inertia::render('Addons/Whatsapp/Status', [
			'status' => $status,
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}
}
