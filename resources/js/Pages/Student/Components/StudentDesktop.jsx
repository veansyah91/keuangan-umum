import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import { Link } from '@inertiajs/react';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentDesktop({ contact, className, role, handleDelete }) {
    const studentLevel = () => {
        const length = contact.levels.length;

        return  contact.levels[length-1];
    }
    
    
    return (
        <tr className={className}>
            <td>
                <div className='text-sm'>ID: {contact.student.no_ref}</div>
                <div>{contact.name}</div>
            </td>
            <td>{studentLevel().level} ({studentLevel().year})</td>
            <td>{contact.address}</td>
            <td>
            {
                contact.is_active 
                ? <BadgeSuccess>Aktif</BadgeSuccess>
                : <BadgeDanger>Tidak Aktif</BadgeDanger>
            }
            </td>
            <td>
                {role !== 'viewer' && (
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
                                <Link
                                    href={route('data-master.students.edit', {
                                        organization: contact.organization_id,
                                        contact: contact.id,
                                    })}>
                                    <IoCreateOutline /> Edit
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('data-master.students.show', {
                                        organization: contact.organization_id,
                                        contact: contact.id,
                                    })}>
                                    <IoSearchOutline /> Detail
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleDelete}>
                                    <IoTrash />
                                    Hapus
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </td>
        </tr>
    );
}
