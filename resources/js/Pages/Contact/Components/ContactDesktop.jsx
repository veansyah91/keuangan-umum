import { Link } from '@inertiajs/react'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function ContactDesktop({contact, className, role, handleDelete}) {
  return (
    <tr className={className}>
      <td>{contact.name}</td>
      <td>{contact.phone}</td>
      <td>{contact.address}</td>
      <td>{contact.contact_categories.map((category) => category.name).join(', ')}</td>
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
      </td>
    </tr>
  )
}
