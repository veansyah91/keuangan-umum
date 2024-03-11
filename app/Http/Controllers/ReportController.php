<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ledger;
use App\Models\Account;
use App\Models\Journal;
use App\Models\Program;
use App\Models\Project;
use App\Models\Cashflow;
use App\Models\Department;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use Illuminate\Database\Eloquent\Builder;

class ReportController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    /**
     * Handle the incoming request.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Report/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id'])
        ]);
    }

    public function cashflow(Organization $organization)
    {
        $user = Auth::user();

        if (request('startDate') > request('endDate')) {
            
            return redirect()->back()->withErrors(["date" => "Invalid date input"]);

        }
        $startCashflow = Cashflow::whereOrganizationId($organization['id'])
                                    ->where('date', '<', request('startDate') ?? '')
                                    ->select(DB::raw('SUM(debit) - SUM(credit) as total'))
                                    ->first();

        $cashflows = Cashflow::join('accounts', 'cashflows.account_id', '=', 'accounts.id')
                            ->where(function($query){
                                $query->where('cashflows.date', '>=', request('startDate') ?? '')
                                            ->where('cashflows.date', '<=', request('endDate') ?? '');
                            })
                            ->where('cashflows.organization_id',$organization['id'])
                            ->select('accounts.code as code','accounts.name as name','category','account_id',DB::raw('SUM(debit) - SUM(credit) as total'))
                            ->orderBy('accounts.code')
                            ->orderBy('total', 'desc')
                            ->groupBy('account_id', 'category')
                            ->get();

        return Inertia::render('Report/Cashflow', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'cashflows' => $cashflows,
            'startCashflow' => $startCashflow,
            'startDateFilter' => request('startDate'),
            'endDateFilter' => request('endDate'),
        ]);
    }

    public function balance(Organization $organization)
    {
        $user = Auth::user();

        $ledgers = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
                                ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
                                ->where(function($query){
                                    $query->where('ledgers.date', '<=', request('endDate') ?? '');
                                })
                                ->where('ledgers.organization_id',$organization['id'])
                                ->where('accounts.code', '<', '400000000')
                                ->where('journals.is_approved', true)
                                ->select('accounts.code as code','accounts.name as name', 'account_id', 'accounts.can_be_deleted', DB::raw('SUM(debit) - SUM(credit) as total'))
                                ->orderBy('accounts.code')
                                ->orderBy('total', 'desc')
                                ->groupBy('account_id')
                                ->get();

        $account = Account::whereOrganizationId($organization['id'])
                            ->whereCanBeDeleted(false)
                            ->first();

        return Inertia::render('Report/Balance', [
            'organization' => $organization,
            'ledgers' => $ledgers,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'endDateFilter' => request('endDate'),
            'account' => $account
        ]);
    }

    public function lostProfit(Organization $organization)
    {
        $user = Auth::user();

        $ledgers = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
                                ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
                                ->where(function($query){
                                    $query->where('ledgers.date', '>=', request('startDate') ?? '')
                                                ->where('ledgers.date', '<=', request('endDate') ?? '');
                                })
                                ->where('ledgers.organization_id',$organization['id'])
                                ->where('accounts.code', '>=', '400000000')
                                ->where('journals.is_approved', true)
                                ->select('accounts.code as code','accounts.name as name','account_id',DB::raw('SUM(debit) - SUM(credit) as total'))
                                ->orderBy('accounts.code')
                                ->orderBy('total', 'desc')
                                ->groupBy('account_id')
                                ->get();

        return Inertia::render('Report/LostProfit', [
            'organization' => $organization,
            'ledgers' => $ledgers,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'startDateFilter' => request('startDate'),
            'endDateFilter' => request('endDate'),
        ]);
    }

    public function journal(Organization $organization)
    {
        $user = Auth::user();

        $journals = Journal::whereOrganizationId($organization['id'])
                            ->filter(request(['program','project','department']))
                            ->where(function($query){
                                $query->where('date', '>=', request('startDate') ?? '')
                                        ->where('date', '<=', request('endDate') ?? '');
                            })
                            ->with('ledgers', function ($query) {
                                $query->with('account');
                            })
                            ->with('department')
                            ->with('project')
                            ->with('program')
                            ->orderBy('date')
                            ->get();
        
        return Inertia::render('Report/Journal', [
            'organization' => $organization,
            'journals' => $journals,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'startDateFilter' => request('startDate'),
            'endDateFilter' => request('endDate'),
            'projects' => Project::whereOrganizationId($organization['id'])
                                    ->get(),
            'programs' => Program::whereOrganizationId($organization['id'])
                            ->get(),
            'departments' => Department::whereOrganizationId($organization['id'])
                                        ->get(),
            'program' => Program::find(request('program')),
            'project' => Project::find(request('project')),
            'department' => Department::find(request('department')),
        ]);
    }

    public function ledger(Organization $organization)
    {
        $user = Auth::user();

        $ledgerBefore = Ledger::whereOrganizationId($organization['id'])
                                ->where('is_approved', true)
                                ->filter(request(['program','project','department']))
                                ->where('date', '<', request('startDate') ?? '')
                                ->whereAccountId(request('account') ?? '')
                                ->get();

        $ledger = Ledger::filter(request(['program','project','department']))
                        ->whereOrganizationId($organization['id'])
                        ->where('date', '>=', request('startDate') ?? '')
                        ->where('date', '<=', request('endDate') ?? '')
                        ->whereAccountId(request('account') ?? '')
                        ->whereIsApproved(true)
                        ->with('journal')
                        ->with('department', 'project', 'program')
                        ->orderBy('date')
                        ->get();

        return Inertia::render('Report/Ledger', [
            'organization' => $organization,
            'ledgers' => $ledger,
            'startedValue' => (int)$ledgerBefore->sum('debit') - (int)$ledgerBefore->sum('credit'),
            'accounts' => Account::whereOrganizationId($organization['id'])
                                    ->orderBy('code')
                                    ->get(),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'startDateFilter' => request('startDate'),
            'endDateFilter' => request('endDate'),
            'projects' => Project::whereOrganizationId($organization['id'])
                                    ->get(),
            'programs' => Program::whereOrganizationId($organization['id'])
                            ->get(),
            'departments' => Department::whereOrganizationId($organization['id'])
                                        ->get(),
            'program' => Program::find(request('program')),
            'project' => Project::find(request('project')),
            'department' => Department::find(request('department')),
            'account' => Account::find(request('account')),
        ]);
    }

    public function ledgers(Organization $organization)
    {
        $user = Auth::user();

        $accounts = Account::whereOrganizationId($organization['id'])
                            ->whereHas('ledgers')
                            ->get();

        $accountHasLedgers = [];
        $startedValues = [];
        $index = 0;                   
        foreach ($accounts as $account) {
            $ledgers = Ledger::filter(request(['project', 'program', 'department']))
                                ->where('date', '>=', request('startDate') ?? '')
                                ->where('date', '<=', request('endDate') ?? '')
                                ->where('is_approved', true)
                                ->where('account_id', $account['id'])
                                ->with('department', 'project', 'program', 'journal')
                                ->orderBy('date')
                                ->get();

            $ledgerBefore = Ledger::filter(request(['project', 'program', 'department']))
                                    ->where('date', '<', request('startDate') ?? '')
                                    ->where('account_id', $account['id'])
                                    ->where('is_approved', true)
                                    ->get();

            $accountHasLedgers[$index++] = [
                'code' => $account['code'],
                'id' => $account['id'],
                'name' => $account['name'],
                'ledgers' => $ledgers,
                'startedValue' => $ledgerBefore->sum('debit') - $ledgerBefore->sum('credit')
            ];
        }

        return Inertia::render('Report/Ledgers', [
            'organization' => $organization,
            'accounts' => $accountHasLedgers,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'startDateFilter' => request('startDate'),
            'endDateFilter' => request('endDate'),
            'projects' => Project::whereOrganizationId($organization['id'])
                                    ->get(),
            'programs' => Program::whereOrganizationId($organization['id'])
                            ->get(),
            'departments' => Department::whereOrganizationId($organization['id'])
                                        ->get(),
            'program' => Program::find(request('program')),
            'project' => Project::find(request('project')),
            'department' => Department::find(request('department')),
        ]);
    }
}
