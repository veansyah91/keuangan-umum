<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class DashboardController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    public function index(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Dashboard', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id'])
        ]);
    }
}
