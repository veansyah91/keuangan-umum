import React from 'react';

export default function RegencyDesktop({ regency, className }) {
    return (
        <>
            <tr className={className}>
                <td>{regency.id}</td>
                <td>{regency.name}</td>
                <td>{regency.province.name}</td>
                <td></td>
            </tr>
        </>
    );
}
