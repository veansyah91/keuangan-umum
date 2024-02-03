<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class AdminOrganizationController extends Controller
{
    public function index(): Response
    {
        $organizations = Organization::filter(request(['search','start_date', 'end_date', 'status']))->paginate(50)->withQueryString();

        return Inertia::render('Admin/Organizations/Index',[
            'organizations' => $organizations,
            'searchFilter' => request('search'),
            'statusFilter' => request('status'),
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
        ]);
    }

    public function updateStatus(Request $request, Organization $organization):  RedirectResponse
    {
        // validasi
        $validated = $request->validate([
            'status' => [
                'string',
                Rule::in(['active', 'deactive', 'trial'])
            ]
        ]);

        $organization->update($validated);
        return redirect(route('admin.organization.index'));
    }
}
