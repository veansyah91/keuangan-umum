<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Affiliation;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\OrganizationInvoice;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class AdminOrganizationInvoiceController extends Controller
{
    public function index(): Response
    {
        $organizationInvoices = OrganizationInvoice::filter(request(['search', 'start_date', 'end_date', 'organization_id', 'status', 'product']))
            ->with('organization')
            ->with('acceptedBy')
            ->orderBy('no_ref', 'desc')
            ->paginate(50)->withQueryString();

        $organizations = Organization::filter(request(['searchOrganization']))
            ->get()
            ->take(10);

        return Inertia::render('Admin/Organization-Invoice/Index', [
            'organizationInvoices' => $organizationInvoices,
            'organizations' => $organizations,
            'searchOrganization' => request('searchOrganization'),
            'organization_id' => request('organization_id'),
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'statusFilter' => request('status'),
            'searchFilter' => request('search'),
        ]);
    }

    public function paymentConfirmation(Request $request, OrganizationInvoice $organizationInvoice): RedirectResponse
    {
        // Validation
        $validated = $request->validate([
            'status' => [Rule::in(['pending'])],
            'product' => [Rule::in(['Bulanan', 'Tahunan'])],
            'price' => 'integer|numeric',
        ]);

        $user = Auth::user();

        // // Update Organization Invoice
        $organizationInvoice->update([
            'status' => 'paid',
            'accepted_by_user_id' => $user['id'],
        ]);

        // Update Organization (Expired Date Column)
        $organization = Organization::findOrFail($organizationInvoice['organization_id']);

        $now = Carbon::now();
        $organizationExpired = Carbon::create($organization['expired']);
        $refDate = $now > $organizationExpired ? $now : $organizationExpired;

        $organizationInvoices = 0;

        if ($organization['affiliation_is']) {
            $organizationInvoices = OrganizationInvoice::where('organization_id', $organization['id'])
                                                    ->where('affiliation_id', $organization['affiliation_is'])
                                                    ->count();
        }

        $expiredDate = $validated['product'] == 'Tahunan' ? $refDate->add(1, 'year') : $refDate->add(1, 'month');

        if ($organizationInvoices == 1) {
            $expiredDate = $expiredDate->add(3, 'month');
        }

        $organization->update([
            'expired' => $expiredDate,
            'status' => 'active',
        ]);

        $affiliation = Affiliation::find($organization['affiliation_id']);

        if ($affiliation ) {
            $balance = $affiliation['balance'] + ($affiliation['insentive']*$organizationInvoice['price']/100);

            $affiliation->update([
                'balance' => $balance
            ]);
        }

        return redirect(route('admin.organization.invoice.index'));
    }
}
