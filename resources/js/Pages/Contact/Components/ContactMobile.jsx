import { Link } from '@inertiajs/react'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function ContactMobile({contact, role, handleDelete}) {
  return (
      <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
        <div className='text-start my-auto w-1/2'>
          <div>
            {contact.name}
          </div>
          <div className='text-xs'>
            No. HP: 
            {contact.phone}
          </div>
          <div className='text-xs'>
            Alamat: 
            {contact.address}
          </div>
        </div>
        <div className='text-start my-auto w-5/12'>
          {
            contact.contact_categories.map((category) => category.name).join(', ')
          }
        </div>
        <div className='text-start my-auto w-1/12'>
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
                        <Link href={route('data-master.contact.edit', 
                                            {
                                              'organization':contact.organization_id,
                                              'contact' : contact.id
                                            })}>
                          <IoCreateOutline /> Edit
                        </Link>                        
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
  )
}
