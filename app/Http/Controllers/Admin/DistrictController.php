<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\DistrictImport;
use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class DistrictController extends Controller
{
    public function index(): Response
    {
        $province = request('province');

        $districts = District::filter(request(['search', 'regency']))
            ->whereHas('regency', function ($query) use ($province) {
                $query->when($province ?? false, function ($query, $province) {
                    $query->where('province_id', $province);
                });
            })
            ->with('regency', function ($query) {
                $query->with('province');
            })
            ->paginate(50)
            ->withQueryString();

        $provinces = Province::filter(request(['searchProvince']))
            ->get()
            ->take(10);

        $regencies = Regency::filter(request(['searchRegency', 'province']))
            ->get()
            ->take(10);

        return Inertia::render('Admin/District/Index', [
            'regencies' => $regencies,
            'provinces' => $provinces,
            'districts' => $districts,
            'searchFilter' => request('search'),
        ]);
    }

    public function post(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'district' => 'required|file|mimes:csv',
        ]);

        $file = $request->file('district');

        try {
            Excel::import(new DistrictImport, $file);
        } catch (Throwable $th) {
            abort(503, 'Something Wrong');
        }

        return redirect(route('admin.data-master.district'));
    }
}
