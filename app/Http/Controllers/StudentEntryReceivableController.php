<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Contact;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\StudentEntryPayment;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentEntryReceivable;
use App\Repositories\User\UserRepository;

class StudentEntryReceivableController extends Controller
{
  protected $userRepository;

	protected $logRepository;

	protected $journalRepository;

	protected $contactRepository;

	protected $accountRepository;

	protected $now;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
		
		$this->now = CarbonImmutable::now();
	}
	/**
	 * Display a listing of the resource.
	 */
	public function index(Organization $organization)
	{
		$user = Auth::user();
		$search = request(['search']);

		return Inertia::render('StudentEntryReceivable/Index', [
			'organization' => $organization,
			'receivables' => StudentEntryReceivable::filter(request(['search']))
																	->with('contact', function ($query) {
																			$query->with(['student', 'lastLevel']);
																	})
																	->whereOrganizationId($organization['id'])
																	->orderBy('value', 'desc')
																	->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'searchFilter' => $search,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create(Organization $organization)
	{
			//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request, Organization $organization)
	{
			//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
		$user = Auth::user();

		return Inertia::render('StudentEntryReceivable/Show', [
			'organization' => $organization,
			'receivable' => $studentEntryReceivable,
			'receivables' => StudentEntryPayment::whereOrganizationId($organization['id'])
										->where('contact_id', $studentEntryReceivable['contact_id'])
										// ->where('credit', '>', 0)
										->with('contact', function ($query) {
												return $query->with('student');
										})
										->with('receivables', function ($query) {
											return $query->where('credit', '>', 0);
										})
										->orderBy('study_year', 'desc')
										->orderBy('date', 'desc')
										->orderBy('no_ref', 'desc')
										->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'contact' => Contact::with(['student', 'lastLevel'])->find($studentEntryReceivable['contact_id']),
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
			//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
		
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
		
	}
}
