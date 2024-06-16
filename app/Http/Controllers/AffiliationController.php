<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Helpers\NewRef;
use App\Models\Affiliation;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use App\Models\AffiliationWithdraw;
use Illuminate\Support\Facades\Auth;

class AffiliationController extends Controller
{
	protected $now;

	public function __construct(){
        $this->now = CarbonImmutable::now();
	}

	protected function newRef()
    {
        $refHeader = 'AW-'.$this->now->isoFormat('YYYY').$this->now->isoFormat('MM');
        $newRef = $refHeader.'001';

        $withdraw = AffiliationWithdraw::where('no_ref', 'like', $refHeader.'%')
            ->orderBy('no_ref')
            ->get()
            ->last();

        if ($withdraw) {
            $newRef = NewRef::create('AW-', $withdraw['no_ref']);
        }

        return $newRef;
    }

	public function index(Affiliation $affiliation)
	{
		$user = Auth::user();

		if ($user['id'] !== $affiliation['user_id'] ) { 
			return redirect(route('organization'))->with(['error' => 'Anda tidak memiliki hak akses']);
		}

		$affiliationWithdraws = AffiliationWithdraw::whereUserId($user['id'])->get();

		return Inertia::render('Affiliation/Affiliation', [
			'user' => $user,
			'affiliation' => $affiliation,
			'affiliationWithdraws' => $affiliationWithdraws,
		]);
	}

	public function withdraw(Request $request, Affiliation $affiliation)
	{
        $user = Auth::user();

		$validated = $request->validate([
			'value' => "required|min:10000|numeric",
			'bank_account' => "required|string",
			'bank_name' => "required|string",
		]);

		// additional validation
		if ($validated['value'] > $affiliation['balance']) {
			return redirect()->back()->withErrors(['value' => 'Saldo Tidak Cukup']);
		}
		// jika telah dibuat pengajuan namun masih menunggu
		$affiliationWithdraw = AffiliationWithdraw::whereUserId($user['id'])->whereStatus(false)->first();

		if ($affiliationWithdraw) {
			return redirect()->back()->withErrors(['status' => 'Silakan Tunggu Pengajuan Sebelumnya Diselesaikan']);
		}

		$affiliation->update([
			'bank_account' => $validated['bank_account'],
			'bank_name' => $validated['bank_name'],
		]);


		$validated['user_id'] = $user['id'];
		$validated['no_ref'] = $this->newRef();
		$validated['status'] = false;
	
		AffiliationWithdraw::create($validated);

		return redirect()->back()->with('success', 'Pengajuan Penarikan Saldo Sudah Dilakukan, Silakan Tunggu 3x24 jam');

	}

	public function detail(AffiliationWithdraw $affiliationWithdraw)
	{
		$user = Auth::user();

		$affiliation = Affiliation::whereUserId($user['id'])->first();

		return Inertia::render('Affiliation/Detail', [
			'affiliationWithdraw' => $affiliationWithdraw,
			'affiliation' => $affiliation,
			'appName' => env('APP_NAME'),
            'whatsappContact' => env('WHATSAPP_CONTACT'),
		]);
	}
}
