import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';   
import dayjs from 'dayjs';
import { IoCreateOutline, IoEllipsisVertical } from 'react-icons/io5';
import "react-toastify/dist/ReactToastify.css";

dayjs.extend(relativeTime);

export default function OrganizationMobile({organization, handleEdit, ...props}) {
    return (
    <>
        <div className=' text-gray-900 py-2 px-1 border flex justify-between' {...props}>
            <div className='ml-2'>
                <div>
                    {organization.name}
                </div>
                <div className='text-sm'>
                    No: {organization.legality}
                </div>
                <div className='text-sm'>
                    Alamat: {organization.legality}
                </div>
                <div className='text-sm'>
                    Kadaluarsa: {organization.expired}
                </div>
                <div className='text-sm'>
                    Dibuat: { dayjs(organization.created_at).fromNow()}
                </div>
            </div>
            <div className='flex justify-end gap-1'>
                {
                    organization.status == 'active' && <div className='italic text-green-600 my-auto'>Aktif</div>
                    
                }
                {
                    organization.status == 'trial' && <div className='italic text-yellow-600 my-auto'>Masa Uji Coba</div>
                }
                {
                    organization.status == 'deactive' && <div className='italic text-red-600 my-auto'>Tidak Aktif</div>
                }
                <div className='my-auto'>
                    <div className="dropdown dropdown-left">
                        <div tabIndex={0} role="button" className="btn bg-white border-none hover:bg-gray-100 -z-50"><IoEllipsisVertical /></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>                                
                                <button onClick={handleEdit}><IoCreateOutline />Ubah Status</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>                                   
        </div>
    </>
    )
}
