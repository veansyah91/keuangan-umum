<?php

namespace App\Http\Controllers\Admin;

use App\Models\Menu;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MenuController extends Controller
{
	/**
	 * Handle the incoming request.
	 */
	public function __invoke(Request $request): Response
	{
		return Inertia::render('Admin/Menu/Index',[
			'menus' => Menu::orderBy('page', 'asc')
											->paginate(50)
											->withQueryString()
		]);
	}
}
