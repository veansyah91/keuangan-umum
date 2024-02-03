<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

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
        $validated = $request->validate([
            'name' => ['required','string', Rule::unique('contact_categories')]
        ]);

        $validated['organization_id'] = $organization['id'];

        ContactCategory::create($validated);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada KATEGORI KONTAK dengan NAMA : ' . $validated['name']);

        return redirect(route('contact-category', $organization['id']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Organization $organization, Request $request, ContactCategory $contactCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required','string', Rule::unique('contact_categories')->ignore($contactCategory)]
        ]);

        $oldData = $contactCategory['name'];

        $contactCategory->update($validated);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada KATEGORI KONTAK dengan NAMA : ' . $validated['name'] . ' (sebelumnya : ' . $oldData . ')');

        return redirect(route('contact-category', $organization['id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, ContactCategory $contactCategory): RedirectResponse
    {
        // Cek Apakah Telah Digunakan Oleh Contact
            
        // 

        $contactCategory->delete();

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada KATEGORI KONTAK dengan NAMA : ' . $contactCategory['name']);
        return redirect(route('contact-category', $organization['id']));
    }
}
