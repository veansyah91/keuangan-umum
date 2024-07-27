<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SalaryCategory;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class SalaryCategoryController extends Controller
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

        return Inertia::render('Salary-Category/Index', [
            'organization' => $organization,
            'salaryCategories' => SalaryCategory::filter(request(['search']))
                                                ->whereOrganizationId($organization['id'])
                                                ->paginate(50),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
