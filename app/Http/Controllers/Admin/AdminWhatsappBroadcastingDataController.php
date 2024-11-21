<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Http\Controllers\Controller;

class AdminWhatsappBroadcastingDataController extends Controller
{
	public function index()
	{
		$search = request('search');
		return Inertia::render('Admin/Addons/Whatsapp/Data/Index',[
			'whatsappPlugins' => WhatsappPlugin::whereHas('organization', function ($query) use ($search){
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
		
	}
}
