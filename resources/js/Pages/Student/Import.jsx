import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SuccessButton from '@/Components/SuccessButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import FormInput from '@/Components/FormInput';
import { FaGoogleDrive } from 'react-icons/fa';

export default function Import({ organization }) {
    const { data, setData, post, progress, reset, processing } = useForm({
        students: '',
    });

    const handleInputFile = (e) => {
        if (e.currentTarget.files) {
            setData('students', e.currentTarget.files[0]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('data-master.students.import.post', organization.id), {
            onSuccess: ({ props }) => {

            },
            onError: errors => {
                console.log(errors);
            }
        })
    }

    return (
        <>
            <Head title='Impor Data Siswa' />

            <div className='sm:pt-0 pb-16 pt-12'>
                <div className='bg-white py-5 px-2 sm:pt-0'>
                    <div className='w-full sm:w-2/3 sm:mt-2 sm:py-5 space-y-5'>
                        <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
                            <div className='flex flex-col sm:flex-row justify-start gap-1'>
                                <div className='flex gap-1 justify-between'>
                                    <a 
                                        target='_blank'
                                        type={'button'}
                                        href={'https://drive.google.com/file/d/171fMN6gRNGvwvZQ4wdXQ3h2yrYRXP_kl/view?usp=sharing'}
                                    >
                                        <SuccessButton>
                                            <div className='flex gap-2 my-auto'>
                                                <div className='my-auto'><FaGoogleDrive /> </div>
                                                <div className='my-auto'>Unduh Tempate</div>
                                            </div>
                                        </SuccessButton>
                                    </a>
                                </div>
                            </div>
                            <FormInput onSubmit={handleSubmit}>
                                <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                    <div className='sm:w-1/3 font-bold'>File Data Siswa (.csv)</div>
                                    <div className='sm:w-2/3 flex gap-1'>
                                        <input
                                            type='file'
                                            className='file-input file-input-bordered file-input-sm w-full'
                                            value={undefined}
                                            onChange={handleInputFile}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row justify-between gap-1 pt-10'>
                                    <PrimaryButton type="submit">
                                        Import
                                    </PrimaryButton>
                                </div>
                        </FormInput>
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
