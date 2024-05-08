import BadgeDanger from '@/Components/Badges/BadgeDanger'
import BadgeSecondary from '@/Components/Badges/BadgeSecondary'
import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import BadgeWarning from '@/Components/Badges/BadgeWarning'
import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'
import { MdDeveloperBoardOff } from 'react-icons/md'

export default function FixedAssetDesktop({fixedAsset, role, handleDelete, className}) {
  return (
    <>
      <tr className={`text-sm ${className}`}>
        <td>{dayjs(fixedAsset.date).format('MMM DD, YYYY')}</td>
        <td>{fixedAsset.code}</td>
        <td>{fixedAsset.name}</td>
        <td className='text-end'>IDR {formatNumber(fixedAsset.value)}</td>
        <td className='text-end'>IDR {formatNumber(fixedAsset.depreciation_value)}</td>
        <td className='text-end'>IDR {formatNumber(fixedAsset.depreciation_accumulated)}</td>
        <td className='text-end'>IDR {formatNumber(fixedAsset.value - fixedAsset.depreciation_accumulated)}</td>
        <td>
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
                          onClick={handleDelete}
                      ><MdDeveloperBoardOff />Disposal</button>
                  </li>
              </ul>
          </div>
        }
        </td>

      </tr>
    </>
  )
}
