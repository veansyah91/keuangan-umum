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

export default function Create({ organization, categories }) {
    // state
    const { data, setData, processing, post, errors, setError, reset } = useForm({
        name: '',
        phone: '',
        address: '',
        description: '',
        category: [],
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

        post(route('data-master.contact.store', organization.id), {
            onSuccess: () => {
                toast.success(`Kontak Berhasil Ditambahkan`, {
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
            <Head title='Tambah Data Kontak' />
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
                                    placeholder='628xxxx'
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

                        <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Kategori'} htmlFor='description' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <div
                                    className={`flex flex-wrap gap-3 ${errors?.category && 'border-red-500 border rounded-md'} `}>
                                    {categories.map((category, index) => (
                                        <div className='form-control ' key={index}>
                                            <label className='label cursor-pointer gap-2' htmlFor={`checkbox-${index}`}>
                                                <input
                                                    type='checkbox'
                                                    className='checkbox'
                                                    id={`checkbox-${index}`}
                                                    value={category.id}
                                                    onChange={() => handleCheckboxChange(category.id)}
                                                    checked={selectedCategory.includes(category.id)}
                                                />
                                                <span className='label-text'>{category.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors?.category && <span className='text-red-500 text-xs'>{errors.category}</span>}
                            </div>
                        </div>

                        <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
                            <div className='w-full sm:w-1/6 my-auto text-center'>
                                <Link href={route('data-master.contact', organization.id)}>
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
        header={<Header>Tambah Data Kontak</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Tambah Data Kontak'
        backLink={
            <Link href={route('data-master.contact', page.props.organization.id)}>
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
                        <Link href={route('data-master.contact', page.props.organization.id)}>Data Kontak</Link>
                    </li>
                    <li>Tambah Data Kontak</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
