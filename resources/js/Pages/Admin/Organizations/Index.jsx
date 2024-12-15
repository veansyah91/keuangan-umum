import React, { useEffect, useState } from 'react';
import {
    IoArrowBackOutline,
    IoFilter,
    IoPlayBack,
    IoPlayForward,
    IoSearchSharp,
} from 'react-icons/io5';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import Datepicker from 'react-tailwindcss-datepicker';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import OrganizationMobile from './Components/OrganizationMobile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import OrganizationDesktop from './Components/OrganizationDesktop';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import PageNumber from '@/Components/PageNumber';

export default function Index({ organizations, searchFilter, statusFilter, startDate, endDate }) {
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [dateValue, setDateValue] = useState({
        startDate: startDate || '',
        endDate: endDate || '',
    });

    // filter
    const [dataFilter, setDataFilter] = useState({
        status: statusFilter || '',
    });

    // update
    const [organizationEdit, setOrganizationEdit] = useState({
        id: '',
        name: '',
        status: '',
    });

    const { data, setData, processing, patch, reset } = useForm({
        status: '',
    });

    const [debounceValue] = useDebounce(search, 500);
    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevSearch = usePrevious(search);

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setShowModalFilter(false);
        handleReloadPage();
    };

    const handleReloadPage = () => {
        router.reload({
            only: ['organizations'],
            data: {
                search,
                start_date: dateValue.startDate,
                end_date: dateValue.endDate,
                status: dataFilter.status,
            },
        });
    };

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue, debounceDateValue]);

    const handleSelectOrganizationEdit = (organization) => {
        setShowModalUpdate(true);
        setOrganizationEdit({
            id: organization.id,
            name: organization.name,
            status: organization.status,
        });
    };

    const updateOrganization = (e) => {
        e.preventDefault();
        patch(route('admin.organization.update.status', organizationEdit.id), {
            onSuccess: () => {
                setShowModalUpdate(false);
                toast.success(`Status ${organizationEdit.name} Berhasil Diubah`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                reset();
            },
        });
    };

    return (
        <>
            <Head title='Daftar Organisasi' />
            <ToastContainer />

            {/* Mobile */}
            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    organizations.links[0].url ? (
                        <Link
                            href={`/admin/data-master/organizations?page=${organizations.current_page - 1}&search=${search}`}
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
                    organizations.links[organizations.links.length - 1].url ? (
                        <Link
                            href={`/admin/data-master/organizations?page=${organizations.current_page + 1}&search=${search}`}
                            only={['organizations']}
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
                        {organizations.current_page}/{organizations.last_page}
                    </>
                }
                data={organizations}
                hasFilter={true}
                showFilter={() => setShowModalFilter(true)}
                hasDate={true}
                dateValue={dateValue}
                onChangeDate={handleDateValueChange}
            />

            <ContentMobile>
                {organizations.data.map((organization) => (
                    <OrganizationMobile
                        organization={organization}
                        key={organization.id}
                        handleEdit={() => handleSelectOrganizationEdit(organization)}
                    />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                {/* Title, Pagination, Search */}
                <TitleDesktop>
                    <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
                        <IoFilter />
                    </button>
                    <div className='w-1/4 my-auto '>
                        <Datepicker
                            value={dateValue}
                            onChange={handleDateValueChange}
                            showShortcuts={true}
                            configs={{
                                shortcuts: {
                                    today: 'Hari Ini',
                                    yesterday: 'Kemarin',
                                    past: (period) => `${period} Hari Terakhir`,
                                    currentMonth: 'Bulan Ini',
                                    pastMonth: 'Bulan Lalu',
                                    currentYear: 'Tahun Ini',
                                },
                            }}
                            classNames={'border-2'}
                            separator={' s.d '}
                        />
                    </div>

                    <div className='w-1/4 border flex rounded-lg'>
                        <label htmlFor='search-input' className='my-auto ml-2'>
                            <IoSearchSharp />
                        </label>
                        <input
                            id='search-input'
                            name='search-input'
                            type='search'
                            placeholder='Cari Organisasi'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto text-center w-1/12'>
                        <PageNumber data={organizations} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {organizations.links[0].url ? (
                                <Link
                                    href={`/admin/organizations?page=${organizations.current_page - 1}&start_date=${dateValue.startDate}&end_date=${dateValue.endDate}&status=${dataFilter.status}`}
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
                            {organizations.current_page}/{organizations.last_page}
                        </div>
                        <div className='my-auto'>
                            {organizations.links[organizations.links.length - 1].url ? (
                                <Link
                                    href={`/admin/organizations?page=${organizations.current_page + 1}&start_date=${dateValue.startDate}&end_date=${dateValue.endDate}&status=${dataFilter.status}`}
                                    only={['organizations']}
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

                {/* Data */}
                <ContentDesktop>
                    <table className='table table-pin-rows table-pin-cols text-base'>
                        <thead className='text-base text-gray-900'>
                            <tr className=''>
                                <th className='bg-gray-200'>Nama</th>
                                <th className='bg-gray-200'>Alamat</th>
                                <th className='bg-gray-200'>Kadaluarsa</th>
                                <th className='bg-gray-200'>Status</th>
                                <th className='bg-gray-200'>Dibuat Tanggal</th>
                                <th className='bg-gray-200'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizations.data.map((organization, index) => (
                                <OrganizationDesktop
                                    key={index}
                                    organization={organization}
                                    className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                    handleEdit={() => handleSelectOrganizationEdit(organization)}
                                />
                            ))}
                        </tbody>
                    </table>
                </ContentDesktop>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Modal Filter */}
            <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
                <form onSubmit={handleFilter} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>Filter Organisasi</h2>

                    <div className='mt-6 '>
                        <div className='flex w-full gap-1'>
                            <div className='w-1/4 my-auto'>Status</div>
                            <div className='w-3/4'>
                                <select
                                    className='select select-bordered w-full max-w-xs'
                                    onChange={(e) => setDataFilter({ status: e.target.value })}
                                    value={dataFilter.status}>
                                    <option value=''>Semua</option>
                                    <option value='trial'>Masa Uji Coba</option>
                                    <option value='active'>Aktif</option>
                                    <option value='deactive'>Tidak Aktif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

                        <PrimaryButton
                            className='ms-3'
                            // disabled={processing}
                        >
                            Filter
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit */}
            <Modal show={showModalUpdate} onClose={() => setShowModalUpdate(false)}>
                <form onSubmit={updateOrganization} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>Ubah Status {organizationEdit.name}</h2>

                    <div className='mt-6 '>
                        <div className='mb-2'>Pilih Status</div>
                        <div className='space-y-2'>
                            <div className='space-x-2'>
                                <input
                                    type='radio'
                                    name='radio-1'
                                    id='trial'
                                    className='radio my-auto focus:text-gray-900'
                                    defaultChecked={organizationEdit.status == 'trial'}
                                    onChange={() => setData({ status: 'trial' })}
                                />
                                <label htmlFor='trial' className='my-auto'>
                                    Masa Uji Coba
                                </label>
                            </div>
                            <div className='space-x-2'>
                                <input
                                    type='radio'
                                    name='radio-1'
                                    id='active'
                                    className='radio my-auto focus:text-gray-900'
                                    defaultChecked={organizationEdit.status == 'active'}
                                    onChange={() => setData({ status: 'active' })}
                                />
                                <label htmlFor='active' className='my-auto'>
                                    Aktif
                                </label>
                            </div>
                            <div className='space-x-2'>
                                <input
                                    type='radio'
                                    name='radio-1'
                                    id='deactive'
                                    className='radio my-auto focus:text-gray-900'
                                    defaultChecked={organizationEdit.status == 'deactive'}
                                    onChange={() => setData({ status: 'deactive' })}
                                />
                                <label htmlFor='deactive' className='my-auto'>
                                    Tidak Aktif
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowModalUpdate(false)}>Batal</SecondaryButton>

                        <PrimaryButton className='ms-3' disabled={processing}>
                            Ubah
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Daftar Organisasi</Header>}
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('admin.organization.menu')}>Organisasi</Link>
                    </li>
                    <li>Daftar Organisasi</li>
                </ul>
            </div>
        }
        children={page}
        user={page.props.auth.user}
        title='Daftar Organisasi'
        backLink={
            <Link href={route('admin.organization.menu')}>
                <IoArrowBackOutline />
            </Link>
        }
    />
);
