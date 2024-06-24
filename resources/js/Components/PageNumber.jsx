import formatNumber from '@/Utils/formatNumber';
import React from 'react';

export default function PageNumber({ data }) {
    return (
        <div className='my-auto italic text-xs'>
            {formatNumber(data.current_page * data.per_page - (data.per_page - 1))}-{formatNumber(data.to)} dari{' '}
            {formatNumber(data.total)}
        </div>
    );
}
