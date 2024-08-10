<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Account;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentPaymentCategory;
use App\Repositories\Log\LogRepository;
use App\Models\StudentMonthlyReceivable;
use App\Repositories\User\UserRepository;
use App\Models\StudentMonthlyReceivableLedger;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentMonthlyReceivableController extends Controller
{
  protected $userRepository;
  protected $logRepository;
  protected $journalRepository;
  protected $contactRepository;
  protected $now;

  public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository, ContactRepository $contactRepository, AccountRepository $accountRepository)
  {
      $this->userRepository = $userRepository;
      $this->logRepository = $logRepository;
      $this->journalRepository = $journalRepository;
      $this->contactRepository = $contactRepository;
      $this->accountRepository = $accountRepository;
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
          ->orderBy('no_ref','desc')
          ->first();

      if ($cashIn) {
          $newRef = NewRef::create('IB-', $cashIn['no_ref']);
      }

      return $newRef;
  }
    
  public function index(Organization $organization)
  {
    $user = Auth::user();

    return Inertia::render('StudentMonthlyReceivable/Index',[
      'organization' => $organization,
      'receivables' => StudentMonthlyReceivable::filter(request(['search']))
                                  ->with('contact', function ($query) {
                                      $query->with('student', 'lastLevel');
                                  })
                                  ->where('value', '>', 0)
                                  ->whereOrganizationId($organization['id'])
                                  ->orderBy('value')
                                  ->paginate(50)->withQueryString(),
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

    return Inertia::render('StudentMonthlyReceivable/Create',[
      'organization' => $organization,
      'categories' => StudentPaymentCategory::whereOrganizationId($organization['id'])
                                                    ->whereIsActive(true)
                                                    ->get(),
      'role' => $this->userRepository->getRole($user['id'], $organization['id']),
      'newRef' => $this->newRef($organization, request('date')),
      'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
      'contacts' => $this->contactRepository->getStudents($organization['id'], $contactCategory['id'], request(['contact'])),
      'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
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
      'description' => [
          'string',
          'nullable'
      ],
      'credit_account' => [
          'required',
          'exists:accounts,id'
      ],
    ]);

    $user = Auth::user();
    $validated['type'] = 'receivable';
    $validated['organization_id'] = $organization['id'];
    $validated['user_id'] = $user['id'];

    // cek apakah pembayaran sudah dilakukan
    $payment = StudentMonthlyPayment::whereOrganizationId($organization['id'])
                                      ->whereContactId($validated['contact_id'])
                                      ->where('month', $validated['month'])
                                      ->where('study_year', $validated['study_year'])
                                      ->whereNot('type', 'receivable')
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
    $debitAccount = Account::find($schoolAccount['receivable_monthly_student']);

    $creditAccount = Account::find($validated['credit_account']);

    $validated['accounts'] = [
      [
          'id' => $debitAccount['id'],
          'name' => $debitAccount['name'],
          'code' => $debitAccount['code'],
          'is_cash' => 0,
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
    
    // buat data pada table piutang bulanan
    // cek apakah sudah ada data
    // jika sudah ada, maka tambahkan lalu update sisa (value) 
    // jika belum ada maka buat data baru
    $receivable = StudentMonthlyReceivable::whereOrganizationId($organization['id'])
                                            ->whereContactId($validated['contact_id'])
                                            ->first();

    if($receivable)
    {
        $temp_receivable = $receivable['value'];
        $receivable->update([
            'value' => $temp_receivable + $validated['value']
        ]);
    } else {
        $receivable = StudentMonthlyReceivable::create($validated);
    }

    $receivableLedger = StudentMonthlyReceivableLedger::create([
        'receivable_id' => $receivable['id'],
        'debit' => $validated['value'],
        'credit' => 0,
        'no_ref' => $validated['no_ref'],
        'description' => $validated['description'],
        'date' => $validated['date'],
        'study_year' => $validated['study_year'],
        'month' => $validated['month'],
        'payment_id' => $payment['id']
    ]);

    $journal = $this->journalRepository->store($validated);
    $validated['journal_id'] = $journal['id'];

    $log = [
        'description' => $validated['description'],
        'date' => $validated['date'],
        'no_ref' => $validated['no_ref'],
        'value' => $validated['value'],
    ];

    $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada PIUTANG IURAN BULANAN dengan DATA : '.json_encode($log));

    return redirect(route('cashflow.student-monthly-receivable.create', $organization['id']))->with('success', 'Piutang Iuran Bulanan Berhasil Ditambahkan');
  }
}
