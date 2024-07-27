<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
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
        return Inertia::render('Student-Monthly-Payment/Index',[
            'organization' => $organization,
            'payments' => StudentMonthlyPayment::filter(request(['search']))
                                        ->whereOrganizationId($organization['id'])
                                        ->paginate(50),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
