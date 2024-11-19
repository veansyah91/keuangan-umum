<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\WhatsappInvoice;
use App\Http\Controllers\Controller;

class AdminWhatsappBroadcastingInvoiceController extends Controller
{
  public function index()
	{
		return Inertia::render('Admin/Addons/Whatsapp/Invoice/Index',[
			'invoices' => WhatsappInvoice::with(['organization', 'acceptedBy'])
																					->paginate(50)
																					->withQueryString()
		]);
	}
}
