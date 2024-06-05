<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Organization;
use App\Repositories\User\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LogController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Organization $organization): Response
    {
        $user = Auth::user();

        $logs = Log::filter(request(['search', 'start_date', 'end_date']))
            ->whereOrganizationId($organization['id'])
            ->orderBy('id', 'desc')
            ->paginate(50);

        return Inertia::render('Log/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'logs' => $logs,
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'searchFilter' => request('search'),
        ]);
    }
}
