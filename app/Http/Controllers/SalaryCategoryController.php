<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SalaryCategory;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SalaryCategoryController extends Controller
{
    protected $userRepository;

    protected $logRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
    }

    public function index(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('SalaryCategory/Index', [
            'organization' => $organization,
            'salaryCategories' => SalaryCategory::filter(request(['search']))
                                                ->whereOrganizationId($organization['id'])
                                                ->paginate(50)->withQueryString(),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }

    public function store(Request $request, Organization $organization)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('salary_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'value' => [
                'required',
                'numeric'
            ],
            'unit' => [
                'nullable',
                'string',
                'in:jam,hari'
            ],
            'is_active' => [
                'required',
                'boolean'
            ],
            'has_hour' => [
                'required',
                'boolean'
            ],
            'is_cut' => [
                'required',
                'boolean'
            ],
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();
        $validated['organization_id'] = $organization['id'];

        // dd($validated);

        SalaryCategory::create($validated);
        return redirect()->back()->with('success', 'Rincian Penggajian Berhasil Ditambahkan');

    }

    public function update(Request $request, Organization $organization, SalaryCategory $salaryCategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('salary_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($salaryCategory['id']),
            ],
            'value' => [
                'required',
                'numeric'
            ],
            'is_active' => [
                'required',
                'boolean'
            ],
            'has_hour' => [
                'required',
                'boolean'
            ],
            'is_cut' => [
                'required',
                'boolean'
            ],
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        $salaryCategory->update($validated);
        return redirect()->back()->with('success', 'Rincian Penggajian Berhasil Diubah');

    }

    public function destroy(Request $request, Organization $organization, SalaryCategory $salaryCategory)
    {
        // cek kategori


        $salaryCategory->delete();
        return redirect()->back()->with('success', 'Rincian Penggajian Berhasil Dihapus');

    }
}
