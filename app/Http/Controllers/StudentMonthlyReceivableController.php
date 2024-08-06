<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Models\StudentMonthlyReceivable;
use App\Repositories\User\UserRepository;
use App\Models\StudentMonthlyReceivableLedger;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class StudentMonthlyReceivableController extends Controller
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
      $refHeader = 'PIB-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
      $newRef = $refHeader.'001';

      $cashIn = StudentMonthlyReceivableLedger::whereOrganizationId($organization['id'])
        ->where('no_ref', 'like', $refHeader.'%')
        ->orderBy('no_ref')
        ->get()
        ->last();

      if ($cashIn) {
        $newRef = NewRef::create('PIB-', $cashIn['no_ref']);
      }

      return $newRef;
    }
    
  public function index(Organization $organization)
  {
    $user = Auth::user();

    return Inertia::render('StudentMonthlyReceivable/Index',[
      'organization' => $organization,
      'receivables' => StudentMonthlyReceivable::filter(request(['search']))
                                  ->with('contact')
                                  ->whereOrganizationId($organization['id'])
                                  ->orderBy('value')
                                  ->paginate(50),
      'role' => $this->userRepository->getRole($user['id'], $organization['id']),
    ]);
  }
}
