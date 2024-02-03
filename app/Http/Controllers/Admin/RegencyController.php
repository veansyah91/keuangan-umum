<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Regency;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Imports\RegencyImport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\RedirectResponse;

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

        return Inertia::render('Admin/Regency/Index',[
            'regencies' => $regencies,
            'provinces' => $provinces,
            'provinceFilter' => request('searchProvince'),
            'searchFilter' => request('search')
        ]);
    }

    public function post(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'regency' => 'required|file|mimes:csv'
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
