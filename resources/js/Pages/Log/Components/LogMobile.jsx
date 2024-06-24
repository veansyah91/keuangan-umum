import React from 'react';
import dayjs from 'dayjs';

export default function LogMobile({ logItem, ...props }) {
    return (
        <div className='border-2' {...props}>
            <div className=' text-gray-900 py-2 border px-2'>
                <div className='w-full border-b-2 text-xs italic'>
                    Tanggal:
                    {dayjs(logItem.created_at).format('MMM DD, YYYY')}
                </div>
                <div className='w-full'>
                    <div>Deskripsi: </div>
                    {logItem.message}
                </div>
            </div>
        </div>
    );
}
