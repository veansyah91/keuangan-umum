import formatNumber from '@/Utils/formatNumber';
import React from 'react';

export default function CashflowContent({ title, cashflows, type, amount, showCode }) {
    return (
        <div className='mt-3'>
            <div className='uppercase font-bold w-full text-lg'>{title}</div>
            <div className='w-full uppercase font-bold'>Kas Masuk</div>
            {cashflows.map(
                (cashflow, index) =>
                    cashflow.category == type &&
                    parseInt(cashflow.total) > 0 && (
                        <div className='flex w-full justify-between my-2' key={index}>
                            <div className={`w-6/12 print:w-8/12 uppercase flex gap-2 ${showCode ? 'pl-0' : 'pl-2'}`}>
                                <div className={`w-1/3 text-end ${showCode ? 'block' : 'hidden'}`}>{cashflow.code}</div>
                                <div className='w-2/3'>{cashflow.name}</div>
                            </div>
                            <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                                <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                                <div className='w-3/4 print:w-2/4 text-end'>
                                    {formatNumber(parseInt(cashflow.total))}
                                </div>
                            </div>
                        </div>
                    )
            )}
            <div className='flex border-t w-full justify-between py-2 font-bold'>
                <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>Total Kas Masuk</div>
                <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                    <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                    <div className='w-3/4 print:w-2/4 text-end'>{formatNumber(amount.add)}</div>
                </div>
            </div>

            <div className='w-full uppercase font-bold'>Kas Keluar</div>
            {cashflows.map(
                (cashflow, index) =>
                    cashflow.category == type &&
                    parseInt(cashflow.total) < 0 && (
                        <div className='flex w-full justify-between my-2' key={index}>
                            <div className={`w-6/12 print:w-8/12 uppercase flex gap-2 ${showCode ? 'pl-0' : 'pl-2'}`}>
                                <div className={`w-1/3 text-end ${showCode ? 'block' : 'hidden'}`}>{cashflow.code}</div>
                                <div className='w-2/3'>{cashflow.name}</div>
                            </div>
                            <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                                <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                                <div className='w-3/4 print:w-2/4 text-end'>
                                    {formatNumber(parseInt(cashflow.total))}
                                </div>
                            </div>
                        </div>
                    )
            )}
            <div className='flex border-t w-full justify-between py-2 font-bold'>
                <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>Total Kas Keluar</div>
                <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                    <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                    <div className='w-3/4 print:w-2/4 text-end'>{formatNumber(amount.reduce)}</div>
                </div>
            </div>
        </div>
    );
}
