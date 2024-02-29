import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'

export default function ProjectMobile({project, role, handleDelete}) {
  return (
    <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
      <div className='text-start my-auto w-1/2'>
        <div className='text-xs'>
          {project.code}
        </div>
        <div>
          {project.name}
        </div>
        <div className='text-xs flex gap-1'>
          <div>Status</div>
          <div className='font-bold'>: 
            {project.status == 'not started' && ' Belum Dimulai'}
            {project.status == 'finished' && ' Selesai'}
            {project.status == 'pending' && ' Ditunda'}
            {project.status == 'in progress' && ' Dalam Pengerjaan'}
            </div>
        </div>
      </div>
      <div className='mb-auto w-5/12'>
        <div className='text-xs text-start'>Perkiraan Biaya:</div>
        <div className='text-end'>IDR {formatNumber(project.estimated_value)}</div> 
      </div>
      <div className='text-start my-auto w-1/12'>
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
      </div>
    </div>
  )
}
