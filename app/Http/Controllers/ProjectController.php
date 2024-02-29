<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Journal;
use App\Models\Project;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class ProjectController extends Controller
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
    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();
        $projects = Project::filter(request(['search', 'status']))
                            ->whereOrganizationId($organization['id'])
                            ->orderBy('code', 'desc')
                            ->paginate(50);

        return Inertia::render('Project/Index', 
        [
            'projects' => $projects,
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $user = Auth::user();      

        $now = CarbonImmutable::now();
        $refHeader = "P-" . $now->isoFormat('YYYY');
        $code = $refHeader . '001';

        $project = Project::whereOrganizationId($organization['id'])
                            ->where('code', 'like', $refHeader . '%')
                            ->get()
                            ->last();

        if ($project) {
            $code = NewRef::create("P-", $project['code']);
        }

        return Inertia::render('Project/Create', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'code' => $code,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Organization $organization)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => [
                        'required',
                        'string',
                        Rule::unique('projects')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })     
                    ],
            'code' => [
                        'required',
                        'string',
                        Rule::unique('projects')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })     
                    ],
            'description' => 'string|nullable',
            'start_date' => 'date|nullable',
            'end_date' => 'date|nullable',
            'status' => [
                             Rule::in(['finished', 'in progress', 'pending', 'not started'])     
                        ],
            'estimated_value' => "numeric|min:0"
        ]);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'estimated_value' => $validated['estimated_value'],
        ];
        
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];
        Project::create($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada PROYEK dengan DATA : ' . json_encode($log));

        return redirect(route('data-master.project.create', $organization['id']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Project $project)
    {
        $user = Auth::user();

        return Inertia::render('Project/Show', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'project' => $project,
            'user' => $project->user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Project $project)
    {
        $user = Auth::user();

        return Inertia::render('Project/Edit', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'project' => $project,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, Project $project)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => [
                        'required',
                        'string',
                        Rule::unique('projects')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })->ignore($project['id'])
                    ],
            'code' => [
                        'required',
                        'string',
                        Rule::unique('projects')->where(function ($query) use ($request, $organization){
                            return $query->where('organization_id', $organization['id']);
                        })->ignore($project['id'])
                    ],
            'description' => 'string|nullable',
            'start_date' => 'date|nullable',
            'end_date' => 'date|nullable',
            'status' => [
                             Rule::in(['finished', 'in progress', 'pending', 'not started'])     
                        ],
            'estimated_value' => "numeric|min:0"
        ]);

        $project->update($validated);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'estimated_value' => $validated['estimated_value'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada PROYEK menjadi : ' . json_encode($log));

        return redirect(route('data-master.project.edit', ['organization' => $organization['id'], 'project' => $project['id']]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Project $project)
    {
        // cek journal, apabila telah digunakan pada journal maka tolak permintaan hapus project
        $journal = Journal::whereProjectId($project['id'])->first();

        if ($journal) {
            return redirect()->back()->withErrors(["delete" => "Can't delete, The Project is using"]);
        }

        $project->delete();
        $log = [
            'name' => $program['name'],
            'code' => $program['code'],
            'estimated_value' => $program['estimated_value'],
        ];

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada PROYEK, yaitu DATA : ' . json_encode($log));
        return redirect(route('data-master.project', $organization['id']));

    }
}
