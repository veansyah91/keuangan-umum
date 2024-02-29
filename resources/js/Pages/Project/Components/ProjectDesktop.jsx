import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'

export default function ProjectDesktop({project, className, handleDelete, handleEdit, role}) {
  return (
    <>
      <tr className={className}>
          <td>{project.code}</td>
          <td>{project.name}</td>
          <td>{project.description}</td>
          <td className='text-end'>IDR {formatNumber(project.estimated_value)}</td>
          <td className='text-center'>
            {project.status == 'not started' && 'Belum Dimulai'}
            {project.status == 'finished' && 'Selesai'}
            {project.status == 'pending' && 'Ditunda'}
            {project.status == 'in progress' && 'Dalam Pengerjaan'}
          </td>
          <td className='text-end'>
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
                        <Link href={route('data-master.project.edit', 
                                        {
                                          'organization':project.organization_id,
                                          'project' : project.id
                                        })}>
                          <IoCreateOutline /> Edit
                        </Link>   
                        </li>
                        <li>                                
                          <Link href={route('data-master.project.show', 
                                          {
                                            'organization':project.organization_id,
                                            'project' : project.id
                                          })}>
                            <IoSearchOutline /> Detail
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
    </>
  )
}
