<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Journal;
use App\Models\Program;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class ProgramController extends Controller
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
        $refHeader = "PK-" . $this->now->isoFormat('YYYY');
        $code = $refHeader . '001';

        $program = Program::whereOrganizationId($organization['id'])
                            ->where('code', 'like', $refHeader . '%')
                            ->orderBy('code')
                            ->get()
                            ->last();

        if ($program) {
            $code = NewRef::create("PK-", $program['code']);
        }

        return $code;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        $programs = Program::filter(request(['search', 'is_active']))
                            ->whereOrganizationId($organization['id'])  
                            ->with('user')
                            ->orderBy('code', 'desc')
                            ->paginate(50);
                            
        return Inertia::render('Program/Index', [
            'programs' => $programs,
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'code' => Inertia::lazy(fn () => $this->newRef($organization)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
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
                        Rule::unique('programs')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })     
                    ],
            'code' => [
                        'required',
                        'string',
                        Rule::unique('programs')->where(function ($query) use ($request, $organization){
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

        Program::create($validated);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada PROGRAM KEGIATAN dengan DATA : ' . json_encode($log));

        return redirect(route('data-master.program', $organization['id']));
    }

    public function update(Request $request, Organization $organization, Program $program)
    {
        $validated = $request->validate([
            'name' => [
                        'required',
                        'string',
                        Rule::unique('programs')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })->ignore($program['id'])    
                    ],
            'code' => [
                        'required',
                        'string',
                        Rule::unique('programs')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })->ignore($program['id'])    
                    ],
            'description' => 'string|nullable',
            'is_active' => 'required|boolean',
        ]);

        $program->update($validated);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
        ];

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada PROGRAM KEGIATAN menjadi DATA : ' . json_encode($log));

        return redirect(route('data-master.program', $organization['id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Program $program)
    {
        // cek journal, apabila telah digunakan pada journal maka tolak permintaan hapus program
        $journal = Journal::whereProgramId($program['id'])->first();

        if ($journal) {
            return redirect()->back()->withErrors(["delete" => "Can't delete, The Program is using"]);
        }

        $program->delete();
        $log = [
            'name' => $program['name'],
            'code' => $program['code'],            
            'description' => $program['description'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada PROGRAM KEGIATAN, yaitu DATA : ' . json_encode($log));
        return redirect(route('data-master.program', $organization['id']));
    }
}
