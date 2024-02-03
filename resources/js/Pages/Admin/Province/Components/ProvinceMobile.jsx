import React from 'react'

export default function ProvinceMobile({province}) {
  return (
    <>
        <div className=' text-gray-900 py-2 px-2 border flex gap-5 justify-start'>
            <div className='ml-2'>
                {province.id}
            </div>
            <div className='mr-2 text-start'>
                {province.name}
            </div>
        </div>
    </>
  )
}
