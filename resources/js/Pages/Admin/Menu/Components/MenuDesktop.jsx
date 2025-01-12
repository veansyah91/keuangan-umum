import React from 'react'

export default function MenuDesktop({ menu, className }) {
  return (
    <>
      <tr className={className}>
        <td>{menu.page}</td>
        <td>{menu.name}</td>
      </tr>
    </>
  )
}
