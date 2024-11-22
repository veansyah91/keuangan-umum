<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Models\WhatsappInvoice;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AdminWhatsappBroadcastingInvoiceController extends Controller
{
  public function index()
	{
		// dd(request('status'));
		return Inertia::render('Admin/Addons/Whatsapp/Invoice/Index',[
			'invoices' => WhatsappInvoice::filter(request(['search', 'start_date', 'end_date', 'status', 'product']))
																		->with(['organization', 'acceptedBy'])
																		->orderBy('created_at', 'desc')
																		->paginate(50)
																		->withQueryString(),
			'organizations' => Organization::filter(request(['searchOrganization']))
																		->get()
																		->take(10),
			'statusFilter' => request('status'),
			'productFilter' => request('product'),	
		]);
	}

	public function confirmation(WhatsappInvoice $invoice)
	{
		$user = Auth::user();

		$organization = Organization::findOrFail($invoice['organization_id']);
		$plugin = WhatsappPlugin::where('organization_id', $invoice['organization_id'])->first();

		$now = Carbon::now();
		$organizationExpired = Carbon::create($plugin['expired']);
		$refDate = $now > $organizationExpired ? $now : $organizationExpired;

		$expiredDate = $invoice['product'] == 'Tahunan' ? $refDate->add(1, 'year') : $refDate->add(1, 'month');

		// ubah status 'pending' menjadi 'paid'
		$invoice->update([
			'accepted_by_user_id' => $user['id'],
			'status' => 'paid',
		]);

		// Ubah tanggal expired
		$plugin->update([
			'expired_date' => $expiredDate,
			'is_active' => true,
		]);

		if ($plugin['connection'] === 0) {
			return redirect(route('admin.add-ons.whatsapp.data', ['search' => $invoice['organization_id']]))->with('success', 'Pembayaran Berhasil Dikonfirmasi Silakan Aktifasi Whatsapp Pelanggan');
		}

		return redirect()->back()->with('success', 'Pembayaran Berhasil Dikonfirmasi');
	}
}
