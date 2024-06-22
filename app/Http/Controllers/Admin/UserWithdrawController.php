<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Affiliation;
use Illuminate\Http\Request;
use App\Models\AffiliationWithdraw;
use App\Http\Controllers\Controller;

class UserWithdrawController extends Controller
{
    public function index()
    {   
        $withdraws = AffiliationWithdraw::filter(request(['search', 'start_date', 'end_date']))
                                            ->with('user')
                                            ->orderBy('created_at','desc')
                                            ->paginate(50);

        return Inertia::render('Admin/Withdraw/Index', [
            'withdraws' => $withdraws,
            'affiliation' => Inertia::lazy(fn () => Affiliation::whereUserId(request('user_id'))->first()),
            'searchFilter' => request('search'),
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
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
