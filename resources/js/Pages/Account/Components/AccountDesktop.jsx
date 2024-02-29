import BadgeDanger from '@/Components/Badges/BadgeDanger'
import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function AccountDesktop({role, account,handleDelete, handleEdit, className}) {
  return (
    <>
      <tr className={className}>
        <td>{account.account_category.name.toUpperCase()}</td>
        <td>{account.code}</td>
        <td>{account.name.toUpperCase()}</td>
        <td className={`text-center`}>
          {
            account.is_active ? <BadgeSuccess>Aktif</BadgeSuccess> : <BadgeDanger>Tidak Aktif</BadgeDanger>
          }
        </td>
        <td className='text-end'>
          <div className=''>
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
                    <button 
                      onClick={handleEdit}
                    ><IoCreateOutline />Ubah
                    </button>                       
                  </li>
                  
                  <li>                                
                      <button 
                        onClick={handleDelete}
                      ><IoTrash />Hapus
                      </button>
                  </li>
              </ul>
            </div>
          }
          </div>
        </td>
      </tr>
    </>
  )
}
