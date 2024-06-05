<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Organization;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
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
        $user = Auth::user();

        $contacts = Contact::filter(request(['search']))
            ->whereOrganizationId($organization['id'])
            ->with('contactCategories')
            ->paginate(50);

        return Inertia::render('Contact/Index', [
            'organization' => $organization,
            'contacts' => $contacts,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'searchFilter' => request('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization): Response
    {
        $user = Auth::user();

        $categories = ContactCategory::whereOrganizationId($organization['id'])
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Contact/Create', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'string|nullable',
            'phone' => 'string|nullable',
            'description' => 'string|nullable',
            'category' => 'required',
            'category.*' => 'numeric',
        ]);

        $log = [
            'name' => $validated['name'],
            'address' => $validated['address'],
            'phone' => $validated['phone'],
        ];

        $validated['organization_id'] = $organization['id'];

        $contact = Contact::create($validated);

        $categories = collect($validated['category']);

        foreach ($categories as $category) {
            $contact->contactCategories()->attach($category);
        }

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada KONTAK, Data: '.json_encode($log));

        return redirect(route('data-master.contact.create', $organization['id']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact, Organization $organization)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Contact $contact)
    {
        $user = Auth::user();

        $categories = ContactCategory::whereOrganizationId($organization['id'])
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $contactCategories = $contact->contactCategories()->select('contact_category_id as id')->get();

        $selected = [];

        foreach ($contactCategories as $key => $contactCategory) {
            $selected[$key] = $contactCategory['id'];
        }

        return Inertia::render('Contact/Edit', [
            'organization' => $organization,
            'contact' => $contact,
            'contactCategory' => $selected,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, Contact $contact)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'string|nullable',
            'phone' => 'string|nullable',
            'description' => 'string|nullable',
            'category' => 'required',
            'category.*' => 'numeric',
        ]);

        $log = [
            'name' => $validated['name'],
            'address' => $validated['address'],
            'phone' => $validated['phone'],
        ];

        $contact->update($validated);

        $categories = collect($validated['category']);

        $contact->contactCategories()->sync($categories);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada KONTAK menjadi : '.json_encode($log));

        return redirect(route('data-master.contact.edit', ['organization' => $organization['id'], 'contact' => $contact['id']]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Contact $contact)
    {
        // Pengecekan Penggunaan User

        // Pengecekan Penggunaan User

        $contact->delete();

        return redirect(route('data-master.contact', $organization['id']));
    }
}
