<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\WhatsappPlugin;
use App\Models\WhatsappInvoice;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentMonthlyPayment;
use App\Jobs\WhatsappAddonsInvoiceJob;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class WhatsappBroadcastingInvoiceController extends Controller
{
  protected $userRepository;

	protected $logRepository;

	protected $journalRepository;

	protected $contactRepository;

	protected $accountRepository;

	protected $now;

	public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository, ContactRepository $contactRepository, AccountRepository $accountRepository)
	{
		$this->userRepository = $userRepository;
		$this->logRepository = $logRepository;
		$this->journalRepository = $journalRepository;
		$this->contactRepository = $contactRepository;
		$this->accountRepository = $accountRepository;
		$this->now = CarbonImmutable::now();
	}

	public function expiredDate($status)
	{
		$expiredDate = $this->now;

		if ($status['expired_date']) {
			$tempExpiredDate = new Carbon($status['expired_date']);

			if ($tempExpiredDate > $expiredDate) {
				$expiredDate = $tempExpiredDate;
			}
		}

		return [
			'bulanan' => $expiredDate->addMonth(),
			'tahunan' => $expiredDate->addYear(),
		];
	}

	protected function newRef($organization, $dateRequest = '')
	{
		$now = $this->now;
		$date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
		$dateRef = Carbon::create($date);
		$refHeader = 'WI-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
		$newRef = $refHeader.'0001';

		$payment = WhatsappInvoice::whereOrganizationId($organization['id'])
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('WI-', $payment['no_ref']);
		}

		return $newRef;
	}
  
	public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('Addons/Whatsapp/Invoice/Index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'invoices' => WhatsappInvoice::whereOrganizationId($organization['id'])
																->orderBy('created_at', 'desc')
																->orderBy('no_ref', 'desc')
																->paginate(50)->withQueryString()
		]);
	}

	public function create(Organization $organization)
	{
		$user = Auth::user();

		$status = WhatsappPlugin::where('organization_id', $organization['id'])
															->first();

		return Inertia::render('Addons/Whatsapp/Invoice/Create', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'expiredDate' => $this->expiredDate($status)
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$validated = $request->validate([
			'product' => [
                'required',
                Rule::in(['Tahunan', 'Bulanan']),
			],
		]);
		$validated['no_ref'] = $this->newRef($organization);
		$validated['description'] = 'Perpanjangan Layanan WhatsApp Broadcasting Plugin';
		$validated['status'] = 'pending';
		$validated['price'] = $validated['product'] == 'Tahunan' ? 1000000 : 100000;
		$validated['organization_id'] = $organization['id'];

		$status = WhatsappPlugin::where('organization_id', $organization['id'])
															->first();

		$invoice = WhatsappInvoice::create($validated);

		$tempDate = new Carbon($invoice['created_at']);

		$message = "*INVOICE PENAMBAHAN LAYANAN WHATSAPP BROADCASTING*\n-------------------------------------------------------\nTanggal: ". $tempDate ."\nNo. Ref: " . $validated['no_ref'] .
		"\nProduk: " . $validated['product'] .
		"\nHarga: IDR. " .  number_format($validated['price'], 0, '', '.') .
		"\n-------------------------------------------------------\nSilakan melakukan pembayaran ke Rekening Berikut:\nNo. Rekening: " . env('BANK_ACCOUNT') . 
		"\nNama Rekening: " . env('BANK_NAME') . 
		"\nNama Bank: " . env('BANK') .
		"\n-------------------------------------------------------\nSilakan kirim bukti transfer ke nomor ini jika telah melakukan pembayaran.\n\nKeuangan Umum\nkeuanganumum.com";

		$data = array(
      'appkey' => env('WHATSAPP_APP_KEY'),
      'authkey' => env('WHATSAPP_AUTH_KEY'),
      'to' => $status['phone'],
      'message' => $message,
      'sandbox' => 'false'
		);

		WhatsappAddonsInvoiceJob::dispatch($data);
		return redirect(route('add-ons.whatsapp-invoice', $organization['id']))->with('success', 'Invoice Penambahan Layanan WhatsApp Broadcasting Berhasil Dibuat');
	}
}
