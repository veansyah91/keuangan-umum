import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeDanger from '@/Components/Badges/BadgeDanger';

export default function Show({ organization, contact, student, levels }) {
    return (
        <>
            <Head title='Detail Data Siswa' />

            <div className='sm:pt-0 pb-16 pt-12'>
                <div className='bg-white py-5 px-2 sm:pt-0'>
                    <div className='w-full sm:mt-2 sm:py-5 space-y-5'>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>No Siswa</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {student.no_ref ?? '-'}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Tahun Masuk</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {student.entry_year}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Nama</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {contact.name}
                                </div>
                            </div>
                        </div>

                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5 font-bold underline uppercase pt-5'>
                            Biodata
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Tanggal Lahir</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    { student.birthday ? dayjs(student.birthday).locale('id').format('MMMM YYYY, DD') : '-'}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Nama Ayah</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {student.father_name}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Nama Ibu</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {student.mother_name}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>No Telepon / HP</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {contact.phone}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Alamat</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {contact.address}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Informasi Lain</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {contact.description}
                                </div>
                            </div>
                        </div>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <div className='sm:w-1/3 font-bold'>Status</div>
                                <div className='sm:w-2/3 flex gap-1'>
                                    <span className='hidden sm:block'>:</span>
                                    {
                                        contact.is_active 
                                        ? <BadgeSuccess>Aktif</BadgeSuccess>
                                        : <BadgeDanger>Tidak Aktif</BadgeDanger>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5 font-bold underline uppercase pt-5'>
                            Riwayat Kelas
                        </div>
                        <div className='sm:w-1/2 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                <table className='table'>
                                    <thead>
                                        <tr className='font-slate-900'>
                                            <th>Tahun Ajaran</th>
                                            <th>Kelas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            levels.map(level =>
                                                <tr>
                                                    <td>{level.year}</td>
                                                    <td>{level.level}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}

Show.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Detail Data Siswa</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Detail Data Siswa'
        backLink={
            <Link href={route('data-master.students', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('data-master', page.props.organization.id)}>Data Master</Link>
                    </li>
                    <li className='font-bold'>
                        <Link href={route('data-master.students', page.props.organization.id)}>Data Siswa</Link>
                    </li>
                    <li>Detail Data Siswa</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
