<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AffiliationWithdraw;
use App\Http\Controllers\Controller;

class UserWithdrawController extends Controller
{
    public function index()
    {   
        $withdraws = AffiliationWithdraw::with('user')->paginate(50);
        return Inertia::render('Admin/Withdraw/Index', [
            'withdraws' => $withdraws
        ]);
    }
}
