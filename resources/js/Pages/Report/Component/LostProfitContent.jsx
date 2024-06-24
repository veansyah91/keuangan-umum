import formatNumber from '@/Utils/formatNumber';
import React, { useEffect, useState } from 'react';

export default function LostProfitContent({ title, ledgers, showCode, type, amount }) {
    const [range, setRange] = useState({
        start: '',
        end: '',
    });

    // useEffect
    useEffect(() => {
        defineRange(type);
    }, []);

    // function
    const defineRange = (type) => {
        switch (type) {
            case 'revenue':
                setRange({
                    start: '400000000',
                    end: '499999999',
                });
                break;

            case 'variable-cost':
                setRange({
                    start: '500000000',
                    end: '599999999',
                });
                break;

            case 'fixed-cost':
                setRange({
                    start: '600000000',
                    end: '699999999',
                });
                break;

            case 'depreciated-cost':
                setRange({
                    start: '700000000',
                    end: '799999999',
                });
                break;

            case 'other-cost':
                setRange({
                    start: '800000000',
                    end: '899999999',
                });
                break;
            default:
                break;
        }
    };

    return (
        <div className='mt-3'>
            <div className='uppercase font-bold w-full text-lg'>{title}</div>
            {ledgers.map(
                (ledger, index) =>
                    ledger.code >= range.start &&
                    ledger.code <= range.end && (
                        <div className='flex w-full justify-between my-2' key={index}>
                            <div className={`w-6/12 print:w-8/12 uppercase flex gap-2 ${showCode ? 'pl-0' : 'pl-2'}`}>
                                <div className={`w-1/3 text-end ${showCode ? 'block' : 'hidden'}`}>{ledger.code}</div>
                                <div className='w-2/3'>{ledger.name}</div>
                            </div>
                            <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                                <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                                <div className='w-3/4 print:w-2/4 text-end'>
                                    {formatNumber(
                                        ledger.code < '500000000' ? parseInt(ledger.total) * -1 : parseInt(ledger.total)
                                    )}
                                </div>
                            </div>
                        </div>
                    )
            )}
            <div className='flex border-t w-full justify-between py-2 font-bold'>
                <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>Total {title}</div>
                <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                    <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                    <div className='w-3/4 print:w-2/4 text-end'>{formatNumber(amount)}</div>
                </div>
            </div>
        </div>
    );
}
