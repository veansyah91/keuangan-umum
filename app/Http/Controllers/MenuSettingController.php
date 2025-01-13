<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;

class MenuSettingController extends Controller
{
	public function index(Organization $organization)
	{
		$organizationMenu = Organization::with('menus')->find($organization['id']);
		$pages = Page::all();
		return Inertia::render('MenuSetting/Index', [
			'organization' => $organizationMenu,
			'pages' => $pages
		]);
	}

	public function update(Request $request, Organization $organization)
	{
		return Inertia::render();
	}
}
