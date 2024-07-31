<?php

namespace App\Http\Controllers;

use App\Models\FixedAssetCategory;
use App\Models\Organization;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FixedAssetCategoryController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->now = CarbonImmutable::now();
    }

    public function index(Organization $organization)
    {
        $user = Auth::user();

        $fixedAssetCategories = FixedAssetCategory::filter(request(['search', 'status']))
            ->whereOrganizationId($organization['id'])
            ->paginate(50);

        return Inertia::render('FixedAssetCategory/Index', [
            'organization' => $organization,
            'fixedAssetCategories' => $fixedAssetCategories,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'status' => request('status') == 'true' ? true : false,
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
        ]);
    }

    public function store(Request $request, Organization $organization)
    {
        $user = Auth::user();

        // validation
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fixed_asset_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'lifetime' => 'required|numeric',
            'status' => 'required|boolean',
        ]);

        $log = $validated;

        $validated['organization_id'] = $organization['id'];

        FixedAssetCategory::create($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada KELOMPOK HARTA TETAP dengan DATA : '.json_encode($log));

        return redirect()->back();
    }

    public function update(Request $request, Organization $organization, FixedAssetCategory $fixedAssetCategory)
    {
        $user = Auth::user();

        // validation
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fixed_asset_categories')->ignore($fixedAssetCategory['id']),
            ],
            'lifetime' => 'required|numeric',
            'status' => 'required|boolean',
        ]);

        $log = $validated;

        $validated['organization_id'] = $organization['id'];

        $fixedAssetCategory->update($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada KELOMPOK HARTA TETAP menjadi : '.json_encode($log));

        return redirect()->back();
    }

    public function destroy(Organization $organization, FixedAssetCategory $fixedAssetCategory)
    {
        $user = Auth::user();

        // cek apakah kelompok harta tetap telah digunakan

        //
        $log = [
            'name' => $fixedAssetCategory['name'],
            'lifetime' => $fixedAssetCategory['lifetime'],
            'status' => $fixedAssetCategory['status'],
        ];

        $fixedAssetCategory->delete();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada KATEGORI AKUN : '.json_encode($log));

        return redirect()->back();
        dd($fixedAssetCategory);
    }
}
