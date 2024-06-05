<?php

namespace App\Http\Controllers;

use App\Helpers\NewRef;
use App\Models\Organization;
use App\Models\OrganizationInvoice;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationInvoiceController extends Controller
{
    public function index(Organization $organization): Response
    {
        $organizationInvoices = OrganizationInvoice::filter(request(['search']))
            ->whereOrganizationId($organization['id'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($organizationInvoice) {
                $date = new Carbon($organizationInvoice['created_at']);

                return [
                    'id' => $organizationInvoice['id'],
                    'no_ref' => $organizationInvoice['no_ref'],
                    'product' => $organizationInvoice['product'],
                    'description' => $organizationInvoice['description'],
                    'status' => $organizationInvoice['status'],
                    'price' => $organizationInvoice['price'],
                    'organization_id' => $organizationInvoice['organization_id'],
                    'date' => $date->isoFormat('D MMMM Y'),
                ];
            });

        return Inertia::render('Organization/Invoice/Index', [
            'organization' => $organization,
            'organizationInvoices' => $organizationInvoices,
            'searchFilter' => request('search'),
        ]);
    }

    public function create(Organization $organization): Response
    {
        $expiredDate = new Carbon($organization['expired']);
        $organization['expiredId'] = $expiredDate->isoFormat('D MMMM Y');

        $dateNow = Carbon::now();

        if ($dateNow > $expiredDate) {
            $expiredDate = $dateNow;
        }

        $expiredAddAMonth = $expiredDate->addMonths(1);
        $organization['expiredAddAMonth'] = $expiredAddAMonth->isoFormat('D MMMM Y');

        $tempExpiredDate = new Carbon($organization['expired']);

        if ($dateNow > $tempExpiredDate) {
            $tempExpiredDate = $dateNow;
        }
        $expiredAdd12Month = $tempExpiredDate->addMonths(12);
        $organization['expiredAdd12Month'] = $expiredAdd12Month->isoFormat('D MMMM Y');

        return Inertia::render('Organization/Invoice/Create', compact('organization'));
    }

    public function store(Organization $organization, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product' => [
                'required',
                Rule::in(['Tahunan', 'Bulanan']),
            ],
        ]);

        $date = Carbon::now();
        $refHeader = 'PF-'.$date->isoFormat('YYYY').$date->isoFormat('MM');

        $validated['description'] = 'Perpanjangan Layanan';
        $validated['status'] = 'pending';
        $validated['price'] = $validated['product'] == 'Tahunan' ? 600000 : 70000;
        $validated['no_ref'] = $refHeader.'00001';
        $validated['organization_id'] = $organization['id'];

        $organizationInvoice = OrganizationInvoice::where('no_ref', 'like', $refHeader.'%')
            ->get()
            ->last();
        if ($organizationInvoice) {
            $validated['no_ref'] = NewRef::create('PF-', $organizationInvoice['no_ref']);
        }

        $organizationInvoice = OrganizationInvoice::create($validated);

        return redirect(route('organization.invoice.show', [$organization['id'], $organizationInvoice['id']]))->with('success', 'Pesanan Perpanjangan Layanan Berhasil Dibuat!');
    }

    public function show(Organization $organization, OrganizationInvoice $organizationInvoice): Response
    {
        $date = new Carbon($organizationInvoice['created_at']);
        $organizationInvoice['date'] = $date->isoFormat('D MMMM Y');

        return Inertia::render('Organization/Invoice/Show', [
            'organization' => $organization,
            'appName' => env('APP_NAME'),
            'organizationInvoice' => $organizationInvoice,
            'whatsappContact' => env('WHATSAPP_CONTACT'),
            'bank' => [
                'account' => env('BANK_ACCOUNT'),
                'name' => env('BANK_NAME'),
                'provider' => env('BANK'),
            ],
        ]);
    }
}
