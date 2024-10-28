import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    IoEllipsisVertical,
    IoAddOutline,
    IoChevronForward,
    IoCreateOutline,
    IoSearchOutline,
    IoAddCircleOutline,
    IoDocumentTextOutline,
    IoPersonAddOutline,
    IoTrashBinOutline,
    IoTrashOutline,
} from 'react-icons/io5';
import Header from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import { IoPencilOutline } from 'react-icons/io5';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeWarning from '@/Components/Badges/BadgeWarning';
import BadgeDanger from '@/Components/Badges/BadgeDanger';
import { usePrevious } from 'react-use';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { Menu } from '@headlessui/react';
import { FaMoneyBill1 } from 'react-icons/fa6';
import SuccessButton from '@/Components/SuccessButton';

export default function Index({ auth, organizations, searchFilter, affiliation }) {
    const { flash } = usePage().props;
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [organizationDelete, setOrganizationDelete] = useState({});

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const {
        data,
        setData,
        processing,
        delete: destroy,
        reset,
    } = useForm({
        user_id: '',
        user_name: '',
        organization_id: '',
        role: '',
    });

    const prevSearch = usePrevious(search);

    useEffect(() => {
        flash.success &&
            toast.success(flash.success, {
                position: toast.POSITION.TOP_CENTER,
            });
        flash.error &&
            toast.error(flash.error, {
                position: toast.POSITION.TOP_CENTER,
            });
    }, []);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleSearch();
        }
    }, [debounceValue]);

    const handleSearch = (_) => {
        router.reload({
            only: ['organizations'],
            data: {
                search,
            },
        });
    };

    const handleShowDelete = (organization) => {
        setOrganizationDelete(organization);
        setData({
            user_id: auth.user.id,
            organization_id: organization.id,
        });
        setShowDeleteConfirmation(true);
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        destroy(route('organization.share-to-other.delete', organizationDelete.id), {
            onSuccess: () => {
                toast.success(`Tautan Anda dan Organisasi Berhasil Dihapus`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                setShowDeleteConfirmation(false);
                reset();
            },
        });
    };

    return (
        <>
            <Head title='Organization' />

            <ToastContainer />

            <div className='min-h-screen bg-gray-100'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <Header>
                        <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
                            <div className='sm:p-6 px-6 py-3 text-gray-800 flex-none sm:flex'>
                                <div className='sm:hidden text-gray-800 flex flex-col-reverse gap-5'>
                                    <div className='my-auto'>Daftar Organisasi / Bisnis</div>
                                    <div className='flex flex-row-reverse text-end'>
                                        <div>
                                            <div className='text-gray-400 text-sm'>{auth.user.name}</div>
                                            <div className=' text-xs text-green-400'>{auth.user.email}</div>
                                        </div>
                                        <div className='my-auto text-gray-400'>
                                            <Link href='/profile'>
                                                <IoPencilOutline />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='sm:flex-1 my-auto sm:block hidden'>Daftar Organisasi / Bisnis</div>
                                <div className='sm:flex-1 sm:block hidden text-end text-gray-800'>
                                    <div className='flex flex-row-reverse'>
                                        <div>
                                            <div className='text-gray-400'>{auth.user.name}</div>

                                            <div className=' text-sm text-green-400'>{auth.user.email}</div>
                                        </div>
                                        <div className='my-auto text-gray-400'>
                                            <Link href='/profile'>
                                                <IoPencilOutline />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Header>

                    <div className='bg-white shadow-sm'>
                        <div className='py-3 px-6 text-gray-900 flex-none sm:flex sm:flex-row-reserve sm:gap-2'>
                            <div className='sm:flex-1 my-auto'>
                                <TextInput
                                    value={search ?? ''}
                                    placeholder='Cari Organisasi'
                                    type='search'
                                    className='w-full'
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className='sm:flex-1 my-auto text-end hidden md:block'>
                                {/* Desktop */}
                                <div className='flex justify-end gap-3'>
                                    {affiliation && (
                                        <div>
                                            <Link href={route('affiliation.index', affiliation.id)}>
                                                <SuccessButton className='gap-2'>
                                                    <FaMoneyBill1 /> Afiliasi
                                                </SuccessButton>
                                            </Link>
                                        </div>
                                    )}

                                    <div>
                                        <Link href='/organizations/create'>
                                            <PrimaryButton>Tambah Organisasi</PrimaryButton>
                                        </Link>
                                    </div>
                                </div>
                                {/* End Desktop */}
                            </div>
                            <div className='md:hidden flex fixed left-2 bottom-2'>
                                {/* Mobile */}
                                <div>
                                    <Link
                                        className={'btn btn-circle bg-gray-800 text-white'}
                                        href='/organizations/create'>
                                        <div className='text-xl font-bold'>
                                            <IoAddOutline height={20} width={20} />
                                        </div>
                                    </Link>
                                </div>
                                {affiliation && (
                                    <div>
                                        <Link
                                            className={'btn btn-circle bg-green-800 text-white'}
                                            href={route('affiliation.index', affiliation.id)}>
                                            <div className='text-xl font-bold'>
                                                <FaMoneyBill1 height={20} width={20} />
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* End Mobile */}
                            </div>
                        </div>
                    </div>

                    {/* Desktop */}
                    <div className='hidden md:block'>
                        {/* Table */}
                        {/* Table Header */}
                        <div className='bg-white overflow-hidden shadow-sm'>
                            <div className='py-3 px-6 text-gray-800 flex text-lg font-bold border-b-2 border-gray-700'>
                                <div className='w-6/12'>Nama Organisasi</div>
                                <div className='w-3/12'>Kadaluarsa</div>
                                <div className='w-3/12'>Status</div>
                                <div className='w-1/12'></div>
                            </div>
                        </div>
                        {/* End Table Header */}

                        {/* Table Body */}
                        <div className='overflow-auto h-[23rem]'>
                            {organizations.length < 1 ? (
                                <div className='bg-white overflow-hidden shadow-sm border-b'>
                                    <div className='py-3 px-6 text-gray-800 flex'>
                                        <div className='w-full text-center italic'>Tidak Ada Data</div>
                                    </div>
                                </div>
                            ) : (
                                organizations.map((organization, index) => (
                                    <div className='bg-white shadow-sm border-b' key={index}>
                                        <div className='py-3 px-6 text-gray-800 flex relative'>
                                            {organization.users[0].pivot.is_waiting ? (
                                                <div className='absolute top-0'>
                                                    <div className='text-xs bg-orange-600 text-white px-1 rounded-sm'>
                                                        Permintaan Tautan Organisasi
                                                    </div>
                                                </div>
                                            ) : (
                                                ''
                                            )}

                                            <div className='w-6/12 my-auto'>{organization.name}</div>
                                            <div className='w-3/12 my-auto'>{organization.expired}</div>
                                            <div className={`w-3/12 my-auto`}>
                                                {organization.status == 'trial' && <BadgeWarning>Trial</BadgeWarning>}
                                                {organization.status == 'active' && <BadgeSuccess>Aktif</BadgeSuccess>}
                                                {organization.status == 'deactive' && (
                                                    <BadgeDanger>Tidak Aktif</BadgeDanger>
                                                )}
                                            </div>
                                            <div className='w-1/12 my-auto'>
                                                <div className='dropdown dropdown-left'>
                                                    <div tabIndex={0} role='button' className='bg-inherit border-none '>
                                                        <IoEllipsisVertical />
                                                    </div>
                                                    <ul
                                                        tabIndex={0}
                                                        className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                                                        {organization.users[0].pivot.is_waiting ? (
                                                            <li className='flex justify-between flex-row'>
                                                                <div className='bg-green-600 hover:bg-green-400 text-white'>
                                                                    <Link
                                                                        href={route(
                                                                            'organization.share-to-other.patch.confirmation',
                                                                            organization.id
                                                                        )}
                                                                        as='button'
                                                                        method='patch'
                                                                        data={{
                                                                            confirm: true,
                                                                            user_id: auth.user.id,
                                                                            organization_id: organization.id,
                                                                            is_waiting: false,
                                                                        }}>
                                                                        Terima
                                                                    </Link>
                                                                </div>
                                                                <div className='bg-red-600 hover:bg-red-400 text-white'>
                                                                    <Link
                                                                        href={route(
                                                                            'organization.share-to-other.patch.confirmation',
                                                                            organization.id
                                                                        )}
                                                                        as='button'
                                                                        method='patch'
                                                                        data={{
                                                                            confirm: false,
                                                                            user_id: auth.user.id,
                                                                            organization_id: organization.id,
                                                                            is_waiting: false,
                                                                        }}>
                                                                        Tolak
                                                                    </Link>
                                                                </div>
                                                            </li>
                                                        ) : (
                                                            <>
                                                                <li>
                                                                    <Link href={`/dashboard/${organization.id}`}>
                                                                        <IoChevronForward />
                                                                        Buka
                                                                    </Link>
                                                                </li>
                                                                {organization.users[0].pivot.role == 'admin' ? (
                                                                    <>
                                                                        <li>
                                                                            <Link
                                                                                href={`/organizations/${organization.id}/edit`}>
                                                                                <IoCreateOutline />
                                                                                Ubah
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={`/organizations/${organization.id}`}>
                                                                                <IoSearchOutline /> Detail
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={`/organizations/${organization.id}/invoices/create`}>
                                                                                <IoAddCircleOutline /> Berlangganan
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={`/organizations/${organization.id}/invoices`}>
                                                                                <IoDocumentTextOutline /> Invoice
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link
                                                                                href={`/organizations/${organization.id}/share-to-other`}>
                                                                                <IoPersonAddOutline /> Tautkan Pengguna
                                                                            </Link>
                                                                        </li>
                                                                    </>
                                                                ) : (
                                                                    <li>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleShowDelete(organization)
                                                                            }>
                                                                            <IoTrashOutline />
                                                                            Hapus Tautan
                                                                        </button>
                                                                    </li>
                                                                )}
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* End Table Body */}
                        {/* End Table */}
                    </div>
                    {/* End Desktop */}

                    {/* Mobile */}
                    <div className='block md:hidden border-gray-100 border-y-2 mb-14 h-[100px]'>
                        {organizations.map((organization, index) => (
                            <div className='bg-white shadow-sm px-6 py-3 flex relative' key={index}>
                                {organization.users[0].pivot.is_waiting ? (
                                    <div className='absolute top-0 right-6'>
                                        <div className='text-xs bg-orange-600 text-white px-1 rounded-sm'>
                                            Permintaan Tautan Organisasi
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className='w-11/12'>
                                    <div className='text-gray-800 font-bold'>{organization.name}</div>
                                    <div className='text-sm text-gray-600'>Kadaluarsa : {organization.expired}</div>
                                    <div className={`text-sm`}>
                                        {organization.status == 'trial' && <BadgeWarning>Trial</BadgeWarning>}
                                        {organization.status == 'active' && <BadgeSuccess>Aktif</BadgeSuccess>}
                                        {organization.status == 'deactive' && <BadgeDanger>Tidak Aktif</BadgeDanger>}
                                    </div>
                                </div>
                                <div className='my-auto'>
                                    <div className='dropdown dropdown-left'>
                                        <div tabIndex={0} role='button' className='bg-inherit border-none '>
                                            <IoEllipsisVertical />
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className='dropdown-content z-[1] menu p-2 bg-base-100 rounded-box w-52 border-1 border-gray-900 shadow'>
                                            {organization.users[0].pivot.is_waiting ? (
                                                <li className='flex justify-between flex-row'>
                                                    <div className='bg-green-600 hover:bg-green-400 text-white'>
                                                        <Link
                                                            href={route(
                                                                'organization.share-to-other.patch.confirmation',
                                                                organization.id
                                                            )}
                                                            as='button'
                                                            method='patch'
                                                            data={{
                                                                confirm: true,
                                                                user_id: auth.user.id,
                                                                organization_id: organization.id,
                                                                is_waiting: false,
                                                            }}>
                                                            Terima
                                                        </Link>
                                                    </div>
                                                    <div className='bg-red-600 hover:bg-red-400 text-white'>
                                                        <Link
                                                            href={route(
                                                                'organization.share-to-other.patch.confirmation',
                                                                organization.id
                                                            )}
                                                            as='button'
                                                            method='patch'
                                                            data={{
                                                                confirm: false,
                                                                user_id: auth.user.id,
                                                                organization_id: organization.id,
                                                                is_waiting: false,
                                                            }}>
                                                            Tolak
                                                        </Link>
                                                    </div>
                                                </li>
                                            ) : (
                                                <>
                                                    <li>
                                                        <Link href={`/dashboard/${organization.id}`}>
                                                            <IoChevronForward />
                                                            Buka
                                                        </Link>
                                                    </li>
                                                    {organization.users[0].pivot.role == 'admin' ? (
                                                        <>
                                                            <li>
                                                                <Link href={`/organizations/${organization.id}/edit`}>
                                                                    <IoCreateOutline />
                                                                    Ubah
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href={`/organizations/${organization.id}`}>
                                                                    <IoSearchOutline /> Detail
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    href={`/organizations/${organization.id}/invoices/create`}>
                                                                    <IoAddCircleOutline /> Berlangganan
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    href={`/organizations/${organization.id}/invoices`}>
                                                                    <IoDocumentTextOutline /> Invoice
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    href={`/organizations/${organization.id}/share-to-other`}>
                                                                    <IoPersonAddOutline /> Tautkan Pengguna
                                                                </Link>
                                                            </li>
                                                        </>
                                                    ) : (
                                                        <li>
                                                            <button onClick={() => handleShowDelete(organization)}>
                                                                <IoTrashOutline />
                                                                Hapus Tautan
                                                            </button>
                                                        </li>
                                                    )}
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* End Mobile */}
                </div>
            </div>

            {/* Modal */}
            {/* Modal Delete */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form onSubmit={handleSubmitDelete} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>Konfirmasi Hapus Penautan</h2>

                    <div className='mt-6 space-y-2'>
                        <div className='text-center'>
                            Apakah Anda Yakin Menghapus Tautan Dengan{' '}
                            <span className='font-bold'>{organizationDelete?.name?.toUpperCase()}</span> ?
                        </div>

                        <div className='mt-10 py-10 sm:mx-3 flex flex-col-reverse justify-center sm:flex-row sm:justify-end'>
                            <div className='text-center'>
                                <SecondaryButton
                                    className='w-full mt-2 sm:mt-0'
                                    onClick={() => setShowDeleteConfirmation(false)}>
                                    <div className='text-center w-full'>Batal</div>
                                </SecondaryButton>
                            </div>

                            <div className='text-center'>
                                <DangerButton className='sm:ms-3 w-full' disabled={processing} type={'submit'}>
                                    <div className='text-center w-full'>Hapus Tautan</div>
                                </DangerButton>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
            {/* Modal Delete */}
            {/* Modal */}
        </>
    );
}
