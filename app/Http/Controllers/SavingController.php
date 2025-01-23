<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class SavingController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function __invoke(Request $request, Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Saving/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
