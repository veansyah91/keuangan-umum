<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\FixedAssetCategory;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class FixedAssetCategoryController extends Controller
{
  protected $userRepository;

  public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->now = CarbonImmutable::now();
    }

  public function Index(Organization $organization)
  {
    $user = Auth::user();

    $fixedAssetCategories = FixedAssetCategory::filter(request(['search', 'status']))
                            ->whereOrganizationId($organization['id'])
                            ->paginate(50);
    
    return Inertia::render('FixedAssetCategory/Index', [
        'organization' => $organization,
        'fixedAssetCategories' => $fixedAssetCategories,
        'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        'status' => request('status') == "true" ? true : false,
    ]);
  }
}
