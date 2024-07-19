import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import FormInput from '@/Components/FormInput';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

const yearList = () => {
    
}

export default function Create({ organization, category }) {
    // state
    const { data, setData, processing, post, errors, setError, reset } = useForm({
        name: '',
        phone: '',
        address: '',
        description: '',
        father:'',
        mother:'',
        no_ref:'',
        entry_year:'',
        category: category.id,
    });

    // Category Select
    const [selectedCategory, setSelectedCategory] = useState([]);

    // useEffect
    useEffect(() => {
        setData('category', selectedCategory);
    }, [selectedCategory]);

    // function
    const handleCheckboxChange = (categoryId) => {
        if (selectedCategory.includes(categoryId)) {
            setSelectedCategory(selectedCategory.filter((item) => item !== categoryId));
        } else {
            setSelectedCategory([...selectedCategory, categoryId]);
        }
        setData('category', selectedCategory);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('data-master.students.store', organization.id), {
            onSuccess: () => {
                toast.success(`Siswa Berhasil Ditambahkan`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                reset();
                setSelectedCategory([]);
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title='Tambah Data Siswa' />
            <ToastContainer />

            <FormInput onSubmit={handleSubmit}>
                <div className='w-full sm:mt-2 sm:py-5'>
                    <div className='sm:w-1/2 sm:mx-auto px-3 sm:px-0'>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Nama'} htmlFor='name' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='name'
                                    name='name'
                                    className={`w-full ${errors?.name && 'border-red-500'}`}
                                    isFocused={true}
                                    placeholder='Nama'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                />
                                {errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>}
                            </div>
                        </div>

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

                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Alamat (opsional)'}
                                    htmlFor='address'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='address'
                                    name='address'
                                    className={`w-full ${errors?.address && 'border-red-500'}`}
                                    placeholder='Alamat'
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value.toUpperCase())}
                                />
                                {errors?.address && <span className='text-red-500 text-xs'>{errors.address}</span>}
                            </div>
                        </div>

                        <div className='text-center mt-5 font-bold'>Detail Siswa</div>

                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Tahun Masuk'}
                                    htmlFor='entry_year'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='entry_year'
                                    name='entry_year'
                                    className={`w-full ${errors?.entry_year && 'border-red-500'}`}
                                    placeholder='Tahun Masuk'
                                    value={data.entry_year}
                                    onChange={(e) => setData('entry_year', e.target.value.toUpperCase())}
                                />
                                {errors?.entry_year && <span className='text-red-500 text-xs'>{errors.entry_year}</span>}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'No Siswa (opsional)'}
                                    htmlFor='no_ref'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='no_ref'
                                    name='no_ref'
                                    className={`w-full ${errors?.no_ref && 'border-red-500'}`}
                                    placeholder='No Siswa'
                                    value={data.no_ref}
                                    onChange={(e) => setData('no_ref', e.target.value.toUpperCase())}
                                />
                                {errors?.no_ref && <span className='text-red-500 text-xs'>{errors.no_ref}</span>}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Alamat (opsional)'}
                                    htmlFor='address'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='address'
                                    name='address'
                                    className={`w-full ${errors?.address && 'border-red-500'}`}
                                    placeholder='Alamat'
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value.toUpperCase())}
                                />
                                {errors?.address && <span className='text-red-500 text-xs'>{errors.address}</span>}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Informasi Tambahan (opsional)'}
                                    htmlFor='description'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='description'
                                    name='description'
                                    className={`w-full ${errors?.description && 'border-red-500'}`}
                                    placeholder='Informasi Tambahan'
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value.toUpperCase())}
                                />
                                {errors?.description && (
                                    <span className='text-red-500 text-xs'>{errors.description}</span>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
                            <div className='w-full sm:w-1/6 my-auto text-center'>
                                <Link href={route('data-master.students', organization.id)}>
                                    <SecondaryButton className='w-full'>
                                        <div className='text-center w-full'>Batal</div>
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <div className='w-full sm:w-1/6 text-center'>
                                <PrimaryButton className='w-full' disabled={processing}>
                                    <div className='text-center w-full'>Simpan</div>
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </FormInput>
        </>
    );
}

Create.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Tambah Data Siswa</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Tambah Data Siswa'
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
                    <li>Tambah Data Siswa</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
