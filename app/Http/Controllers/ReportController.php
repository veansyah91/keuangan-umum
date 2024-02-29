<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ledger;
use App\Models\Account;
use App\Models\Cashflow;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

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
        
    }
}
