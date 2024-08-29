<?php

namespace App\Http\Controllers;

use App\Models\Cashflow;
use App\Models\Ledger;
use App\Models\Organization;
use App\Repositories\User\UserRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $userRepository;

    protected function dataResponse($organization, $user, $startDate, $endDate)
    {
        $balance = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
                            ->where('ledgers.date', '<=', $endDate)
                            ->where('ledgers.organization_id', $organization['id'])
                            ->where('ledgers.is_approved', true)
                            ->select('ledgers.date', 'account_id', 'accounts.code', DB::raw('SUM(debit) - SUM(credit) as total'))
                            ->groupBy('account_id', 'ledgers.date', 'accounts.code')
                            ->orderBy('accounts.code')
                            ->orderBy('ledgers.date')
                            ->get();

        $lostProfit = Ledger::join('accounts', 'ledgers.account_id', '=', 'accounts.id')
                            ->where(function ($query) use ($startDate, $endDate) {
                                $query->where('ledgers.date', '>=', $startDate)
                                    ->where('ledgers.date', '<=', $endDate);
                            })
                            ->where('ledgers.organization_id', $organization['id'])
                            ->where('ledgers.is_approved', true)
                            ->where('accounts.code', '>=', '400000000')
                            ->select('ledgers.account_id', 'accounts.code', 'accounts.name', 'ledgers.date', DB::raw('SUM(debit) - SUM(credit) as total'))
                            ->groupBy('ledgers.account_id', 'ledgers.date', 'accounts.code', 'accounts.name')
                            ->orderBy('accounts.code')
                            ->orderBy('ledgers.date')
                            ->get();

				$cashflows = Cashflow::whereOrganizationId($organization['id'])
															->where('date', '<=', $endDate)
															->get();

        $currentAsset = $balance->where('code', '<', '160000000')->sum('total');
        $fixedAsset = $balance->where('code', '>=', '160000000')->where('code', '<', '200000000')->sum('total');
        $liability = $balance->where('code', '>=', '200000000')->where('code', '<', '300000000')->sum('total');
        $equity = $balance->where('code', '>=', '300000000')->sum('total');

        $tempStartDate = CarbonImmutable::parse($startDate);

        $revenue = $balance->where('date', '>=', $tempStartDate->format('Y-m-d'))->where('code', '>=', '400000000')->where('code', '<', '500000000')->sum('total');
        $cost = $balance->where('date', '>=', $tempStartDate->format('Y-m-d'))->where('code', '>=', '500000000')->sum('total');

        $revenueDay = [];
        $costDay = [];
        $cashflowDay = [];

        for ($i = 0; $i < (int) CarbonImmutable::parse($endDate)->format('d'); $i++) {
            $day = strval($i + 1);
            $month = CarbonImmutable::parse($endDate)->format('m');
            $year = CarbonImmutable::parse($endDate)->format('Y');
            $newDate = $year.'-'.$month.'-'.$day;
            $new = CarbonImmutable::parse($newDate);

            $revenueDay[$i] = [
                'date' => $i + 1,
                'value' => abs($balance->where('code', '>=', '400000000')->where('code', '<', '500000000')->where('date', $new->format('Y-m-d'))->sum('total')),
            ];

            $costDay[$i] = [
                'date' => $i + 1,
                'value' => abs($balance->where('code', '>=', '500000000')->where('code', '<', '700000000')->where('date', $new->format('Y-m-d'))->sum('total')),
            ];

            $cashflowDay[$i] = [
                'date' => $i + 1,
                'balance' => $cashflows->where('date', '<=', $new->format('Y-m-d'))
                    ->sum('debit') - $cashflows->where('date', '<=', $new->format('Y-m-d'))
                    ->sum('credit'),
                'debit' => $cashflows->where('date', $new->format('Y-m-d'))
                    ->sum('debit'),
                'credit' => $cashflows->where('date', $new->format('Y-m-d'))
                    ->sum('credit'),
            ];
        }

        $revenues = $lostProfit->where('code', '>=', '400000000')->where('code', '<', '500000000')->toArray();
        $costs = $lostProfit->where('code', '>=', '500000000')
            ->where('code', '<', '700000000')
            ->toArray();

        $revenues = $this->joinArray($revenues);
        $costs = $this->joinArray($costs);
				
				return [
					'currentAsset' => $currentAsset,
					'fixedAsset' => $fixedAsset,
					'liability' => $liability,
					'equity' => $equity,
					'revenue' => $revenue,
					'cost' => $cost,
					'revenues' => $revenues,
					'costs' => $costs,
					'revenueDay' => $revenueDay,
					'costDay' => $costDay,
					'cashflowDay' => $cashflowDay,
				];
    }

    public function joinArray($array)
    {
        $result = [];
        foreach ($array as $item) {
            $group = $item['name'];
            $value = $item['total'];

            // Check if the group key exists in the sums array
            if (array_key_exists($group, $result)) {
                // If it exists, add the value to the existing sum
                $result[$group] += $value;
            } else {
                // If it doesn't exist, create a new entry with the current value
                $result[$group] = $value;
            }
        }

        return $result;
    }

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index(Organization $organization)
    {
        $now = CarbonImmutable::now();

        $startDate = request('startDate') ?? $now->startOfMonth();
        $endDate = request('endDate') ?? $now->endOfMonth();
        $user = Auth::user();

        return Inertia::render('Dashboard/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'balance' => Inertia::lazy(fn () => $this->dataResponse($organization, $user, $startDate, $endDate)),
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
