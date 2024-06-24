import React, { useEffect, useState } from 'react';
import LedgerContent from './LedgerContent';
import formatNumber from '@/Utils/formatNumber';

let value = 0;

const createNewledgers = (ledgers, startedValue) => {
    let newLedgers = [];
    value = startedValue;

    ledgers.map((ledger, index) => {
        value += ledger.debit - ledger.credit;
        newLedgers[index] = {
            ...ledger,
            total: value,
        };
    });

    return newLedgers;
};

export default function LedgersContent({ account }) {
    return (
        <div className='mt-4'>
            <div>
                {account.code} - {account.name}
            </div>
            {
                <table className='table uppercase table-zebra table-xs'>
                    <thead>
                        <tr className='text-slate-900 font-bold border-b-2 border-slate-900'>
                            <th className='w-1/12'>tanggal</th>
                            <th className='w-2/12'>ref</th>
                            <th className='w-2/12'>Dekripsi</th>
                            <th className='text-end w-2/12'>debit</th>
                            <th className='text-end w-2/12'>kredit</th>
                            <th className='text-end w-2/12'>total</th>
                            <th className='w-1/12'>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='font-bold'>
                            <td colSpan={5}>Nilai Awal</td>
                            <td className='text-end'>IDR. {formatNumber(account.startedValue)}</td>
                        </tr>
                        {createNewledgers(account.ledgers, account.startedValue).map((ledger, index) => (
                            <LedgerContent ledger={ledger} key={index} />
                        ))}
                        <tr className='font-bold'>
                            <td colSpan={5}>Nilai Akhir</td>
                            <td className='text-end'>IDR. {formatNumber(value)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            }
        </div>
    );
}
