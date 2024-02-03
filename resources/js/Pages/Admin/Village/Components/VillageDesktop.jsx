import React from 'react'

export default function VillageDesktop({village, className}) {
  return (
    <>
      <tr className={className}>
          <td>{village.id}</td>
          <td>{village.name}</td>
          <td>{village.district.name}</td>
          <td>{village.district.regency.name}</td>
          <td>{village.district.regency.province.name}</td>
          <td></td>
      </tr>
    </>
  )
}
