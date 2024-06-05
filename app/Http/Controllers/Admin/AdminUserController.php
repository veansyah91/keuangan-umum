<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    protected function codeRecomendation($name)
    {
        return $name;
    }

    public function index()
    {
        $users = User::with('affilation')->filter(request(['search', 'start_date', 'end_date']))->whereNot('role', 'super-admin')->paginate(50);

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

        // dd($this->codeRecomendation(request('name')));

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'userCollections' => $userCollection,
            'searchFilter' => request('searchFilter'),
            'affiliateCoderecommendation' => Inertia::lazy(fn () => $this->codeRecomendation(request('name')))
        ]);
    }
}
