<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Models\WhatsappInvoice;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use App\Repositories\WhatsApp\WhatsAppRepository;

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
			]
		]);

		WhatsappPlugin::updateOrCreate([
			'organization_id' => $organization['id']
		],[
			'phone' => $validated['phone']
		]);

		return redirect()->back()->with('success', 'No WhatsApp Berhasil Didaftarkan');
	}

	public function checkConnection(Organization $organization)
	{
		$plugin = WhatsappPlugin::where('organization_id', $organization['id'])
															->first();

		// dd($plugin);
		try {
			$now = Carbon::now();

			$message = "test connection";

			$data = array(
				'appkey' => $plugin['appKey'],
				'authkey' => $plugin['authkey'],
				'to' => '6287839542505',
				'message' => $message,
				'sandbox' => 'false'
			);

			$whatsAppRepository = new WhatsAppRepository;
			$result = $whatsAppRepository->sendMessage($data);
			
			$data = json_decode($result);

			if ($data->message_status === "Success") {
				$plugin->update([
					'connection' => true,
					'last_connection' => $now
				]);
				return redirect()->back()->with('success', "Perangkat Telah Dihubungkan dengan Whatsapp Broadcasting");
			}			
		} catch (\Throwable $th) {
			$plugin->update([
				'connection' => false,
			]);
			return redirect()->back()->withErrors(['error' => "Perangkat gagal terhubung, silakan hubungi admin!!!"]);
		}
	}

}
