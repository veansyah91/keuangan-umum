import React from 'react'

export default function PageMobile({ page }) {
  return (
    <div className=' text-gray-900 py-2 px-2 border flex gap-5 justify-start'>
      <div className='mr-2 text-start'>{page.name}</div>
    </div>
  )
}
