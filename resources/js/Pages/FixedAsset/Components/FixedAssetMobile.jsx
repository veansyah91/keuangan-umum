import BadgeDanger from '@/Components/Badges/BadgeDanger'
import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'
import { MdDeveloperBoardOff } from 'react-icons/md'

export default function FixedAssetMobile({fixedAsset, role, handleDelete, handleDisposal, disposalStatus}) {
  return (
    <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
      <div className='text-start my-auto w-6/12 space-y-2'>
        <div className='text-xs'>
          <div>Nama: </div>
          <div className='font-bold'>
            {fixedAsset.name.toUpperCase()}
          </div>
        </div>
        <div className='text-xs'>
          <div>Kode: </div>
          <div className='font-bold'>
            {fixedAsset.code.toUpperCase()}
          </div>
        </div>
        <div className='text-xs'>
          <div>Tanggal Perolehan: </div>
          <div className='font-bold'>
            {dayjs(fixedAsset.date).format('MMM DD, YYYY')}
          </div>
        </div>
        
      </div>
      <div className='text-start w-5/12 space-y-2'>
        <div className='text-sm'>
          <div>Nilai Perolehan: </div>
          <div className='font-bold'>
            IDR. {formatNumber(fixedAsset.value)}
          </div>
        </div>
      </div>

      {
        !disposalStatus &&
        <div className='text-start w-1/12 space-y-2'>
          {
            (role !== 'viewer') &&
            <div className="dropdown dropdown-left">
                <div                             
                    tabIndex={0} 
                    role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                    <IoEllipsisVertical />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                    <li>                                
                      <Link href={route('data-master.fixed-asset.edit', 
                                      {
                                        'organization':fixedAsset.organization_id,
                                        'fixedAsset' : fixedAsset.id
                                      })}>
                        <IoCreateOutline /> Edit
                      </Link>   
                    </li>
                    <li>           
                      <Link href={route('data-master.fixed-asset.show', 
                                      {
                                        'organization':fixedAsset.organization_id,
                                        'fixedAsset' : fixedAsset.id
                                      })}>
                        <IoSearchOutline /> Detail
                      </Link>
                    </li>
                    <li>                                
                        <button 
                            onClick={handleDelete}
                        ><IoTrash />Hapus</button>
                    </li>
                    <li>                                
                        <button 
                            onClick={handleDisposal}
                        ><MdDeveloperBoardOff />Disposal</button>
                    </li>
                </ul>
            </div>
          }
        </div>
      }
      
    </div>
    

  )
}
