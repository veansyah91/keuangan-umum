import React from 'react'

export default function PageDesktop({ page, className }) {
  return (
    <>
      <tr className={className}>
        <td>{page.name}</td>
      </tr>
    </>
  )
}
