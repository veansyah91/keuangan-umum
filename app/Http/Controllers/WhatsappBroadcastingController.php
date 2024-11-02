<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
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
		
		return Inertia::render('Addons/Whatsapp/index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}
}
