import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime';   
import dayjs from 'dayjs';
import { IoCreateOutline, IoEllipsisVertical } from 'react-icons/io5'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

dayjs.extend(relativeTime);

export default function OrganizationDesktop({organization, className, handleEdit, ...props}) {
    
    return (
        <>
            <tr className={className}>
                <td>{organization.name}</td>
                <td>{organization.address}</td>
                <td>{ dayjs(organization.expired).format('MMM DD, YYYY') }</td>
                <td>
                    {
                        organization.status == 'active' && <div className='italic text-green-600 my-auto'>Aktif</div>
                        
                    }
                    {
                        organization.status == 'trial' && <div className='italic text-yellow-600 my-auto'>Masa Uji Coba</div>
                    }
                    {
                        organization.status == 'deactive' && <div className='italic text-red-600 my-auto'>Tidak Aktif</div>
                    }
                </td>
                <td>{ dayjs(organization.created_at).format('MMM DD, YYYY') }</td>
                <td>
                <div className="dropdown dropdown-left ">
                    <div tabIndex={0} role="button" className="bg-inherit border-none -z-50"><IoEllipsisVertical /></div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>                                
                            <button className='bg-none' onClick={handleEdit}><IoCreateOutline />Ubah Status</button>
                        </li>
                    </ul>
                </div>
                </td>
            </tr>
            
        </>
    )
}
