import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import React from 'react';

export default function JournalContent({ journal }) {
    return (
        <>
            <tr className='font-bold text-xs'>
                <td>{dayjs(journal.date).format('MMMM DD, YYYY')}</td>
                <td>{journal.description}</td>
                <td></td>
                <td></td>
                <td>
                    {journal.department && <div>Departemen: {journal.department.code}</div>}
                    {journal.project && <div>Proyek: {journal.project.code}</div>}
                    {journal.program && <div>Program: {journal.program.code}</div>}
                </td>
                {/* <td>{journal.department?.code}</td>
        <td>{journal.project?.code}</td>
        <td>{journal.program?.code}</td> */}
            </tr>
            {journal.ledgers.map((ledger, index) => (
                <tr className='text-xs' key={index}>
                    <td>{ledger.no_ref}</td>
                    <td>
                        {ledger.account.code} - {ledger.account.name}
                    </td>
                    <td className='text-end'>
                        {parseInt(ledger.debit) > 0 ? `IDR. ${formatNumber(parseInt(ledger.debit))}` : '-'}
                    </td>
                    <td className='text-end'>
                        {parseInt(ledger.credit) > 0 ? `IDR. ${formatNumber(parseInt(ledger.credit))}` : '-'}
                    </td>
                    <td></td>
                </tr>
            ))}
            <tr>
                <td colSpan={5} className='text-xs text-inherit py-4'></td>
            </tr>
        </>
    );
}
