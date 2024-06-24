import formatNumber from '@/Utils/formatNumber';
import React from 'react';

export default function LedgerContent({ ledger }) {
    return (
        <tr>
            <td>{ledger.date}</td>
            <td>{ledger.no_ref}</td>
            <td>{ledger.description ?? ledger.journal?.description}</td>
            <td className='text-end'>IDR. {formatNumber(ledger.debit)}</td>
            <td className='text-end'>IDR. {formatNumber(ledger.credit)}</td>
            <td className='text-end'>IDR. {formatNumber(ledger.total)}</td>
            <td className='space-y-1'>
                {ledger.department_id && (
                    <div>
                        <div>Departemen:</div>
                        <div>{ledger.department.code}</div>
                    </div>
                )}
                {ledger.project_id && (
                    <div>
                        <div>Proyek:</div>
                        <div>{ledger.project.code}</div>
                    </div>
                )}
                {ledger.program_id && (
                    <div>
                        <div>Program:</div>
                        <div>{ledger.program.code}</div>
                    </div>
                )}
            </td>
        </tr>
    );
}
