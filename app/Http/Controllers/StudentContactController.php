<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Cashin;
use App\Models\Contact;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\ContactStudent;
use App\Models\ContactCategory;
use Illuminate\Support\Facades\Auth;
use App\Helpers\ContactCategoryHelper;
use App\Repositories\Log\LogRepository;
use Illuminate\Support\Facades\Storage;
use App\Repositories\User\UserRepository;
use Illuminate\Database\Eloquent\Builder;
use App\Repositories\ContactCategory\ContactCategoryRepository;

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
                            ->with('student')
                            ->with('levels')
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
            'father_name' => 'string|nullable',
            'mother_name' => 'string|nullable',
            'no_ref' => 'string|nullable',
            'level' => 'numeric|required',
            'birthday' => 'date|nullable',
            'entry_year' => 'numeric|required',
            'year' => 'string|required',
            'category' => ['required', 'exists:contact_categories,id']
        ]);

        $validated['organization_id'] = $organization['id'];

        // store to contacts table
        $contact = Contact::create($validated);
        $contact->contactCategories()->attach($validated['category']);

        $validated['contact_id'] = $contact['id'];
        
        // store to contact_students table
        $contactStudent = ContactStudent::create($validated);

        // store to student_levels table
        $studentLevel = StudentLevel::create($validated);

        return redirect()->back()->with('success', 'Data Siswa Berhasil Disimpan');
    }

    public function show(Organization $organization, Contact $contact)
    {
        $user = Auth::user();

        $studentsLevel = StudentLevel::whereContactId($contact['id'])->get();

        return Inertia::render('Student/Show',[
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'organization' => $organization,
            'contact' => $contact,
            'student' => ContactStudent::whereContactId($contact['id'])->first(),
            'levels' => $studentsLevel
        ]);
    }

    public function edit(Organization $organization, Contact $contact)
    {
        $user = Auth::user();

        $studentLevel = StudentLevel::whereContactId($contact['id'])->get();

        return Inertia::render('Student/Edit',[
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'organization' => $organization,
            'contact' => $contact,
            'student' => ContactStudent::whereContactId($contact['id'])->first(),
            'level' => $studentLevel[0]
        ]);
    }

    public function update(Request $request, Organization $organization, Contact $contact)
    {
        $validated = $request->validate([
            'name' => "required|string",
            'phone' => "string|nullable",
            'address' => "string|nullable",
            'description' => 'string|nullable',
            'father_name' => 'string|nullable',
            'mother_name' => 'string|nullable',
            'no_ref' => 'string|nullable',
            'level' => 'numeric|required',
            'birthday' => 'date|nullable',
            'entry_year' => 'numeric|required',
            'year' => 'string|required',
            'is_active' =>'boolean|required',
            'student_id' => ['required', 'exists:contact_students,id'],
            'student_level_id' => ['required', 'exists:student_levels,id'],
        ]);

        $contact->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'description' => $validated['description'],
            'is_active' => $validated['is_active'],
        ]);

        $contactStudent = ContactStudent::find($validated['student_id']);
        $contactStudent->update([
            'father_name' => $validated['father_name'],
            'mother_name' => $validated['mother_name'],
            'birthday' => $validated['birthday'],
            'entry_year' => $validated['entry_year'],
            'no_ref' => $validated['no_ref'],
        ]);

        $studentLevel = StudentLevel::find($validated['student_level_id']);
        $studentLevel->update([
            'level' => $validated['level'],
        ]);
        
        return redirect()->back()->with('success', 'Data Siswa Berhasil Diubah');
    }

    public function destroy(Organization $organization, Contact $contact)
    {
        // cek pada cash in,
        // apabila terah terjadi transaksi, maka tidak dapat dilakukan
        // jika belum, maka lanjutkan proses

        $cashIn = Cashin::whereContactId($contact['id'])->first();

        if ($cashIn) {
            return redirect()->back()->withErrors(['message' => 'Tidak dapat menghapus Data Siswa']);
        }

        $studentLevel = StudentLevel::whereContactId($contact['id'])->first();
        $studentLevel->delete();

        $contact->delete();

        return redirect()->back()->with('success', 'Data Siswa Berhasil Dihapus');
    }

    public function importStudent(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Student/Import',[
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'organization' => $organization,
        ]);
    }

    public function downloadTemplate()
    {
        $disk = 'local'; // Atau 'sftp' atau disk lainnya
        $filename = 'public/templates/student.csv';

        if (!Storage::disk($disk)->exists($filename)) {
            abort(404, 'File not found.');
        }
        return Storage::disk($disk)->download($filename);
    }

    public function storeImportStudent(Request $request, Organization $organization)
    {

        $validated = $request->validate([
            'students' => ['required','file','mimes:csv,xlsx,xls'],
        ]);

        $file = $request->file('students');
        dd($validated);
    }
}
