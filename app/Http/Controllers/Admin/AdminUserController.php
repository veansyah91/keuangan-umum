<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserCollection;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::filter(request(['search','start_date', 'end_date']))->whereNot('role', 'super-admin')->paginate(50);

        $userCollection = $users->map(function ($user) {
                                    $date = new Carbon($user['created_at']);
                                    return [
                                        'id' => $user['id'],
                                        'name' => $user['name'],
                                        'email' => $user['email'],
                                        'date' => $date->isoFormat('D MMMM Y'),
                                        'role' => $user['role'],
                                        'email_verified_at' => $user['email_verified_at'],
                                    ];
                                });

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'userCollections' => $userCollection,
            'searchFilter' => request('searchFilter'),
        ]);
    }
}
