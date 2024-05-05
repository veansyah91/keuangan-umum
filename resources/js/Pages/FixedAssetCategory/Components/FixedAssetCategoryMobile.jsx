import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function FixedAssetCategoryMobile({role, data,handleDelete, handleEdit}) {
  return (
    <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
      <div className='text-start my-auto w-2/3'>
        <div>{data.name.toUpperCase()}</div>
        <div className='text-sm mt-2'>
          <div className='font-bold'>
            Usia Penggunaan:
          </div> 
          <div>
            {data.lifetime} Bulan
          </div>
        </div>
      </div>
      <div className='text-end my-auto w-1/3'>
        <div className=''>
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
      </div>
    </div>
  )
}

