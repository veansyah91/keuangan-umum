<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Affiliation;
use Illuminate\Http\Request;
use App\Models\AffiliationWithdraw;
use App\Http\Controllers\Controller;

class UserWithdrawController extends Controller
{
    public function index()
    {   
        $affiliationFilter = null;
        if (request('status')) {
            $affiliationFilter = filter_var(request('status'), FILTER_VALIDATE_BOOLEAN);
        }

        $withdraws = AffiliationWithdraw::filter(request(['search', 'start_date', 'end_date']))
                                            ->when($affiliationFilter !== null , function ($query) use ($affiliationFilter){
                                                return $query->where('status', $affiliationFilter);
                                            })
                                            ->with('user')
                                            ->orderBy('created_at','desc')
                                            ->paginate(50);

        $affiliators = Affiliation::limit(10)->get();
        $affiliators = User::whereHas('affiliation')
                            ->when(request('user') ?? false, function ($query, $user) {
                                return $query->where('name', 'like', '%'.$user.'%')
                                                ->orWhere('email', 'like', '%'.$user.'%');
                            })
                            ->with('affiliation')
                            ->limit(10)
                            ->get();

        return Inertia::render('Admin/Withdraw/Index', [
            'withdraws' => $withdraws,
            'affiliation' => Inertia::lazy(fn () => Affiliation::whereUserId(request('user_id'))->first()),
            'searchFilter' => request('search'),
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'statusFilter' => request('status'),
            'affiliators' => $affiliators
        ]);
    }

    public function update(Request $request, AffiliationWithdraw $withdraw)
    {   
        $affiliation = Affiliation::whereUserId($withdraw['user_id'])->first();
        $newBalance = $affiliation['balance']-$request['value'];
        $affiliation->update([
            'balance' => $newBalance
        ]);

        $withdraw->update([
            'status' => true
        ]);
        return redirect()->back();
    }
}
