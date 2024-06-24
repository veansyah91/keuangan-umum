import React from 'react';
import dayjs from 'dayjs';

export default function LogDesktop({ logItem, className, ...props }) {
    return (
        <tr className={className} {...props}>
            <td>{logItem.message}</td>
            <td>{dayjs(logItem.created_at).format('MMM DD, YYYY')}</td>
        </tr>
    );
}
