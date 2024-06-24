import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ProvinceMobile from './Components/ProvinceMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import ProvinceDesktop from './Components/ProvinceDesktop';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import NavgroupRegional from '@/Components/NavgroupRegional';
import NavgroupRegionalMobile from '@/Components/NavgroupRegionalMobile';
import PageNumber from '@/Components/PageNumber';

export default function Index({ provinces, searchFilter }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');

    const { data, setData, post, progress, reset, processing } = useForm({
        province: '',
    });

    const [debounceValue] = useDebounce(search, 500);

    const prevSearch = usePrevious(search);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    const handleReloadPage = () => {
        router.reload({
            only: ['provinces'],
            data: {
                search,
            },
        });
    };

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleSubmitImport = (e) => {
        e.preventDefault();
        post(route('admin.data-master.province.post'), {
            onSuccess: () => {
                reset();
                setShowModalImport(false);
                toast.success(`Provinsi Berhasil Diimport`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
        });
    };

    const handleInputFile = (e) => {
        if (e.currentTarget.files) {
            setData('province', e.currentTarget.files[0]);
        }
    };
    return (
        <>
            <Head title='Data Provinsi' />
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
                    provinces.links[0].url ? (
                        <Link
                            href={`/admin/data-master/provinces?page=${provinces.current_page - 1}&search=${search}`}
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
                    provinces.links[provinces.links.length - 1].url ? (
                        <Link
                            href={`/admin/data-master/provinces?page=${provinces.current_page + 1}&search=${search}`}
                            only={['provinces']}
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
                        {provinces.current_page}/{provinces.last_page}
                    </>
                }
                data={provinces}
            />
            <ContentMobile>
                {provinces.data.map((province) => (
                    <ProvinceMobile province={province} key={province.id} />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                {/* Title, Pagination, Search */}
                <TitleDesktop>
                    <div className='my-auto w-7/12'>
                        <PrimaryButton className='py-3' onClick={() => setShowModalImport(true)}>
                            Import Provinsi
                        </PrimaryButton>
                    </div>
                    <div className='w-3/12 border flex rounded-lg'>
                        <label htmlFor='search-input' className='my-auto ml-2'>
                            <IoSearchSharp />
                        </label>
                        <input
                            id='search-input'
                            name='search-input'
                            type='search'
                            placeholder='Cari Provinsi'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={provinces} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {provinces.links[0].url ? (
                                <Link
                                    href={`/admin/data-master/provinces?page=${provinces.current_page - 1}&search=${search}`}
                                    preserveState>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {provinces.current_page}/{provinces.last_page}
                        </div>
                        <div className='my-auto'>
                            {provinces.links[provinces.links.length - 1].url ? (
                                <Link
                                    href={`/admin/data-master/provinces?page=${provinces.current_page + 1}&search=${search}`}
                                    only={['provinces']}
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
                                        <th className='bg-gray-200'>Nama Provinsi</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {provinces.data.map((province, index) => (
                                        <ProvinceDesktop
                                            key={index}
                                            province={province}
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
                    <h2 className='text-lg font-medium text-gray-900'>Import Provinsi</h2>

                    <div className='mt-6 '>
                        <div className='flex flex-col sm:flex-row w-full gap-1'>
                            <div className='sm:w-1/4 w-full my-auto'>File Provinsi</div>
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
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Data Provinsi</Header>}
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('admin.data-master')}>Data Master</Link>
                    </li>
                    <li>Data Provinsi</li>
                </ul>
            </div>
        }
        children={page}
        user={page.props.auth.user}
        title='Data Provinsi'
        backLink={
            <Link href={route('admin.data-master')}>
                <IoArrowBackOutline />
            </Link>
        }
    />
);
