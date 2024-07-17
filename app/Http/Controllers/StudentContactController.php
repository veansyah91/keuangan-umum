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
                            ->whereCategoryId($contactCategory['id '])
                            ->with('contactCategories')
                            ->paginate(50);
        
        return Inertia::render('Student/Index',[
            'organization' => $organization,
            'contacts' => $contacts,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'searchFilter' => request('search'),
        ]);
    }
}
