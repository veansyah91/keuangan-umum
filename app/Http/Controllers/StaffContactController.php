<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Cashout;
use App\Models\Contact;
use App\Imports\StaffImport;
use App\Models\ContactStaff;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Maatwebsite\Excel\Facades\Excel;

class StaffContactController extends Controller
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
                                            ->whereName('STAF')
                                            ->first();

        if (!$contactCategory) {
            return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak STAF terlebih dahulu!']);
        }

        $contacts = Contact::filter(request(['search']))
                            ->whereOrganizationId($organization['id'])
                            ->with('contactCategories', 'staff')
                            ->whereHas('contactCategories', function ($query) use ($contactCategory){
                                $query->where('contact_category_id', $contactCategory['id']);
                            })
                            ->orderBy('name')
                            ->paginate(50);
        
        return Inertia::render('Staff/Index', [
            'organization' => $organization,
            'contacts' => $contacts,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'searchFilter' => request('search'),
            'category' => $contactCategory
        ]);
    }

    public function store(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => "required|string",
            'phone' => "string|nullable",
            'address' => "string|nullable",
            'description' => 'string|nullable',
            'no_ref' => 'string|nullable',
            'position' => 'string|nullable',
            'entry_year' => 'numeric|required',
            'category' => ['required', 'exists:contact_categories,id']
        ]);

        $validated['organization_id'] = $organization['id'];

        // store to contacts table
        $contact = Contact::create($validated);
        $contact->contactCategories()->attach($validated['category']);

        $validated['contact_id'] = $contact['id'];
        
        // store to contact_students table
        $contactStudent = ContactStaff::create($validated);
        
        return redirect()->back()->with('success', 'Data Staf Berhasil Disimpan');
    }

    public function update(Request $request, Organization $organization, Contact $contact)
    {
        $validated = $request->validate([
            'name' => "required|string",
            'phone' => "string|nullable",
            'address' => "string|nullable",
            'description' => 'string|nullable',
            'no_ref' => 'string|nullable',
            'position' => 'string|nullable',
            'entry_year' => 'numeric|required',
            'is_active' => 'boolean|required'
        ]);

        $contact->update($validated);

        $contactStaff = ContactStaff::whereContactId($contact['id'])->first();

        $contactStaff->update($validated);

        return redirect()->back()->with('success', 'Data Staf Berhasil Diubah');
    }

    public function destroy(Organization $organization, Contact $contact)
    {
        // cek kontak
        $cashOut = Cashout::whereContactId($contact['id'])->first();

        if ($cashOut) {
            return redirect()->back()->withErrors(['message' => 'Tidak dapat menghapus Data Staf']);
        }

        $contact->delete();

        return redirect()->back()->with('success', 'Data Staf Berhasil Dihapus');
    }

    public function importStaff(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Staff/Import',[
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'organization' => $organization,
        ]);
    }

    public function downloadTemplate()
    {
        $disk = 'local'; // Atau 'sftp' atau disk lainnya
        $filename = 'public/templates/staff.csv';

        if (!Storage::disk($disk)->exists($filename)) {
            abort(404, 'File not found.');
        }
        return Storage::disk($disk)->download($filename);
    }

    public function storeImportStaff(Request $request, Organization $organization)
    {

        $validated = $request->validate([
            'staff' => [
                'required',
                'file',
                // 'mimes:csv,xlsx,xls'
            ],
        ]);

        $file = $request->file('staff');

        try {
            Excel::import(new StaffImport($organization['id']), $file);
        } catch (Throwable $th) {
            abort(503, 'Something Wrong');
        }
        
        return redirect()->back()->with('success', "Import data staf Berhasil");
    }
}
