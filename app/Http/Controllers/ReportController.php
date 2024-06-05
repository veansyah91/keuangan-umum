<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Cashflow;
use App\Models\Department;
use App\Models\Journal;
use App\Models\Ledger;
use App\Models\Organization;
use App\Models\Program;
use App\Models\Project;
use App\Repositories\User\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }

    public function cashflow(Organization $organization)
    {
        $user = Auth::user();

        if (request('startDate') > request('endDate')) {

            return redirect()->back()->withErrors(['date' => 'Invalid date input']);

        }
        $startCashflow = Cashflow::whereOrganizationId($organization['id'])
            ->whereHas('journal', function ($query) {
                $query->filter(request(['project', 'program', 'department']));
            })
            ->where('date', '<', request('startDate') ?? '')
            ->select(DB::raw('SUM(debit) - SUM(credit) as total'))
            ->first();

        $cashflows = Cashflow::join('accounts', 'cashflows.account_id', '=', 'accounts.id')
            ->whereHas('journal', function ($query) {
                $query->filter(request(['project', 'program', 'department']));
            })
            ->where(function ($query) {
                $query->where('cashflows.date', '>=', request('startDate') ?? '')
                    ->where('cashflows.date', '<=', request('endDate') ?? '');
            })
            ->where('cashflows.organization_id', $organization['id'])
            ->select('accounts.code as code', 'accounts.name as name', 'category', 'account_id', DB::raw('SUM(debit) - SUM(credit) as total'))
            ->orderBy('accounts.code')
            ->orderBy('total', 'desc')
            ->groupBy('account_id', 'category', 'accounts.code', 'accounts.name')
            ->get();

        return Inertia::render('Report/Cashflow', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'cashflows' => $cashflows,
            'startCashflow' => $startCashflow,
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

    public function balance(Organization $organization)
    {
        $user = Auth::user();

        $ledgers = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
            ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
            ->whereHas('journal', function ($query) {
                $query->filter(request(['project', 'program', 'department']));
            })
            ->where(function ($query) {
                $query->where('ledgers.date', '<=', request('endDate') ?? '');
            })
            ->where('ledgers.organization_id', $organization['id'])
            ->where('accounts.code', '<', '400000000')
            ->where('journals.is_approved', true)
            ->select('accounts.code as code', 'accounts.name as name', 'account_id', 'accounts.can_be_deleted', DB::raw('SUM(debit) - SUM(credit) as total'))
            ->orderBy('accounts.code')
            ->orderBy('total', 'desc')
            ->groupBy('account_id', 'accounts.code', 'accounts.name', 'accounts.can_be_deleted')
            ->get();

        $account = Account::whereOrganizationId($organization['id'])
            ->whereCanBeDeleted(false)
            ->first();

        return Inertia::render('Report/Balance', [
            'organization' => $organization,
            'ledgers' => $ledgers,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'endDateFilter' => request('endDate'),
            'account' => $account,
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

    public function lostProfit(Organization $organization)
    {
        $user = Auth::user();

        $ledgers = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
            ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
            ->whereHas('journal', function ($query) {
                $query->filter(request(['project', 'program', 'department']));
            })
            ->where(function ($query) {
                $query->where('ledgers.date', '>=', request('startDate') ?? '')
                    ->where('ledgers.date', '<=', request('endDate') ?? '');
            })
            ->where('ledgers.organization_id', $organization['id'])
            ->where('accounts.code', '>=', '400000000')
            ->where('journals.is_approved', true)
            ->select('accounts.code as code', 'accounts.name as name', 'account_id', DB::raw('SUM(debit) - SUM(credit) as total'))
            ->orderBy('accounts.code')
            ->orderBy('total', 'desc')
            ->groupBy('account_id', 'accounts.code', 'accounts.name')
            ->get();

        return Inertia::render('Report/LostProfit', [
            'organization' => $organization,
            'ledgers' => $ledgers,
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

    public function journal(Organization $organization)
    {
        $user = Auth::user();

        $journals = Journal::whereOrganizationId($organization['id'])
            ->filter(request(['program', 'project', 'department']))
            ->where(function ($query) {
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
            ->filter(request(['program', 'project', 'department']))
            ->where('date', '<', request('startDate') ?? '')
            ->whereAccountId(request('account') ?? '')
            ->get();

        $ledger = Ledger::filter(request(['program', 'project', 'department']))
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
            'startedValue' => (int) $ledgerBefore->sum('debit') - (int) $ledgerBefore->sum('credit'),
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
            ->orderBy('code')
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
                'startedValue' => $ledgerBefore->sum('debit') - $ledgerBefore->sum('credit'),
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

    public function trialBalance(Organization $organization)
    {
        $user = Auth::user();

        $balances = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
            ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
            ->where(function ($query) {
                $query->where('ledgers.date', '<=', request('endDate') ?? '');
            })
            ->where('ledgers.organization_id', $organization['id'])
            ->where(function ($query) {
                $query->when(request('project') ?? false, function ($query) {
                    $query->where('ledgers.project_id');
                });
            })
            ->where('accounts.code', '<', '400000000')
            ->where('journals.is_approved', true)
            ->select('accounts.code as code', 'accounts.name as name', 'account_id', 'accounts.can_be_deleted', DB::raw('SUM(ledgers.debit) as endDebit'), DB::raw('SUM(ledgers.credit) as endCredit'))
            ->orderBy('accounts.code')
            ->groupBy('account_id', 'accounts.name', 'accounts.can_be_deleted', 'accounts.code')
            ->get();

        $lostProfits = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
            ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
            ->where(function ($query) {
                $query->where('ledgers.date', '>=', request('startDate') ?? '')
                    ->where('ledgers.date', '<=', request('endDate') ?? '');
            })
            ->where('ledgers.organization_id', $organization['id'])
            ->where(function ($query) {
                $query->when(request('project') ?? false, function ($query) {
                    $query->where('ledgers.project_id');
                });
            })
            ->where('accounts.code', '>=', '400000000')
            ->where('journals.is_approved', true)
            ->select('accounts.code as code', 'accounts.name as name', 'account_id', 'accounts.can_be_deleted', DB::raw('SUM(ledgers.debit) as tempDebit'), DB::raw('SUM(ledgers.credit) as tempCredit'), DB::raw('SUM(ledgers.debit) as endDebit'), DB::raw('SUM(ledgers.credit) as endCredit'))
            ->orderBy('accounts.code')
            ->groupBy('account_id', 'accounts.code', 'accounts.name', 'accounts.can_be_deleted')
            ->get();

        $lostProfitBefore = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
            ->join('journals', 'ledgers.journal_id', '=', 'journals.id')
            ->where(function ($query) {
                $query->where('ledgers.date', '<', request('startDate') ?? '');
            })
            ->where('ledgers.organization_id', $organization['id'])
            ->where(function ($query) {
                $query->when(request('project') ?? false, function ($query) {
                    $query->where('ledgers.project_id');
                });
            })
            ->where('accounts.code', '>=', '400000000')
            ->where('journals.is_approved', true)
            ->select(DB::raw('SUM(ledgers.debit) - SUM(ledgers.credit) as value'))
            ->first();
        $currentProfit = false;

        $total = [
            'startDebit' => 0,
            'startCredit' => 0,
            'tempDebit' => 0,
            'tempCredit' => 0,
            'endDebit' => 0,
            'endCredit' => 0,
        ];

        foreach ($balances as $balance) {
            $tempBalance = Ledger::join('journals', 'ledgers.journal_id', '=', 'journals.id')
                ->where(function ($query) {
                    $query->where('ledgers.date', '>=', request('startDate') ?? '')
                        ->where('ledgers.date', '<=', request('endDate') ?? '');
                })
                ->where(function ($query) {
                    $query->when(request('project') ?? false, function ($query) {
                        $query->where('ledgers.project_id');
                    });
                })
                ->where('ledgers.account_id', $balance['account_id'])
                ->where('journals.is_approved', true)
                ->select(DB::raw('SUM(ledgers.debit) as debit'), DB::raw('SUM(ledgers.credit) as credit'))
                ->first();

            $tempBalanceDebit = $tempBalance ? (int) $tempBalance['debit'] : 0;
            $tempBalanceCredit = $tempBalance ? (int) $tempBalance['credit'] : 0;

            $balance['tempDebit'] = (int) $tempBalance['debit'];
            $balance['tempCredit'] = (int) $tempBalance['credit'];

            // cek apabila akun ini adalah *laba tahun berjalan
            if (! $balance['can_be_deleted']) {
                if ((int) $lostProfitBefore['value'] > 0) {
                    $balance['endDebit'] += (int) $lostProfitBefore['value'];
                }
                if ((int) $lostProfitBefore['value'] < 0) {
                    $balance['endCredit'] += abs((int) $lostProfitBefore['value']);
                }

                $currentProfit = true;
            }

            $netBalance = (int) $balance['endDebit'] - (int) $balance['endCredit'];

            $total['tempDebit'] += $balance['tempDebit'];
            $total['tempCredit'] += $balance['tempCredit'];

            $total['endDebit'] += $netBalance > 0 ? abs($netBalance) : 0;
            $total['endCredit'] += $netBalance < 0 ? abs($netBalance) : 0;

            $tempBefore = $netBalance - ((int) $tempBalance['debit'] - (int) $tempBalance['credit']);

            $total['startDebit'] += $tempBefore > 0 ? $tempBefore : 0;
            $total['startCredit'] += $tempBefore < 0 ? abs($tempBefore) : 0;
        }

        foreach ($lostProfits as $lostProfit) {
            $total['tempDebit'] += (int) $lostProfit['tempDebit'];
            $total['tempCredit'] += (int) $lostProfit['tempCredit'];
            $total['endDebit'] += (int) $lostProfit['tempDebit'];
            $total['endCredit'] += (int) $lostProfit['tempCredit'];
        }

        $account = Account::whereOrganizationId($organization['id'])
            ->whereCanBeDeleted(false)
            ->first();

        if (! $currentProfit && count($balances)) {
            $balances[count($balances)] = [
                'account_id' => $account['id'],
                'can_be_deleted' => false,
                'code' => $account['code'],
                'endCredit' => (int) $lostProfitBefore['value'] < 0 ? abs((int) $lostProfitBefore['value']) : 0,
                'endDebit' => (int) $lostProfitBefore['value'] > 0 ? abs((int) $lostProfitBefore['value']) : 0,
                'name' => $account['name'],
                'tempCredit' => 0,
                'tempDebit' => 0,
            ];

            $total['startDebit'] += (int) $lostProfitBefore['value'] > 0 ? abs((int) $lostProfitBefore['value']) : 0;
            $total['startCredit'] += (int) $lostProfitBefore['value'] < 0 ? abs((int) $lostProfitBefore['value']) : 0;
            $total['endCredit'] += (int) $lostProfitBefore['value'] < 0 ? abs((int) $lostProfitBefore['value']) : 0;
            $total['endDebit'] += (int) $lostProfitBefore['value'] > 0 ? abs((int) $lostProfitBefore['value']) : 0;
        }

        return Inertia::render('Report/TrialBalance', [
            'organization' => $organization,
            'lostProfits' => $lostProfits,
            'balances' => $balances,
            'total' => $total,
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
}
