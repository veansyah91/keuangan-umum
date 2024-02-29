<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class ContactCategoryController extends Controller
{
    protected $userRepository;
    protected $logRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization): Response
    {
        $contactCategories = ContactCategory::filter(request(['search']))
                                            ->whereOrganizationId($organization['id'])
                                            ->paginate(50);
        $user = Auth::user();

        return Inertia::render('ContactCategory/Index', [
            'organization' => $organization,
            'contactCategories' => $contactCategories,
            'role' => $this->userRepository->getRole($user['id'], $organization['id'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Organization $organization, Request $request): RedirectResponse
    {

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string', 
                Rule::unique('contact_categories')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })                
            ]
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        $log = $validated;

        $validated['organization_id'] = $organization['id'];

        ContactCategory::create($validated);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada KATEGORI KONTAK dengan DATA : ' . json_encode($log));

        return redirect(route('data-master.contact-category', $organization['id']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Organization $organization, Request $request, ContactCategory $contactCategory): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string', 
                Rule::unique('contact_categories')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })->ignore($contactCategory['id'])                
            ]
        ]);

        $validated = $validator->validated();

        $contactCategory->update($validated);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada KATEGORI KONTAK menjadi : ' . json_encode($validated));

        return redirect(route('data-master.contact-category', $organization['id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, ContactCategory $contactCategory): RedirectResponse
    {
        // Cek Apakah Telah Digunakan Oleh Contact
            $contacts = Contact::whereHas('contactCategories', function ($query) use ($contactCategory){
                                    $query->whereContactCategoryId($contactCategory['id']);
                                })
                                ->get();

            if (count($contacts) > 0) {
                return redirect(route('data-master.contact-category', $organization['id']))->withErrors(['delete_confirmation' => 'Kategori Kontak Tidak Bisa Dihapus, Karena Telah Digunakan']);
            }
        // 

        $log = [
            'name' => $contactCategory['name']
        ];

        $contactCategory->delete();

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada KATEGORI KONTAK, Data : ' . json_encode($log));
        return redirect(route('data-master.contact-category', $organization['id']))->with('success', 'Kategori Kontak Berhasil Dihapus');
    }
}
