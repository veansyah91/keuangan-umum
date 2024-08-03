<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Contact;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
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

        $studyYears = StudentLevel::select('year')->distinct()->take(10)->get();

        return Inertia::render('Student-Monthly-Payment/Create',[
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
                                                    ->whereIsActive(true)
                                                    ->get(),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'studyYears' => $studyYears,
            'contacts' => $this->contactRepository
                                ->getStudent($organization['id'], $contactCategory['id'], request(['contact'])),
            'cashAccounts' => Account::filter(request(['account']))
                                        ->whereIsActive(true)
                                        ->whereOrganizationId($organization['id'])
                                        ->whereIsCash(true)
                                        ->select('id', 'name', 'code', 'is_cash')
                                        ->orderBy('code')
                                        ->get(),
        ]);
    }

    public function store(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'contact_id' => [
                'required',
                'exists:contacts,id',
            ],
            'date' => [
                'required',
                'date',
            ],
            'level' => [
                'required',
                'numeric',
            ],
            'student_id' => [
                'string',
                'nullable',
            ],
            'no_ref' => [
                'required',
                'string',
                Rule::unique('student_monthly_payments')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'value' => [
                'required',
                'numeric',
            ],
            'type' => [
                'required',
                'in:now,prepaid,receivable',
            ],
            'month' => [
                'required',
                'numeric',
            ],
            'study_year' => [
                'string',
                'required',
            ],
            'details' => [
                'required',
            ],
            'details.*.id' => [
                'required',
                'exists:student_payment_categories,id'
            ],
            'details.*.name' => [
                'required',
                'string'
            ],
            'details.*.value' => [
                'required',
                'numeric',
                'min:0',
            ],
            'cash_account_id' => [
                'required',
                'exists:accounts,id'
            ],
            'description' => [
                'string',
                'nullable'
            ]
        ]);

        $validated['organization_id'] = $organization['id'];

        // cek apakah pembayaran sudah dilakukan
        $payment = StudentMonthlyPayment::whereOrganizationId($organization['id'])
                                          ->whereContactId($validated['contact_id'])
                                          ->where('month', $validated['month'])
                                          ->where('study_year', $validated['study_year'])
                                          ->first();

        if ($payment) {
            return redirect()->back()->withErrors(['error' => 'Data is existed']);
        }
        
        $payment = StudentMonthlyPayment::create($validated);

        foreach ($validated['details'] as $detail) {
            if ($detail['value'] > 0) {
                $data = [
                    'payment_id' => $payment['id'],
                    'student_payment_category_id' => $detail['id'],
                    'value' => $detail['value'],
                    'created_at' => $this->now,
                    'updated_at' => $this->now,
                ];

                DB::table('s_monthly_payment_details')
                    ->insert($data);
            }
        }

        $schoolAccount = SchoolAccountSetting::whereOrganizationId($organization['id'])->first();
        $creditAccount = Account::find('revenue_student');

        if ($validated['type'] = 'prepaid') {
            $creditAccount = Account::find($schoolAccount['prepaid_student']);
        } elseif ($validated['type'] = 'receivable')
        {
            $creditAccount = Account::find($schoolAccount['receivable_monthly_student']);
        }

        $cashAccount = Account::find($validated['cash_account_id']);

        $validated['accounts'] = [
            [
                'id' => $cashAccount['id'],
                'name' => $cashAccount['name'],
                'code' => $cashAccount['code'],
                'is_cash' => 1,
                'debit' => $validated['value'],
                'credit' => 0,
            ],
            [
                'id' => $creditAccount['id'],
                'name' => $creditAccount['name'],
                'code' => $creditAccount['code'],
                'is_cash' => 0,
                'debit' => 0,
                'credit' => $validated['value'],
            ],
        ];
        $journal = $this->journalRepository->store($validated);
        $validated['journal_id'] = $journal['id'];
        dd($journal);

    }
}
