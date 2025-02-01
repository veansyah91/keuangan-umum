import formatNumber from '@/Utils/formatNumber'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function SavingBalanceDesktop({ member, className, role, handleDelete, handleEdit }) {
  return (
    <>
      <tr className={className}>
        <td>{member.no_ref}</td>
        <td>
          <div>{member.contact.name}</div>
          <div className='text-sm font-bold'>
            {member.contact.contact_categories[0].name}
            {
              member.contact.student ? `-${member.contact.student.no_ref}` : ''
            }
          </div>
        </td>
        <td>{member.saving_category.name}</td>
        <td className='text-end text-green-800 font-bold'>IDR. { formatNumber(member.value) }</td>
        <td className='text-end'>
          {role !== 'viewer' && (
            <div className='dropdown dropdown-left'>
              <div
                tabIndex={0}
                role='button'
                className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                <IoEllipsisVertical />
              </div>
              <ul
                tabIndex={0}
                className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
                <li>
                  <button onClick={handleEdit}>
                    <IoCreateOutline />
                    Ubah
                  </button>
                </li>
                <li>
                  <button onClick={handleDelete}>
                    <IoTrash />
                    Hapus
                  </button>
                </li>
              </ul>
            </div>
          )}
        </td>
      </tr>
    </>
  )
}

