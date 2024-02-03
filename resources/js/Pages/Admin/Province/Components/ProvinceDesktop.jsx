import React from 'react'

export default function ProvinceDesktop({province, className}) {
  return (
    <>
        <tr className={className}>
            <td>{province.id}</td>
            <td>{province.name}</td>
            <td></td>
        </tr>
    </>
  )
}
