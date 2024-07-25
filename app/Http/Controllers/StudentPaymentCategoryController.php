<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentPaymentCategory;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class StudentPaymentCategoryController extends Controller
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

        return Inertia::render('StudentPaymentCategory/Index', [
            'organization' => $organization,
            'data' => StudentPaymentCategory::filter(request(['search']))
                                                ->whereOrganizationId($organization['id'])
                                                ->paginate(50),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
