<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;

class DataLedgerController extends Controller
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

        $menus = DB::table('menus')
                    ->join('organization_menu', 'organization_menu.menu_id', '=', 'menus.id')
                    ->select('menus.id as menu_id', 'menus.name as menu_name', 'menus.page as menu_page', 'organization_menu.organization_id as organization_id', 'organization_menu.is_active as is_active')
                    ->where('organization_id', $organization['id'])
                    ->where('is_active', true)
                    ->where('menus.page', 'BUKU BESAR')
                    ->get();

        return Inertia::render('DataLedger/Index', [
            'organization' => $organization,
            'menus' => $menus,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]);
    }
}
