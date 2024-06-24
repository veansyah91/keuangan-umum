import React from 'react';

export default function DistrictDesktop({ district, className }) {
    return (
        <>
            <tr className={className}>
                <td>{district.id}</td>
                <td>{district.name}</td>
                <td>{district.regency.name}</td>
                <td>{district.regency.province.name}</td>
                <td></td>
            </tr>
        </>
    );
}
