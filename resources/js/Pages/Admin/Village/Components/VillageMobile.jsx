import React from 'react'

export default function VillageMobile({village}) {
  return (
    <>
        <div className=' text-gray-900 py-2 px-2 border flex gap-5 justify-start'>
            <div className='ml-2 w-1/4'>
                {village.id}
            </div>
            <div className='mr-2 text-start w-3/4'>
                <div>{village.name}</div>
                <div className='text-sm'>Kecamatan: {village.district.name}</div>                
                <div className='text-sm'>Kabupaten / Kota: {village.district.regency.name}</div>                
                <div className='text-sm'>Provinsi: {village.district.regency.province.name}</div>                
            </div>
        </div>
    </>
  )
}
