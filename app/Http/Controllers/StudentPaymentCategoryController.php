<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentPaymentCategory;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;

class StudentPaymentCategoryController extends Controller
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

        return Inertia::render('StudentPaymentCategory/Index', [
            'organization' => $organization,
            'studentPaymentCategories' => StudentPaymentCategory::filter(request(['search']))
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
                Rule::unique('student_payment_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'value' => [
                'required',
                'numeric'
            ],
            'is_active' => [
                'required',
                'boolean'
            ]
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();
        $validated['organization_id'] = $organization['id'];

        StudentPaymentCategory::create($validated);

        return redirect()->back()->with('success', 'Kategori Berhasil Ditambahkan');
    }

    public function update(Request $request, Organization $organization, StudentPaymentCategory $studentPaymentCategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('student_payment_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($studentPaymentCategory['id']),
            ],
            'value' => [
                'required',
                'numeric'
            ],
            'is_active' => [
                'required',
                'boolean'
            ]
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();
        
        $studentPaymentCategory->update($validated);

        return redirect()->back()->with('success', 'Kategori Berhasil Diubah');
    }

    public function destroy(Organization $organization, StudentPaymentCategory $studentPaymentCategory)
    {
        // cek penggunaan
        $data = DB::table('s_monthly_payment_details')
                    ->where('student_payment_category_id', $studentPaymentCategory['id'])
                    ->first();

        if ($data) {
            return redirect()->back()->withErrors(['message' => 'Tidak Dapat Menghapus Data']);
        }

        $studentPaymentCategory->delete();
        return redirect()->back()->with('success', 'Kategori Berhasil Dihapus');

    }
}
