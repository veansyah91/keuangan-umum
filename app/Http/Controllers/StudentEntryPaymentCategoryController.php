<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Models\StudentEntryPaymentCategory;

class StudentEntryPaymentCategoryController extends Controller
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

        return Inertia::render('StudentEntryPaymentCategory/Index', [
            'organization' => $organization,
            'studentPaymentCategories' => StudentEntryPaymentCategory::filter(request(['search']))
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

        StudentEntryPaymentCategory::create($validated);

        return redirect()->back()->with('success', 'Kategori Berhasil Ditambahkan');
    }

    public function update(Request $request, Organization $organization, StudentEntryPaymentCategory $studentEntryPaymentCategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('student_payment_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($studentEntryPaymentCategory['id']),
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
        
        $studentEntryPaymentCategory->update($validated);

        return redirect()->back()->with('success', 'Kategori Berhasil Diubah');
    }

    public function destroy(Organization $organization, StudentEntryPaymentCategory $studentEntryPaymentCategory)
    {
        // cek penggunaan
        $using = DB::table('s_yearly_payment_details')->where('student_payment_category_id', $studentEntryPaymentCategory['id'])->first();

        if ($using) {
            return redirect()->back()->withErrors(['message' => 'Rincian Telah Digunakan']);
        }

        $studentEntryPaymentCategory->delete();
        return redirect()->back()->with('success', 'Kategori Berhasil Dihapus');

    }
}
