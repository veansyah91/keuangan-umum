import React from 'react'

export default function MenuMobile({ menu }) {
  return (
    <div className=' text-gray-900 py-2 px-2 border flex gap-5 justify-start'>
      <div className='mr-2 text-start'>
        <div className='text-sm'>
          Halaman: { menu.page }
        </div>
        <div className='font-bold text-lg'>
          { menu.name }
        </div>
      </div>
    </div>
  )
}
