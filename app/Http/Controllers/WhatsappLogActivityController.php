<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\WhatsappLog;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class WhatsappLogActivityController extends Controller
{
	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
	}
	/**
	 * Handle the incoming request.
	 */
	public function __invoke(Organization $organization)
	{
		$user = Auth::user();

		$logs = WhatsappLog::filter(request(['search', 'start_date', 'end_date', 'status']))
												->where('organization_id', $organization['id'])
												->with('contact')
												->orderBy('created_at', 'desc')
												->orderBy('updated_at', 'desc')
												->paginate(50)->withQueryString();

		return Inertia::render('Addons/Whatsapp/Log', [
			'organization' => $organization,
			'logs' => $logs,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}
}
