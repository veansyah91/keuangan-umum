<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Support\Facades\Auth;
use App\Helpers\ContactCategoryHelper;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\ContactCategory\ContactCategoryRepository;
use Illuminate\Database\Eloquent\Builder;

class StudentContactController extends Controller
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

        $contactCategory = ContactCategory::whereOrganizationId($organization['id'])
                                            ->whereName('SISWA')
                                            ->first();

        if (!$contactCategory) {
            return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak SISWA terlebih dahulu!']);
        }
        
        $contacts = Contact::filter(request(['search']))
                            ->whereOrganizationId($organization['id'])
                            ->with('contactCategories')
                            ->whereHas('contactCategories', function ($query) use ($contactCategory){
                                $query->where('contact_category_id', $contactCategory['id']);
                            })
                            ->orderBy('name')
                            ->paginate(50);
        
        return Inertia::render('Student/Index',[
            'organization' => $organization,
            'contacts' => $contacts,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'searchFilter' => request('search'),
        ]);
    }

    public function create(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Student/Create',[
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'organization' => $organization,
            'category' => ContactCategory::whereOrganizationId($organization['id'])->whereName('SISWA')->first()
        ]);
    }

    public function store(Request $request, Organization $organization)
    {

        $validated = $request->validate([
            'name' => "required|string",
            'phone' => "string|nullable",
            'address' => "string|nullable",
            'description' => 'string|nullable',
            'father' => 'string|nullable',
            'mother' => 'string|nullable',
            'no_ref' => 'string|nullable',
            'level' => 'numeric|required',
            'birthday' => 'date|nullable',
            'entry_year' => 'numeric|required',
            'category' => ['required', 'exists:contact_categories,id']
        ]);

        // store to contacts table

        // store to contact_students table

        // store to student_levels table

    }
}
