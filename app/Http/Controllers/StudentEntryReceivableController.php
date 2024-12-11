<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\WhatsappLog;
use Carbon\CarbonImmutable;
use App\Helpers\PhoneNumber;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Jobs\SendWhatsAppNotifJob;
use App\Models\StudentEntryPayment;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentEntryReceivable;
use App\Repositories\User\UserRepository;
use App\Jobs\SendYearlyReceivableBillingJob;
use App\Models\StudentEntryReceivableLedger;

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

		$type = request('type') ?? 'unpaid';

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('StudentEntryReceivable/Index', [
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin,
			'type' => $type,
			'receivables' => StudentEntryReceivable::filter(request(['search']))
																	->with('contact', function ($query) {
																			$query->with(['student', 'lastLevel']);
																	})
																	->when($type !== 'all' ?? false, function ($query) use ($type){
																		return $type === 'paid' 
																		? $query->where('value', 0)
																		: $query->where('value', '>', 0);
																	})
																	->whereOrganizationId($organization['id'])
																	->orderBy('value', 'desc')
																	->paginate(50)->withQueryString(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'searchFilter' => request('search'),
		]);
	}

	public function sendWhatsApp(Request $request, Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
		if ($request['send_wa']) {
			$whatsAppLog = WhatsappLog::create([
				'organization_id' => $organization['id'],
				'contact_id' => $request['contact_id'],
				'description' => 'TAGIHAN IURAN TAHUNAN SISWA',
				'status' => 'waiting'
			]);

			$contact = Contact::with(['student', 'lastLevel'])->find($request['contact_id']);
			$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

			$tempDetail = '';
			foreach ($request['details'] as $key => $detail) {
				if ($detail['value'] > 0) {
					$tempDetail .= "\n" . ($key + 1) . ". " . $detail['no_ref'] . ": IDR. " . number_format($detail['value'], 0, '', '.');
				}
			}

			$tempDetail .= "\nTotal: IDR. " . number_format($request['value'], 0, '', '.');

			$tempDate = new Carbon($request['date']);

			$message = "*TAGIHAN IURAN TAHUNAN*\n-------------------------------------------------------\nNama : " . $contact['name'] . "\nNo. Siswa : " . $contact->student->no_ref . "\nTahun Masuk : " . $contact->student->entry_year . "\nKelas Sekarang : " . $contact->lastLevel->level . "\n\nDETAIL:" . $tempDetail . "\n\nTTD,\n\n" . strtoupper($organization['name']);
			$data = array(
				'appkey' => $whatsappPlugin['appKey'],
				'authkey' => $whatsappPlugin['authkey'],
				'to' => PhoneNumber::setFormat($contact['phone']),
				'message' => $message,
				'sandbox' => 'false'
			);

			SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp');
		}
		return redirect()->back()->with('success', 'Rincian Pembayaran Iuran Tahunan telah diteruskan Via Whatsapp');
	}

	public function sendWhatsappMulti(Organization $organization)
	{
		SendYearlyReceivableBillingJob::dispatch($organization);
		return redirect()->back()->with('success', 'Penagihan Tunggakan Iuran Tahunan telah diteruskan Via Whatsapp');
	}

	public function show(Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
		$user = Auth::user();
		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('StudentEntryReceivable/Show', [
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
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

	public function showPerPayment(Organization $organization, StudentEntryReceivable $studentEntryReceivable)
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

	public function print(Organization $organization, StudentEntryReceivable $studentEntryReceivable)
	{
		$user = Auth::user();
		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('StudentEntryReceivable/Print', [
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
			'receivable' => $studentEntryReceivable,
			'receivables' => StudentEntryPayment::whereOrganizationId($organization['id'])
										->where('contact_id', $studentEntryReceivable['contact_id'])
										->where('receivable_value', '>', 0)
										->with('receivables', function ($query) {
											return $query->where('credit', '>', 0);
										})
										->orderBy('study_year', 'desc')
										->orderBy('date', 'desc')
										->orderBy('no_ref', 'desc')
										->get(),
			'user' => $user,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'contact' => Contact::with(['student', 'lastLevel'])->find($studentEntryReceivable['contact_id']),
		]);
	}

	public function printPerPayment(Organization $organization, StudentEntryPayment $payment)
	{
		$user = Auth::user();

		return Inertia::render('StudentEntryReceivable/PrintPerPayment', [
			'organization' => $organization,
			'payment' => $payment,
			'ledgers' => StudentEntryReceivableLedger::where('payment_id', $payment['id'])->where('credit','>',0)->get(),
			'user' => $user,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'contact' => Contact::with(['student', 'lastLevel', 'studentEntryReceivable'])->find($payment['contact_id']),
		]);
	}
}
