<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Auth;

class MenuSettingController extends Controller
{
	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
	}
	
	public function index(Organization $organization): Response
	{
		$user = Auth::user();

		$organizationMenu = Organization::with('menus')->find($organization['id']);
		$pages = Page::all();
		return Inertia::render('MenuSetting/Index', [
			'organization' => $organizationMenu,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'pages' => $pages
		]);
	}

	public function update(Request $request, Organization $organization)
	{
		$validated = $request->validate([
			'menu' => [
					'required', 'array'
			],
		]);

		foreach ($validated['menu'] as $menu) {
			foreach ($menu['details'] as $detail) {
				$selectedmenu = DB::table('organization_menu')
					->where('organization_id', $organization['id'])
					->where('menu_id', $detail['menuId'])
					->update([
						'is_active' => $detail['isActive']
					]);
			}			
		};

		return redirect()->back()->with('success', 'Pengaturan Menu Berhasil Diubah');
	}
}
