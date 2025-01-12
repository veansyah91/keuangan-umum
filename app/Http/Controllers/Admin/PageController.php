<?php

namespace App\Http\Controllers\Admin;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PageController extends Controller
{
	public function index(): Response
	{
		return Inertia::render('Admin/Page/Index',[
			'pages' => Page::orderBy('name', 'asc')
											->paginate(50)
											->withQueryString()
		]);
	}
}
