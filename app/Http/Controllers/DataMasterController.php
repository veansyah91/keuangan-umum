<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Page;
use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class DataMasterController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Organization $organization)
    {
        $user = Auth::user();

        $menus = Menu::where('page', "DATA MASTER")->get();

        // $organization

        return Inertia::render('DataMaster/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
