<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Models\WhatsappInvoice;
use Illuminate\Validation\Rule;
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

		$status = WhatsappPlugin::where('organization_id', $organization['id'])
															->first();
		
		return Inertia::render('Addons/Whatsapp/Index', [
			'organization' => $organization,
			'status' => $status,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}

	public function status(Organization $organization)
	{
		$user = Auth::user();

		$status = WhatsappPlugin::where('organization_id', $organization['id'])
															->first();
		
		return Inertia::render('Addons/Whatsapp/Status', [
			'status' => $status,
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
		]);
	}

	public function update(Request $request, Organization $organization)
	{
		$validated = $request->validate([
			'phone' => [
				'required',
				'string',
				Rule::unique('whatsapp_plugins')->where(function ($query) use ($organization) {
					return $query->where('organization_id', "<>", $organization['id']);
			}),
			]
		]);

		WhatsappPlugin::updateOrCreate([
			'organization_id' => $organization['id']
		],[
			'phone' => $validated['phone']
		]);

		return redirect()->back()->with('success', 'No WhatsApp Berhasil Didaftarkan');
	}

}
