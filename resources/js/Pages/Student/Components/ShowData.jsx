import React, { useState } from 'react'
import EditLevelStudent from './EditLevelStudent';
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5';

export default function ShowData({ level, organizationId }) {  
  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = () => {

  }

  const handleEdit = () => {    
    setIsEdit(!isEdit);
  }

  const handleCancelEdit = () => {
    setIsEdit(false);
  }
  
  return (    
    isEdit 
    ? <EditLevelStudent level={level} cancelEdit={handleCancelEdit} organizationId={organizationId}/>
    : <div className='flex flex-col sm:flex-row justify-between gap-1'>
        <div className='w-2/5'>{level.year}</div>
        <div className='w-2/5'>{level.level}</div>
        <div className='w-1/5'>
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
                  <IoCreateOutline /> Edit
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
  )
}
