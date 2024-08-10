<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\VillageImport;
use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class VillageController extends Controller
{
    public function index(): Response
    {
        $regency = request('regency');
        $province = request('province');
        $villages = Village::filter(request(['search', 'district']))
            ->whereHas('district', function ($query) use ($regency, $province) {
                $query->when($regency ?? false, function ($query, $regency) {
                    $query->where('regency_id', $regency);
                });

                $query->whereHas('regency', function ($query) use ($province) {
                    $query->when($province ?? false, function ($query, $province) {
                        $query->where('province_id', $province);
                    });
                });
            })
            ->with('district', function ($query) {
                $query->with('regency', function ($query) {
                    $query->with('province');
                });
            })
            ->paginate(50)->withQueryString();

        $provinces = Province::filter(request(['searchProvince']))
            ->get()
            ->take(10);

        $regencies = Regency::filter(request(['searchRegency', 'province']))
            ->get()
            ->take(10);

        $districts = District::filter(request(['searchDistrict', 'regency']))
            ->get()
            ->take(10);

        return Inertia::render('Admin/Village/Index', [
            'villages' => $villages,
            'districts' => $districts,
            'regencies' => $regencies,
            'provinces' => $provinces,
        ]);
    }

    public function post(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'village' => 'required|file|mimes:csv',
        ]);

        $file = $request->file('village');

        try {
            Excel::queueImport(new VillageImport, $file);
        } catch (Throwable $th) {
            abort(503, 'Something Wrong');
        }

        return redirect(route('admin.data-master.village'));
    }
}
