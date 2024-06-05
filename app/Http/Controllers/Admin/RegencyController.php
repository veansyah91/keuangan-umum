<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\RegencyImport;
use App\Models\Province;
use App\Models\Regency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class RegencyController extends Controller
{
    public function index(): Response
    {
        $regencies = Regency::filter(request(['search', 'province']))
            ->with('province')
            ->paginate(50)
            ->withQueryString();

        $provinces = Province::filter(request(['searchProvince']))
            ->get()
            ->take(10);

        return Inertia::render('Admin/Regency/Index', [
            'regencies' => $regencies,
            'provinces' => $provinces,
            'provinceFilter' => request('searchProvince'),
            'searchFilter' => request('search'),
        ]);
    }

    public function post(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'regency' => 'required|file|mimes:csv',
        ]);

        $file = $request->file('regency');

        try {
            Excel::import(new RegencyImport, $file);
        } catch (Throwable $th) {
            abort(503, 'Something Wrong');
        }

        return redirect(route('admin.data-master.regency'));
    }
}
