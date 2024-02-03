import React from 'react'

export default function DistrictMobile({district}) {
  return (
    <>
        <div className=' text-gray-900 py-2 px-2 border flex gap-5 justify-start'>
            <div className='ml-2 w-1/4'>
                {district.id}
            </div>
            <div className='mr-2 text-start w-3/4'>
                <div>{district.name}</div>
                <div className='text-sm'>Kabupaten / Kota: {district.regency.name}</div>                
                <div className='text-sm'>Provinsi: {district.regency.province.name}</div>                
            </div>
        </div>
    </>
  )
}
