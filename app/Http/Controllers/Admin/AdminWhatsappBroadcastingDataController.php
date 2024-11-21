<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Http\Controllers\Controller;
use App\Repositories\WhatsApp\WhatsAppRepository;

class AdminWhatsappBroadcastingDataController extends Controller
{
	public function index()
	{
		$search = request('search');
		return Inertia::render('Admin/Addons/Whatsapp/Data/Index',[
			'whatsappPlugins' => WhatsappPlugin::where(function ($query) use ($search){
																						return $query->where('phone', 'like', '%'.$search.'%');
																					})
																					->orWhereHas('organization', function ($query) use ($search){
																						return $query->where('id', 'like', '%'.$search.'%')->orWhere('name', 'like', '%'.$search.'%');
																					})
																					->with('organization')																					
																					->paginate(50)
																					->withQueryString(),
			'searchFilter' => $search
		]);
	}

	public function update(Request $request, WhatsappPlugin $plugin)
	{
		$validated = $request->validate([
			'phone' => [
				'required',
				'string',
			],
			'url' => [
				'required',
				'string',
			],
			'appKey' => [
				'required',
				'string',
			],
			'authkey' => [
				'required',
				'string',
			],
		]);

		$plugin->update($validated);
		
		return redirect()->back()->with('success', 'Data Berhasil Diperbarui');
	}

	public function connection(WhatsappPlugin $plugin)
	{
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
			//throw $th;
			// dd($th);
			return redirect()->back()->withErrors(['error' => "Perangkat gagal terhubung, silakan cek kembali nomor perangkat pada aplikasi pihak ketiga!!!"]);
		}
		
	}
}
