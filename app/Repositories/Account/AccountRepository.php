<?php

namespace App\Repositories\Account;

use App\Models\Ledger;
use App\Models\Account;

class AccountRepository implements AccountRepositoryInterface
{
    public function getData($organizationId, $request)
    {
        return Account::filter($request)
                ->whereIsActive(true)
                ->whereOrganizationId($organizationId)
                ->select('id', 'name', 'code', 'is_cash')
                ->orderBy('code')
                ->get();
    }

    public function getDataNonCash($organizationId, $request)
    {
        return Account::filter($request)
                        ->whereIsActive(true)
                        ->where('is_cash', false)
                        ->whereOrganizationId($organizationId)
                        ->select('id', 'name', 'code', 'is_cash')
                        ->orderBy('code')
                        ->get();
    }

    public function getDataCash($organizationId, $request)
    {
        return Account::filter($request)
                        ->whereIsActive(true)
                        ->where('is_cash', true)
                        ->whereOrganizationId($organizationId)
                        ->select('id', 'name', 'code', 'is_cash')
                        ->orderBy('code')
                        ->get();
    }

    public function deleteData($id)
    {
        $account = Account::find($id);

        // cek di buku besar, apakah akun pernah digunakan
        $ledger = Ledger::whereAccountId($account['id'])
                            ->first();

        if ($ledger) {
            return false;
        }

        $account->delete();

        return true;
    }
}
