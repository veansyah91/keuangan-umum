<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Journal;
use App\Models\WhatsappLog;
use Carbon\CarbonImmutable;
use App\Helpers\PhoneNumber;
use App\Models\Organization;
use App\Models\SavingLedger;
use Illuminate\Http\Request;
use App\Models\SavingBalance;
use App\Models\SavingCategory;
use App\Models\WhatsappPlugin;
use Illuminate\Validation\Rule;
use App\Jobs\SendWhatsAppNotifJob;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Riskihajar\Terbilang\Facades\Terbilang;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;

class SavingLedgerController extends Controller
{
	protected $logRepository, $userRepository, $contactRepository, $journalRepository, $accountRepository;

	public function __construct(UserRepository $userRepository, ContactRepository $contactRepository, JournalRepository $journalRepository, AccountRepository $accountRepository, LogRepository $logRepository)
	{
		$this->userRepository = $userRepository;
		$this->contactRepository = $contactRepository;
		$this->journalRepository = $journalRepository;
		$this->accountRepository = $accountRepository;
		$this->logRepository = $logRepository;
		$this->now = CarbonImmutable::now();
	}

	protected function newRef($organization, $dateRequest = '', $type)
	{
			$now = $this->now;
			$date = $dateRequest ?? $now->isoFormat('YYYY-M-DD');
			$dateRef = Carbon::create($date);
			$prefix = $type == 'debit' ? 'SD-' : 'SC-';
			$refHeader = $prefix.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
			$newRef = $refHeader.'0001';

			$cashMutation = SavingLedger::whereOrganizationId($organization['id'])
					->where('no_ref', 'like', $refHeader.'%')
					->orderBy('no_ref','desc')
					->first();

			if ($cashMutation) {
					$newRef = NewRef::create($prefix, $cashMutation['no_ref']);
			}

			return $newRef;
	}

  public function index(Organization $organization)
	{
		$user = Auth::user();
		$contact = request('contact') ?? '';

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		return Inertia::render('SavingLedger/Index', [
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
			'date' => request('date') ?? $this->now->isoFormat('YYYY-M-DD'),
			'ledgers' => SavingLedger::filter(request(['search']))
																	->whereOrganizationId($organization['id'])
																	->with('cashAccount')
																	->with('savingBalance', function ($query){
																		return $query->with('contact', function ($query){
																			return $query->with('contactCategories');
																		});
																	})
																	->orderBy('date', 'desc')
																	->orderBy('no_ref', 'desc')
																	->paginate(50)->withQueryString(),
			'balances' => SavingBalance::whereOrganizationId($organization['id'])
																		->where(function ($query) use ($contact){
																			return $query->where('no_ref', 'like', '%' . $contact . '%')
																										->orWhereHas('contact', function ($query) use ($contact){
																											return $query->where('name', 'like', '%' . $contact . '%');
																										});
																		})
																		->with('contact', function ($query){
																			return $query->with(['student', 'contactCategories']);
																		})
																		->with('savingCategory')
																		->take(20)->get(),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'newRefCredit' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD'), "credit"),
			'newRefDebit' => $this->newRef($organization, $this->now->isoFormat('YYYY-M-DD'), "debit"),
			'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$user = Auth::user();

		$validated = $request->validate([
			'date' => [
				'required',
				'date',
			],
			'type' => [
				'required',
				'string'
			],
			'description' => [
				'required',
				'string',
			],
			'no_ref' => [
				'required',
				'string',
				Rule::unique('saving_ledgers')->where(function ($query) use ($organization) {
					return $query->where('organization_id', $organization['id']);
				}),
			],
			'balance_value' => [
				'required',
				'numeric',
				'min:0'
			],
			'value' => [
				'required',
				'numeric',
				'min:0'
			],
			'balance_id' => [
				'required',
				'exists:saving_balances,id',
			],
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			],
			'send_wa' => [
				'boolean',
				'required'
			],
		]);

		// cek tanggal
		// jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
		if ($validated['date'] > $this->now->isoFormat('YYYY-M-DD')) {
			return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
		}

		if ($validated['type'] !== 'credit' && $validated['value'] > $validated['balance_value']) {
			return redirect()->back()->withErrors(['value' => 'Value is Unexpected!']);
		}

		// contact
		$savingBalance = SavingBalance::with(['contact', 'savingCategory'])->find($validated['balance_id']);

		// saving account
		$savingCategory = SavingCategory::find($savingBalance['saving_category_id']);
		$cash_saving = Account::find($savingCategory['account_id']);

		// cash account
		$cash_account = Account::find($validated['cash_account_id']);

		$validated['saving_balance_id'] = $validated['balance_id'];
		$validated['debit'] = $validated['type'] == 'debit' ? $validated['value'] : 0;
		$validated['credit'] = $validated['type'] == 'credit' ? $validated['value'] : 0;
		$validated['contact_id'] = $savingBalance['contact_id'];
		$validated['user_id'] = $user['id'];	
		$validated['organization_id'] = $organization['id'];	
		$validated['accounts'] = [
			// akun cash (pendapatan)
			[
				'id' => $cash_account['id'],
				'name' => $cash_account['name'],
				'code' => $cash_account['code'],
				'is_cash' => 1,
				'debit' => $validated['type'] == 'credit' ? $validated['value'] : 0,
				'credit' => $validated['type'] == 'debit' ? $validated['value'] : 0,
			],
			// akun saving (simpanan)
			[
				'id' => $cash_saving['id'],
				'name' => $cash_saving['name'],
				'code' => $cash_saving['code'],
				'is_cash' => 0,
				'debit' => $validated['type'] == 'debit' ? $validated['value'] : 0,
				'credit' => $validated['type'] == 'credit' ? $validated['value'] : 0,
			],
		];	
		
		$prefix = $validated['type'] == 'debit' ? 'PENARIKAN' : 'PENAMBAHAN';

		DB::transaction(function() use ($validated, $user, $savingBalance, $prefix, $organization, $request){
			// journal
			$journal = $this->journalRepository->store($validated);
			$validated['journal_id'] = $journal['id'];

			// saving ledger
			$ledger = SavingLedger::create($validated);

			// update Saving Ledger
			$newValue = $savingBalance['value'] + ($validated['value'] * ($validated['type'] == 'credit' ? 1 : -1));
			$savingBalance->update([
				'value' => $newValue
			]);

			// log
			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];

			$desc = strtoupper($user['name']).' telah menambahkan DATA pada ' . $prefix . 'TABUNGAN dengan DATA : '.json_encode($log);

			// send wa
			if ($validated['send_wa']) {
				$request['contact_id'] = $savingBalance['contact_id'];
				$request['contact_ref'] = $savingBalance['no_ref'];
				$request['contact_name'] = $savingBalance['contact']['name'];
				$request['contact_phone'] = $savingBalance['contact']['phone'];
				$request['contact_value'] = $newValue;
				$request['contact_type'] = $savingBalance['savingCategory']['name'];

				$this->sendWhatsapp($request, $organization, $ledger);
			}

			$this->logRepository->store($organization['id'], $desc);
		});
		
		return redirect()->back()->with('success', 'Berhasil melakukan ' . $prefix . ' TABUNGAN');
	}

	public function update(Request $request, Organization $organization, SavingLedger $ledger)
	{
		$user = Auth::user();

		$validated = $request->validate([
			'date' => [
				'required',
				'date',
			],
			'type' => [
				'required',
				'string'
			],
			'description' => [
				'required',
				'string',
			],
			'no_ref' => [
				'required',
				'string',
				Rule::unique('saving_ledgers')->where(function ($query) use ($organization) {
					return $query->where('organization_id', $organization['id']);
				})->ignore($ledger['id']),
			],
			'balance_value' => [
				'required',
				'numeric',
				'min:0'
			],
			'value' => [
				'required',
				'numeric',
				'min:0'
			],
			'balance_id' => [
				'required',
				'exists:saving_balances,id',
			],
			'cash_account_id' => [
				'required',
				'exists:accounts,id'
			]
		]);

		// cek tanggal
		// jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error
		if ($validated['date'] > $this->now->isoFormat('YYYY-M-DD')) {
			return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
		}

		// cek apakah data yang dihapus adalah data terakhir, jika tidak berikan error
		$lastLedger = SavingLedger::where('saving_balance_id', $ledger['saving_balance_id'])
																->orderBy('created_at', 'desc')
																->first();
		if ($lastLedger['id'] !== $ledger['id']) {
			return redirect()->back()->withErrors(['error' => "Data can't be deleted"]);
		}

		// contact
		$savingBalance = SavingBalance::find($validated['balance_id']);

		// saving account
		$savingCategory = SavingCategory::find($savingBalance['saving_category_id']);
		$cash_saving = Account::find($savingCategory['account_id']);

		// cash account
		$cash_account = Account::find($validated['cash_account_id']);

		$validated['organization_id'] = $organization['id'];	
		$validated['accounts'] = [
			// akun cash (pendapatan)
			[
				'id' => $cash_account['id'],
				'name' => $cash_account['name'],
				'code' => $cash_account['code'],
				'is_cash' => 1,
				'debit' => $validated['type'] == 'credit' ? $validated['value'] : 0,
				'credit' => $validated['type'] == 'debit' ? $validated['value'] : 0,
			],
			// akun saving (simpanan)
			[
				'id' => $cash_saving['id'],
				'name' => $cash_saving['name'],
				'code' => $cash_saving['code'],
				'is_cash' => 0,
				'debit' => $validated['type'] == 'debit' ? $validated['value'] : 0,
				'credit' => $validated['type'] == 'credit' ? $validated['value'] : 0,
			],
		];	
		$validated['debit'] = $validated['type'] == 'debit' ? $validated['value'] : 0;
		$validated['credit'] = $validated['type'] == 'credit' ? $validated['value'] : 0;

		$prefix = $validated['type'] == 'debit' ? 'PENARIKAN' : 'PENAMBAHAN';

		DB::transaction(function () use ($organization, $validated, $ledger, $user, $savingBalance, $prefix){
			// perbarui saldo
			// kembalikan saldo ke awal
			$start_balance = $savingBalance['value'] + ($ledger['debit'] > 0 ? $ledger['debit'] : ($ledger['credit'] * -1));

			$last_balance = $start_balance + ($validated['value'] * ($validated['type'] == 'credit' ? 1 : -1));

			$savingBalance->update([
				'value' => $last_balance
			]);

			// perbarui ledger
			$ledger->update($validated);

			// journal
			$this->journalRepository->update($validated, $ledger->journal);

			// log
			$log = [
				'description' => $validated['description'],
				'date' => $validated['date'],
				'no_ref' => $validated['no_ref'],
				'value' => $validated['value'],
			];

			$desc = strtoupper($user['name']).' telah mengubah DATA pada ' . $prefix . 'TABUNGAN dengan DATA : '.json_encode($log);

			$this->logRepository->store($organization['id'], $desc);
		});
		return redirect()->back()->with('success', 'Berhasil mengubah ' . $prefix . ' TABUNGAN');

	}

	public function destroy(Organization $organization, SavingLedger $ledger)
	{
		// cek apakah data yang dihapus adalah data terakhir, jika tidak berikan error
		$lastLedger = SavingLedger::where('saving_balance_id', $ledger['saving_balance_id'])
																->orderBy('created_at', 'desc')
																->first();
		if ($lastLedger['id'] !== $ledger['id']) {
			return redirect()->back()->withErrors(['error' => "Data can't be deleted"]);
		}

		// cek saldo
		$savingBalance = SavingBalance::find($ledger['saving_balance_id']);

		$update_saving_balance_value = $savingBalance['value'] + ($ledger['debit'] > 0 ? $ledger['debit'] : ($ledger['credit'] * -1));

		DB::transaction(function() use ($organization, $ledger, $update_saving_balance_value, $savingBalance){
			// perbarui Value pada Saving Balance
			$savingBalance->update([
				'value' => $update_saving_balance_value
			]);

			$ledger->delete();

			// hapus journal
			$journal = Journal::find($ledger['journal_id']);
			$journal->delete();
		});

		$message = 'Berhasil Menghapus Data ' . ($ledger['debit'] > 0 ? 'Penarikan' : 'Penambahan') . ' Tabungan';
		return redirect()->back()->with('success', $message);
	}

	public function show(Organization $organization, SavingLedger $ledger)
	{
		$user = Auth::user();

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->whereIsActive(true)->whereConnection(true)->first();

		return Inertia::render('SavingLedger/Show', [
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'organization' => $organization,
			'whatsappPlugin' => $whatsappPlugin ? true : false,
			'ledger' => $ledger,
			'user' => $user,
			'balance' => SavingBalance::whereId($ledger['saving_balance_id'])
																	->with('savingCategory')
																	->with('contact', function($query) {
																		return $query->with('contactCategories');
																	})->first(),
			'terbilang' => Terbilang::make($ledger['debit'] > 0 ? $ledger['debit'] : $ledger['credit'])
		]);
	}

	public function sendWhatsapp(Request $request, Organization $organization, SavingLedger $ledger)
	{
		$description = ($ledger['debit'] > 0 ? "PENARIKAN TABUNGAN " : "SETORAN TABUNGAN ");
		$value = $ledger['debit'] > 0 ? number_format($ledger['debit'], 0, '', '.') : number_format($ledger['credit'], 0, '', '.');

		$whatsAppLog = WhatsappLog::create([
			'organization_id' => $organization['id'],
			'contact_id' => $request['contact_id'],
			'description' => $description . "oleh " . $request['contact_ref'] . " a.n " . $request['contact_name'],
			'status' => 'waiting'
		]);

		$tempDate = new Carbon($ledger['date']);
		
		$message = "BUKTI " . $description . "\n-------------------------------------------------------" . 
		"\n*Jenis Simpanan*: " . $request['contact_type'] . 
		"\n*ID Simpanan*: " . $request['contact_ref'] . 
		"\n*Nama*: " . $request['contact_name'] . 
		"\n*Saldo Akhir*: IDR. " . number_format($request['contact_value'], 0, '', '.') . 
		"\n-------------------------------------------------------" . 
		"\n*No Ref Transaksi*: " . $ledger['no_ref'] . 
		"\n*Tanggal*: " . $tempDate->isoFormat('D MMMM YYYY') . 
		"\n*Total*: IDR. " . $value . " _(" . Terbilang::make($ledger['debit'] > 0 ? $ledger['debit'] : $ledger['credit']) . ' rupiah)_'.
		"\n\n\nTtd, \n\n\n" . $organization['name'];

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $organization['id'])->first();

		$data = array(
			'appkey' => $whatsappPlugin['appKey'],
			'authkey' => $whatsappPlugin['authkey'],
			'target' => PhoneNumber::setFormat($request['contact_phone']),
			'message' => $message,
			'sandbox' => 'false'
		);

		SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp');
		return redirect()->back()->with('success', 'Bukti ' . $description . 'telah diteruskan Via Whatsapp');
	}
}
