<?php

namespace App\Repositories\Journal;

use App\Models\Ledger;
use App\Models\Journal;
use App\Models\Cashflow;

class JournalRepository implements JournalRepositoryInterface
{
    public function store($validated)
    {
        $journal = Journal::create($validated);

        $isCash = false;
        $cashDebit = 0;
        $cashCredit = 0;
        $validated['journal_id'] = $journal['id'];

        // create Ledger
        foreach ($validated['accounts'] as $account) {
            $validated['account_id'] = $account['id'];
            $validated['debit'] = $account['debit'];
            $validated['credit'] = $account['credit'];

            Ledger::create($validated);

            if ($account['is_cash']) {
                $isCash = true;
                if ($account['debit'] > 0) {
                    $cashDebit += $account['debit'];
                }
                if ($account['credit'] > 0) {
                    $cashCredit += $account['credit'];
                }
            }
        }
        
        // create cashflow
        if ($isCash) {
            foreach ($validated['accounts'] as $account) {
                if (!$account['is_cash']) {
                    $validated['account_id'] = $account['id'];
                    $validated['debit'] = $account['credit'];
                    $validated['credit'] = $account['debit'];
                    
                    $validated['category'] = 'operating';

                    $firstChar = substr($account['code'], 0, 2);
                    if ((int)$firstChar > 26 && (int)$firstChar < 40) {
                        $validated['category'] = 'financing';
                    }

                    if ((int)$firstChar > 15 && (int)$firstChar < 20) {
                        $validated['category'] = 'investing';
                    }

                    Cashflow::create($validated);
                }
            }
        }
        return $journal;
    }

    public function update($validated, $journal): void 
    {
        // update journal
        $journal->update($validated);

        // delete ledger
        $ledgers = Ledger::whereJournalId($journal['id'])->get();
        foreach ($ledgers as $ledger) {
            $ledger->delete();
        }

        // delete cashflow
        $cashflows = Cashflow::whereJournalId($journal['id'])->get();
        foreach ($cashflows as $cashflow) {
            $cashflow->delete();
        }
        
        $validated['journal_id'] = $journal['id'];
        $isCash = false;
        $cashDebit = 0;
        $cashCredit = 0;

        // create Ledger
        foreach ($validated['accounts'] as $account) {
            $validated['account_id'] = $account['id'];
            $validated['debit'] = $account['debit'];
            $validated['credit'] = $account['credit'];

            Ledger::create($validated);

            if ($account['is_cash']) {
                $isCash = true;
                if ($account['debit'] > 0) {
                    $cashDebit += $account['debit'];
                }
                if ($account['credit'] > 0) {
                    $cashCredit += $account['credit'];
                }
            }
        }
        
        // create cashflow
        if ($isCash) {
            foreach ($validated['accounts'] as $account) {
                if (!$account['is_cash']) {
                    $validated['account_id'] = $account['id'];
                    $validated['debit'] = $account['credit'];
                    $validated['credit'] = $account['debit'];
                    
                    $validated['category'] = 'operating';

                    $firstChar = substr($account['code'], 0, 2);
                    if ((int)$firstChar > 26 && (int)$firstChar < 40) {
                        $validated['category'] = 'financing';
                    }

                    if ((int)$firstChar > 15 && (int)$firstChar < 20) {
                        $validated['category'] = 'investing';
                    }

                    Cashflow::create($validated);
                }
            }
        }
    }

}