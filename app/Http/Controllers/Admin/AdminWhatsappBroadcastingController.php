<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminWhatsappBroadcastingController extends Controller
{
  /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
			return Inertia::render('Admin/Addons/Whatsapp/Index');
    }
}