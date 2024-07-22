import { Link } from '@inertiajs/react'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'

export default function DropdownAction(
  showDetail = true,
  detailLabel = 'Detail',
  detailLink = '',
  editLink = '',
  handleDelete,
) {
  return (
    <div className='dropdown dropdown-left'>
      <div
        tabIndex={0}
        role='button'
        className={`btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
        <IoEllipsisVertical />
      </div>
      <ul
        tabIndex={0}
        className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
        <li>
          <Link
            href={editLink}>
            <IoCreateOutline /> Edit
          </Link>
        </li>
        {
          showDetail && 
          <li>
            <Link
              href={detailLink}>
              <IoSearchOutline /> {detailLabel}
            </Link>
          </li>
        }
        <li>
          <button onClick={handleDelete}>
              <IoTrash />
              Hapus
          </button>
        </li>
      </ul>
    </div>
  )
}
