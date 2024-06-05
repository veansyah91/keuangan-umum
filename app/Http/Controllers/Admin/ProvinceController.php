<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\ProvinceImport;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ProvinceController extends Controller
{
    public function index(): Response
    {
        $provinces = Province::filter(request(['search']))
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Province/Index', [
            'provinces' => $provinces,
        ]);
    }

    public function post(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'province' => 'required|file|mimes:csv',
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
