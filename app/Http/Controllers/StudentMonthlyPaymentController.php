<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class StudentMonthlyPaymentController extends Controller
{
    protected $userRepository;

    protected $logRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
    }
    
    public function index(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Student-Monthly-Payment/Index',[
            'organization' => $organization,
            'payments' => StudentMonthlyPayment::filter(request(['search']))
                                        ->whereOrganizationId($organization['id'])
                                        ->paginate(50),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }

    public function create(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('Student-Monthly-Payment/Create',[
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
