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
		return Inertia::render('Admin/Addons/Whatsapp/Data/Index',[
			'whatsappPlugins' => WhatsappPlugin::with('organization')
																					->paginate(50)
																					->withQueryString()
		]);
	}
}
