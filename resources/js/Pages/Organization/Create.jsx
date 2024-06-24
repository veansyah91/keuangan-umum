import React, { useEffect, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Header from '@/Components/Header';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import addMonths from '@/Utils/addMonths';
import AddressSelectInput from '@/Components/SelectInput/AddressSelectInput';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import { IoTrash } from 'react-icons/io5';

export default function Create({ villages, villageFilter }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
        expired: '',
        legality: '',
        addressDetail: {
            village: villageFilter && villages[0].name,
            village_id: villageFilter && villages[0].id.toString(),
            district: villageFilter && villages[0].district.name,
            district_id: villageFilter && villages[0].district.id.toString(),
            regency: villageFilter && villages[0].district.regency.name,
            regency_id: villageFilter && villages[0].district.regency.id.toString(),
            province: villageFilter && villages[0].district.regency.province.name,
            province_id: villageFilter && villages[0].district.regency.province.id.toString(),
        },
    });

    const [village, setVillage] = useState(villageFilter || '');
    const [selectedVillage, setSelectedVillage] = useState(villageFilter ? villages[0] : {});
    const [queryVillage, setQueryVillage] = useState(villageFilter || '');
    const [debounceQueryVillage] = useDebounce(queryVillage, 500);

    const prevSearch = usePrevious(village);

    useEffect(() => {
        const today = new Date();

        let nextMonth = addMonths(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 1);
        setData('expired', `${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}-${nextMonth.getDate()}`);
    }, []);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleSetData();
            handleReloadVillage();
        }
    }, [debounceQueryVillage, selectedVillage]);

    const handleSetData = () => {
        setData('addressDetail', {
            province: selectedVillage ? selectedVillage?.district?.regency?.province?.name : '',
            province_id: selectedVillage ? selectedVillage?.district?.regency?.province?.id?.toString() : '',
            regency: selectedVillage ? selectedVillage?.district?.regency?.name : '',
            regency_id: selectedVillage ? selectedVillage?.district?.regency?.id?.toString() : '',
            district: selectedVillage ? selectedVillage?.district?.name : '',
            district_id: selectedVillage ? selectedVillage?.district?.id?.toString() : '',
            village: selectedVillage ? selectedVillage?.name : '',
            village_id: selectedVillage ? selectedVillage?.id?.toString() : '',
        });
    };

    const handleReloadVillage = () => {
        router.reload({
            only: ['villages'],
            data: {
                village: queryVillage,
            },
            preserveState: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('organization.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDeleteVillageFilter = () => {
        setSelectedVillage('');
        setQueryVillage('');
    };

    return (
        <>
            <Head title='Organization' />

            <div className='min-h-screen bg-gray-100'>
                <div className='max-w-xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
                        <div className='sm:p-6 px-6 py-6 text-gray-800 text-center'>
                            <Header>Tambah Organisasi</Header>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='bg-white overflow-hidden shadow-sm sm:rounded-b-lg pb-6'>
                            <div className='px-6 py-3 text-gray-800'>
                                <InputLabel htmlFor='name' value='Nama' className='mx-auto' />
                                <TextInput
                                    id='name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    className={`mt-1 w-full ${errors && errors.name && 'border-red-500'}`}
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                    placeholder='Nama Organisasi'
                                />
                                {errors && errors.name && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.name}</div>
                                    </div>
                                )}
                            </div>

                            <div className='px-6 py-3 text-gray-800'>
                                <InputLabel htmlFor='address' value='Alamat' className='mx-auto' />
                                <TextInput
                                    id='address'
                                    type='text'
                                    name='address'
                                    value={data.address}
                                    className={`mt-1 w-full ${errors && errors.address && 'border-red-500'}`}
                                    onChange={(e) => setData('address', e.target.value.toUpperCase())}
                                    placeholder='Alamat Lengkap'
                                />
                                {errors && errors.address && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.address}</div>
                                    </div>
                                )}
                            </div>

                            <div className='px-6 py-3 text-gray-800'>
                                <InputLabel htmlFor='address' value='Alamat Lengkap' className='mx-auto' />
                                <div className='flex'>
                                    <div className={`${selectedVillage ? 'w-11/12' : 'w-full'}`}>
                                        <AddressSelectInput
                                            data={villages}
                                            selected={selectedVillage}
                                            setSelected={setSelectedVillage}
                                            query={queryVillage}
                                            setQuery={setQueryVillage}
                                            maxHeight='max-h-40'
                                            placeholder='Cari Desa / Kelurahan'
                                        />
                                    </div>

                                    <div className={`mx-auto my-auto ${selectedVillage && 'w-1/12'}`}>
                                        {selectedVillage && (
                                            <button className='p-2' onClick={handleDeleteVillageFilter}>
                                                <IoTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {selectedVillage && (
                                    <div className='text-xs'>
                                        <div>Kecamatan: {selectedVillage.district?.name}</div>
                                        <div>Kabupaten/Kota: {selectedVillage.district?.regency?.name}</div>
                                        <div>Provinsi: {selectedVillage.district?.regency?.province?.name}</div>
                                    </div>
                                )}
                            </div>
                            <div className='px-6 py-3 text-gray-800'>
                                <InputLabel htmlFor='legality' value='No Legalitas (opsional)' className='mx-auto' />
                                <TextInput
                                    id='legality'
                                    type='text'
                                    name='legality'
                                    value={data.legality}
                                    className={`mt-1 w-full ${errors && errors.legality && 'border-red-500'}`}
                                    onChange={(e) => setData('legality', e.target.value.toUpperCase())}
                                    placeholder='No Legalitas'
                                />
                                {errors && errors.legality && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.legality}</div>
                                    </div>
                                )}
                            </div>
                            <div className='px-6 py-3 text-gray-800 text-center md:flex sm:rouded-b-lg'>
                                <div className='mt-1 text-center md:mt-0 md:w-1/4 md:flex-1 md:mx-10 hidden md:block'>
                                    <Link href='/organizations'>
                                        <SecondaryButton className='w-full md:min-w-max'>
                                            <div className='w-full text-center'>Kembali</div>
                                        </SecondaryButton>
                                    </Link>
                                </div>
                                <div className='md:w-1/4 md:flex-1 md:mx-10'>
                                    <PrimaryButton className='w-full md:min-w-max' disabled={processing}>
                                        <div className='w-full text-center'>Tambah</div>
                                    </PrimaryButton>
                                </div>
                                <div className='mt-1 text-center md:hidden'>
                                    <Link href='/organizations'>
                                        <SecondaryButton className='w-full md:min-w-max'>
                                            <div className='w-full text-center'>Kembali</div>
                                        </SecondaryButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
