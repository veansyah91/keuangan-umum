<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Journal;
use App\Models\Department;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class DepartmentController extends Controller
{
    protected $userRepository;
    protected $logRepository;
    protected $now;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->now = CarbonImmutable::now();
    }

    protected function newRef($organization)
    {
        $now = CarbonImmutable::now();
        $refHeader = "D-" . $now->isoFormat('YYYY');
        $code = $refHeader . '001';

        $department = Department::whereOrganizationId($organization['id'])
                            ->where('code', 'like', $refHeader . '%')
                            ->get()
                            ->last();

        if ($department) {
            $code = NewRef::create("D-", $department['code']);
        }

        return $code;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        $departments = Department::filter(request(['search', 'is_active']))
                            ->whereOrganizationId($organization['id'])  
                            ->with('user')
                            ->orderBy('code', 'desc')
                            ->paginate(50);
                            
        return Inertia::render('Department/Index', [
            'departments' => $departments,
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'code' => Inertia::lazy(fn () => $this->newRef($organization)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => [
                        'required',
                        'string',
                        Rule::unique('departments')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })     
                    ],
            'code' => [
                        'required',
                        'string',
                        Rule::unique('departments')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })     
                    ],
            'description' => 'string|nullable',
        ]);

        $user = Auth::user();

        $validated = [...$validated, 
            'organization_id' => $organization['id'],
            'user_id' => $user['id'],
            'is_active' => true,
        ];

        Department::create($validated);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada DEPARTEMEN KEGIATAN dengan DATA : ' . json_encode($log));

        return redirect(route('data-master.department', $organization['id']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, Department $department)
    {
        $validated = $request->validate([
            'name' => [
                        'required',
                        'string',
                        Rule::unique('departments')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })->ignore($department['id'])    
                    ],
            'code' => [
                        'required',
                        'string',
                        Rule::unique('departments')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })->ignore($department['id'])    
                    ],
            'description' => 'string|nullable',
            'is_active' => 'boolean|nullable',
        ]);

        $department->update($validated);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
        ];

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada DEPARTEMEN KEGIATAN menjadi DATA : ' . json_encode($log));

        return redirect(route('data-master.department', $organization['id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Department $department)
    {
         // cek journal, apabila telah digunakan pada journal maka tolak permintaan hapus Department
        $journal = Journal::whereDepartmentId($department['id'])->first();

        if ($journal) {
            return redirect()->back()->withErrors(["delete" => "Can't delete, The Department is using"]);
        }

        $department->delete();
        $log = [
            'name' => $department['name'],
            'code' => $department['code'],            
            'description' => $department['description'],
        ];

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada DEPARTEMEN KEGIATAN, yaitu DATA : ' . json_encode($log));
        return redirect(route('data-master.department', $organization['id']));
    }
}
