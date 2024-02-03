import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function ContactCategoryMobile({contactCategory, handleEdit, handleDelete, role}) {
  return (
    <>
        <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
            <div className='text-start my-auto'>
                {contactCategory.name}
            </div>
            <div className='text-start'>
                {
                    (role !== 'viewer') && 
                    <div className="dropdown dropdown-left">
                        <div                             
                            tabIndex={0} 
                            role="button" className={`btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                            <IoEllipsisVertical />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                            <li>                                
                                <button 
                                    onClick={handleEdit}
                                ><IoCreateOutline />Ubah</button>
                            </li>
                            <li>                                
                                <button 
                                    onClick={handleDelete}
                                ><IoTrash />Hapus</button>
                            </li>
                        </ul>
                    </div>
                }
                
            </div>
        </div>
    </>
  )
}
