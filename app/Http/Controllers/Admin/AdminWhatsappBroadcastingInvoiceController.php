<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappInvoice;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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

	public function confirmation(WhatsappInvoice $invoice)
	{
		$user = Auth::user();

		// ubah status 'pending' menjadi 'paid'
		// $invoice->update([
		// 	'accepted_by_user_id' => $user['id'],
		// 	'status' => 'paid',
		// ]);

		$organization = Organization::findOrFail($invoice['organization_id']);

		$now = Carbon::now();
		$organizationExpired = Carbon::create($organization['expired']);
		$refDate = $now > $organizationExpired ? $now : $organizationExpired;

		dd($invoice);
	}
}
