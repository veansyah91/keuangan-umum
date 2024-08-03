import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import { usePrevious } from 'react-use';
import StudentMonthlyPaymentMobile from './Components/StudentMonthlyPaymentMobile';
import StudentMonthlyPaymentDesktop from './Components/StudentMonthlyPaymentDesktop';

export default function Index({ role, organization, payments, searchFilter }) {
    console.log(payments);
    
    // State
    const { errors } = usePage().props;

    const [showSearch, setShowSearch] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [titleDeleteModal, setTitleDeleteModal] = useState('');
    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        id: 0,
    });

    const prevSearch = usePrevious(search);
    const [debounceValue] = useDebounce(search, 500);

    // useState
    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    useEffect(() => {
        errors && 
        toast.error(errors.message, {
            position: toast.POSITION.TOP_CENTER,
        });
    },[]);

    //function
    const handleReloadPage = () => {
        router.reload({
            only: ['payments'],
            data: {
                search,
            },
        });
    };
    const handleDelete = (payment) => {
        setTitleDeleteModal(`Hapus Siswa ${payment.name}`);
        setShowDeleteConfirmation(true);
        setData('id', payment.id);
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();

        destroy(route('data-master.students.destroy', { organization: organization.id, payment: data.id }), {
            onSuccess: () => {
                setShowDeleteConfirmation(false);
                toast.success(`Siswa Berhasil Dihapus`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                reset();
            },
            onError: (error) => {
                setShowDeleteConfirmation(false);
                toast.error(error.message, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
        });
    };

    return (
        <>
            {/* Mobile */}
            <Head title='Pembayaran Iuran Siswa' />
            <ToastContainer />

            {role !== 'viewer' && (
                <Link href={route('cashflow.student-monthly-payment.create', organization.id)}>
                    <AddButtonMobile label={'Tambah'} />
                </Link>
            )}
            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    payments.links[0].url ? (
                        <Link
                            href={`/data-ledger/${organization.id}/payments?page=${payments.current_page - 1}&search=${search}`}
                            preserveState
                            only={['payments']}>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    payments.links[payments.links.length - 1].url ? (
                        <Link
                            href={`/data-ledger/${organization.id}/payments?page=${payments.current_page + 1}&search=${search}`}
                            only={['payments']}
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
                        {payments.current_page}/{payments.last_page}
                    </>
                }
                data={payments}
            />
            <ContentMobile>
                {payments.data.map((payment) => (
                    <StudentMonthlyPaymentMobile
                        payment={payment}
                        key={payment.id}
                        handleDelete={() => handleDelete(payment)}
                        role={role}
                    />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                <TitleDesktop>
                    <div className='my-auto w-7/12'>
                        {role !== 'viewer' && (
                            <div className='space-x-2'>
                                <Link href={route('cashflow.student-monthly-payment.create', organization.id)}>
                                    <PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className='w-3/12 border flex rounded-lg'>
                        <label htmlFor='search-input' className='my-auto ml-2'>
                            <IoSearchSharp />
                        </label>
                        <input
                            id='search-input'
                            name='search-input'
                            type='search'
                            placeholder='Cari Siswa'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={payments} />
                    </div>
                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {payments.links[0].url ? (
                                <Link
                                    href={`/admin/data-ledger/${organization.id}/payments?page=${payments.current_page - 1}&search=${search}`}
                                    preserveState
                                    only={['payments']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {payments.current_page}/{payments.last_page}
                        </div>
                        <div className='my-auto'>
                            {payments.links[payments.links.length - 1].url ? (
                                <Link
                                    href={`/admin/data-ledger/${organization.id}/payments?page=${payments.current_page + 1}&search=${search}`}
                                    only={['payments']}
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
                    <div className='w-full'>
                        <ContentDesktop>
                            <table className='table table-pin-rows table-pin-cols text-base'>
                                <thead className='text-base text-gray-900'>
                                    <tr className=''>
                                        <th className='bg-gray-200'>Nama</th>
                                        <th className='bg-gray-200'>Kelas (Tahun Ajaran)</th>
                                        <th className='bg-gray-200'>Alamat</th>
                                        <th className='bg-gray-200'>Status</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.data.map((payment, index) => (
                                        <StudentMonthlyPaymentDesktop
                                            key={index}
                                            payment={payment}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                            handleDelete={() => handleDelete(payment)}
                                            role={role}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </ContentDesktop>
                    </div>
                </div>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Modal */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form onSubmit={handleSubmitDelete} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900 text-center'>{titleDeleteModal}</h2>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowDeleteConfirmation(false)}>Batal</SecondaryButton>

                        <DangerButton className='ms-3' disabled={processing}>
                            Hapus
                        </DangerButton>
                    </div>
                </form>
            </Modal>
            {/* Modal */}
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Pembayaran Iuran Siswa</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Pembayaran Iuran Siswa'
        backLink={
            <Link href={route('data-master', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('data-master', page.props.organization.id)}>Data Master</Link>
                    </li>
                    <li>Pembayaran Iuran Siswa</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
