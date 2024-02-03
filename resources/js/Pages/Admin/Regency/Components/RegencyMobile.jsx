import React from 'react'

export default function RegencyMobile({regency}) {
  return (
    <>
        <div className=' text-gray-900 py-2 px-2 border flex gap-5 justify-start'>
            <div className='ml-2'>
                {regency.id}
            </div>
            <div className='mr-2 text-start'>
                <div>{regency.name}</div>
                <div className='text-sm'>Provinsi: {regency.province.name}</div>                
            </div>
        </div>
    </>
  )
}
