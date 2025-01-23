<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SavingCategory;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class SavingCategoryController extends Controller
{
	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
			$this->userRepository = $userRepository;
	}
	
	public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('SavingCategory/Index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => SavingCategory::filter(request(['search']))
                                                ->whereOrganizationId($organization['id'])
                                                ->paginate(50)->withQueryString(),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$validator = Validator::make($request->all(), [
			'name' => [
					'required',
					'string',
					Rule::unique('saving_categories')->where(function ($query) use ($organization) {
							return $query->where('organization_id', $organization['id']);
					}),
			],
			
		]);

		if ($validator->fails()) {
				// Handle validation failure
				return redirect()->back()->withErrors($validator)->withInput();
		}

		$validated = $validator->validated();
		$validated['organization_id'] = $organization['id'];

    SavingCategory::create($validated);

		return redirect()->back()->with('success', 'Kategori Tabungan Berhasil Ditambahkan');

	}
}
