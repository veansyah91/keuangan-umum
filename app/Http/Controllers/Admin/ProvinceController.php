<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Imports\ProvinceImport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\RedirectResponse;

class ProvinceController extends Controller
{
    public function index(): Response
    {
        $provinces = Province::filter(request(['search']))
                                ->paginate(50)
                                ->withQueryString();
        return Inertia::render('Admin/Province/Index',[
            'provinces' => $provinces
        ]);
    }

    public function post(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'province' => 'required|file|mimes:csv'
        ]);

        $file = $request->file('province');
        
        try {
            Excel::import(new ProvinceImport, $file);
        } catch (Throwable $th) {
            abort(503, 'Something Wrong');
        }

        return redirect(route('admin.data-master.province'));
    }
}
