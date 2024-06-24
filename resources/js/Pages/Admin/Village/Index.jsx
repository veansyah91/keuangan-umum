import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp, IoTrash } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import NavgroupRegionalMobile from '@/Components/NavgroupRegionalMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import PageNumber from '@/Components/PageNumber';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import VillageMobile from './Components/VillageMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import VillageDesktop from './Components/VillageDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import NavgroupRegional from '@/Components/NavgroupRegional';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';

export default function Index({
    villages,
    provinces,
    regencies,
    districts,
    searchFilter,
    provinceFilter,
    regencyFilter,
    districtFilter,
}) {
    // state
    const [showSearch, setShowSearch] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const prevSearch = usePrevious(search);

    const { data, setData, post, progress, reset, processing } = useForm({
        village: '',
    });

    // Province Select
    const [selectedProvince, setSelectedProvince] = useState('');
    const [queryProvince, setQueryProvince] = useState(provinceFilter || '');
    const [debounceQueryProvince] = useDebounce(queryProvince, 500);

    // Regency Select
    const [selectedRegency, setSelectedRegency] = useState('');
    const [queryRegency, setQueryRegency] = useState(regencyFilter || '');
    const [debounceQueryRegency] = useDebounce(queryRegency, 500);

    // District Select
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [queryDistrict, setQueryDistrict] = useState(districtFilter || '');
    const [debounceQueryDistrict] = useDebounce(queryDistrict, 500);

    // Useeffect
    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPageOnlyProvince();
        }
    }, [debounceQueryProvince, selectedProvince]);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPageOnlyRegency();
        }
    }, [debounceQueryRegency, selectedRegency, selectedProvince]);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPageOnlyDistrict();
        }
    }, [debounceQueryDistrict, selectedDistrict, selectedRegency]);

    // Function
    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleInputFile = (e) => {
        if (e.currentTarget.files) {
            setData('village', e.currentTarget.files[0]);
        }
    };

    const handleSubmitImport = (e) => {
        e.preventDefault();
        post(route('admin.data-master.village.post'), {
            onSuccess: () => {
                reset();
                setShowModalImport(false);
                toast.success(`Desa / Kelurahan Berhasil Diimport`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setShowModalFilter(false);
        handleReloadPage();
    };

    const handleReloadPage = () => {
        router.reload({
            only: ['villages'],
            data: {
                search,
                province: selectedProvince.id,
                regency: selectedRegency.id,
                district: selectedDistrict.id,
            },
        });
    };

    const handleReloadPageOnlyProvince = () => {
        router.reload({
            only: ['provinces'],
            data: {
                searchProvince: queryProvince,
            },
            preserveState: true,
        });
    };

    const handleReloadPageOnlyRegency = () => {
        router.reload({
            only: ['regencies'],
            data: {
                searchRegency: queryRegency,
                province: selectedProvince.id,
            },
            preserveState: true,
        });
    };

    const handleReloadPageOnlyDistrict = () => {
        router.reload({
            only: ['districts'],
            data: {
                searchDistrict: queryDistrict,
                regency: selectedRegency.id,
            },
            preserveState: true,
        });
    };

    const handleDeleteProvinceFilter = () => {
        setSelectedProvince('');
        setQueryProvince('');
    };

    const handleDeleteRegencyFilter = () => {
        setSelectedRegency('');
        setQueryRegency('');
    };

    const handleDeleteDistrictFilter = () => {
        setSelectedDistrict('');
        setQueryDistrict('');
    };

    return (
        <>
            <Head title='Data Kecamatan' />
            <ToastContainer />

            {/* Mobile */}
            {/* Sub Nav Mobile */}
            <div className='btm-nav sm:hidden'>
                <NavgroupRegionalMobile onClick={() => setShowModalImport(true)} />
            </div>

            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    villages.links[0].url ? (
                        <Link
                            href={`/admin/data-master/villages?page=${villages.current_page - 1}&search=${search}`}
                            preserveState>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    villages.links[villages.links.length - 1].url ? (
                        <Link
                            href={`/admin/data-master/villages?page=${villages.current_page + 1}&search=${search}`}
                            only={['villages']}
                            preserveState>
                            <IoPlayForward />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayForward />
                        </div>
                    )
                }
                page={
                    <>
                        {villages.current_page}/{villages.last_page}
                    </>
                }
                data={villages}
                hasFilter={true}
                showFilter={() => setShowModalFilter(true)}
            />
            <ContentMobile>
                {villages.data.map((village) => (
                    <VillageMobile village={village} key={village.id} />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                {/* Title, Pagination, Search */}
                <TitleDesktop>
                    <div className='my-auto w-6/12'>
                        <PrimaryButton className='py-3' onClick={() => setShowModalImport(true)}>
                            Import Kelurahan / Desa
                        </PrimaryButton>
                    </div>
                    <div className='w-1/12 text-end'>
                        <button className='p-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
                            <IoFilter />
                        </button>
                    </div>

                    <div className='w-3/12 border flex rounded-lg'>
                        <label htmlFor='search-input' className='my-auto ml-2'>
                            <IoSearchSharp />
                        </label>
                        <input
                            id='search-input'
                            name='search-input'
                            type='search'
                            placeholder='Cari Kecamatan'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={villages} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {villages.links[0].url ? (
                                <Link
                                    href={`/admin/data-master/villages?page=${villages.current_page - 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}${selectedRegency && `&regency=${selectedRegency.id}`}${selectedDistrict && `&district=${selectedDistrict.id}`}
                                                `}
                                    preserveState
                                    only={['villages']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {villages.current_page}/{villages.last_page}
                        </div>
                        <div className='my-auto'>
                            {villages.links[villages.links.length - 1].url ? (
                                <Link
                                    href={`/admin/data-master/villages?page=${villages.current_page + 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}${selectedRegency && `&regency=${selectedRegency.id}`}${selectedDistrict && `&district=${selectedDistrict.id}`}`}
                                    only={['villages']}
                                    preserveState>
                                    <IoPlayForward />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayForward />
                                </div>
                            )}
                        </div>
                    </div>
                </TitleDesktop>

                <div className='sm:flex hidden gap-5'>
                    <div className='w-11/12'>
                        <ContentDesktop>
                            <table className='table table-pin-rows table-pin-cols text-base'>
                                <thead className='text-base text-gray-900'>
                                    <tr className=''>
                                        <th className='bg-gray-200'>Kode</th>
                                        <th className='bg-gray-200'>Nama Desa / Kelurahan</th>
                                        <th className='bg-gray-200'>Nama Kecamatan</th>
                                        <th className='bg-gray-200'>Nama Kabupaten / Kota</th>
                                        <th className='bg-gray-200'>Nama Provinsi</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {villages.data.map((village, index) => (
                                        <VillageDesktop
                                            key={index}
                                            village={village}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </ContentDesktop>
                    </div>
                    <div className='w-1/12 text-end'>
                        <NavgroupRegional />
                    </div>
                </div>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Modal */}
            {/* Modal Import */}
            <Modal show={showModalImport} onClose={() => setShowModalImport(false)}>
                <form onSubmit={handleSubmitImport} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>Import Desa / Kelurahan</h2>

                    <div className='mt-6 '>
                        <div className='flex flex-col sm:flex-row w-full gap-1'>
                            <div className='sm:w-1/4 w-full my-auto'>File Desa / Kelurahan</div>
                            <div className='sm:w-3/4 w-full'>
                                <input
                                    type='file'
                                    className='file-input file-input-bordered file-input-sm w-full'
                                    value={undefined}
                                    onChange={handleInputFile}
                                />
                                {progress && (
                                    <progress value={progress.percentage} max='100'>
                                        {progress.percentage}%
                                    </progress>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowModalImport(false)}>Batal</SecondaryButton>

                        <PrimaryButton className='ms-3' disabled={processing}>
                            Import
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* Modal Import */}

            {/* Modal Filter */}
            <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
                <form onSubmit={handleFilter} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>Filter Desa</h2>

                    <div className='mt-6 space-y-2'>
                        <div className='flex w-full gap-1'>
                            <div className='w-3/12 my-auto'>Provinsi</div>
                            <div className='w-8/12'>
                                <GeneralSelectInput
                                    data={provinces}
                                    selected={selectedProvince}
                                    setSelected={setSelectedProvince}
                                    query={queryProvince}
                                    setQuery={setQueryProvince}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Provinsi'
                                />
                            </div>
                            <div className='w-1/12 my-auto'>
                                {selectedProvince && (
                                    <button className='p-2' onClick={handleDeleteProvinceFilter}>
                                        <IoTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='flex w-full gap-1'>
                            <div className='w-3/12 my-auto'>Kabupaten / Kota</div>
                            <div className='w-8/12'>
                                <GeneralSelectInput
                                    data={regencies}
                                    selected={selectedRegency}
                                    setSelected={setSelectedRegency}
                                    query={queryRegency}
                                    setQuery={setQueryRegency}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Kabupaten / Kota'
                                />
                            </div>
                            <div className='w-1/12 my-auto'>
                                {selectedRegency && (
                                    <button className='p-2' onClick={handleDeleteRegencyFilter}>
                                        <IoTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='flex w-full gap-1'>
                            <div className='w-3/12 my-auto'>Kecamatan</div>
                            <div className='w-8/12'>
                                <GeneralSelectInput
                                    data={districts}
                                    selected={selectedDistrict}
                                    setSelected={setSelectedDistrict}
                                    query={queryDistrict}
                                    setQuery={setQueryDistrict}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Kecamatan'
                                />
                            </div>
                            <div className='w-1/12 my-auto'>
                                {selectedDistrict && (
                                    <button className='p-2' onClick={handleDeleteDistrictFilter}>
                                        <IoTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

                        <PrimaryButton className='ms-3'>Filter</PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* Modal Filter */}
            {/* Modal */}
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Data Desa / Kelurahan</Header>}
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('admin.data-master')}>Data Master</Link>
                    </li>
                    <li>Data Desa / Kelurahan</li>
                </ul>
            </div>
        }
        children={page}
        user={page.props.auth.user}
        title='Data Desa / Kelurahan'
        backLink={
            <Link href={route('admin.data-master')}>
                <IoArrowBackOutline />
            </Link>
        }
    />
);
