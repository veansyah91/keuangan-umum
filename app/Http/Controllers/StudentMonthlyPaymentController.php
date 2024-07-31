<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Contact;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentPaymentCategory;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentMonthlyPaymentController extends Controller
{
    protected $userRepository;

    protected $logRepository;

    protected $journalRepository;

    protected $contactRepository;

    protected $now;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository, ContactRepository $contactRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->journalRepository = $journalRepository;
        $this->contactRepository = $contactRepository;
        $this->now = CarbonImmutable::now();
    }

    protected function newRef($organization, $dateRequest = '')
    {
        $now = $this->now;
        $date = $dateRequest ?? $now->isoFormat('YYYY-MM-DD');
        $dateRef = Carbon::create($date);
        $refHeader = 'IB-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
        $newRef = $refHeader.'001';

        $cashIn = StudentMonthlyPayment::whereOrganizationId($organization['id'])
            ->where('no_ref', 'like', $refHeader.'%')
            ->orderBy('no_ref')
            ->get()
            ->last();

        if ($cashIn) {
            $newRef = NewRef::create('IB-', $cashIn['no_ref']);
        }

        return $newRef;
    }
    
    public function index(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Student-Monthly-Payment/Index',[
            'organization' => $organization,
            'payments' => StudentMonthlyPayment::filter(request(['search']))
                                        ->whereOrganizationId($organization['id'])
                                        ->paginate(50),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }

    public function create(Organization $organization)
    {
        $user = Auth::user();

        $contactCategory = ContactCategory::whereOrganizationId($organization['id'])
                                            ->whereName('SISWA')
                                            ->first();

        if (!$contactCategory) {
            return redirect()->back()->withErrors(['message' => 'Silakan Buat Kategori Kontak SISWA terlebih dahulu!']);
        }

        return Inertia::render('Student-Monthly-Payment/Create',[
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
                                                    ->whereIsActive(true)
                                                    ->get(),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            // 'contacts' => Contact::filter(request(['contact']))
            //                         ->whereOrganizationId($organization['id'])
            //                         ->with(['contactCategories', 'student', 'levels'])
            //                         ->whereHas('contactCategories', function ($query) use ($contactCategory){
            //                             $query->where('contact_category_id', $contactCategory['id']);
            //                         })
            //                         ->orderBy('name')
            //                         ->get(),
            'contacts' => $this->contactRepository
                                ->getStudent($organization['id'], $contactCategory['id'], request(['contact'])),
        ]);
    }
}
