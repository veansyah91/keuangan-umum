import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import dayjs from 'dayjs';

export default function Import({ organization, contact, student, levels }) {
    return (
        <>
            <Head title='Impor Data Siswa' />

            <div className='sm:pt-0 pb-16 pt-12'>
                <div className='bg-white py-5 px-2 sm:pt-0'>
                    <div className='w-full sm:mt-2 sm:py-5 space-y-5'>
                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'No. Handphone (opsional)'}
                                    htmlFor='phone'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='phone'
                                    name='phone'
                                    className={`w-full ${errors?.phone && 'border-red-500'}`}
                                    placeholder='No. Handphone'
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value.toUpperCase())}
                                />
                                {errors?.phone && <span className='text-red-500 text-xs'>{errors.phone}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}

Import.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Impor Data Siswa</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Impor Data Siswa'
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
                    <li>Impor Data Siswa</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
