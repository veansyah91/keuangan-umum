import React from 'react';
import formatNumber from '@/Utils/formatNumber';

export default function TrialBalance({ ledger, isTotal = false }) {
    const tempValue = parseInt(ledger.tempDebit ?? 0) - parseInt(ledger.tempCredit ?? 0);
    const endValue = parseInt(ledger.endDebit ?? 0) - parseInt(ledger.endCredit ?? 0);
    const startValue = endValue - tempValue;

    return isTotal ? (
        <tr className={'text-slate-900 font-bold border-t-2 border-slate-900'}>
            <th colSpan={2}>Total</th>
            <td className='text-end'>{formatNumber(parseInt(ledger.startDebit))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.startCredit))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.tempDebit ?? 0))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.tempCredit ?? 0))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.endDebit ?? 0))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.endCredit ?? 0))}</td>
        </tr>
    ) : (
        <tr>
            <td>{ledger.code}</td>
            <td>{ledger.name}</td>
            <td className='text-end'>{startValue > 0 ? formatNumber(Math.abs(startValue)) : 0}</td>
            <td className='text-end'>{startValue > 0 ? 0 : formatNumber(Math.abs(startValue))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.tempDebit ?? 0))}</td>
            <td className='text-end'>{formatNumber(parseInt(ledger.tempCredit ?? 0))}</td>
            <td className='text-end'>{endValue > 0 ? formatNumber(Math.abs(endValue)) : 0}</td>
            <td className='text-end'>{endValue > 0 ? 0 : formatNumber(Math.abs(endValue))}</td>
        </tr>
    );
}
