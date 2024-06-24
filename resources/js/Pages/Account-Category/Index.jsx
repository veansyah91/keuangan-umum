import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import PageNumber from '@/Components/PageNumber';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import AccountCategoryMobile from './Components/AccountCategoryMobile';
import AddButtonMobile from '@/Components/AddButtonMobile';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import AccountCategoryDesktop from './Components/AccountCategoryDesktop';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { usePrevious } from 'react-use';

export default function Index({ organization, accountCategories, role, searchFilter }) {
    // State
    const [showSearch, setShowSearch] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const [isEdit, setIsEdit] = useState(false);
    const [id, setId] = useState('');
    const [modalInputTitle, setModalInputTitle] = useState('Tambah Kategori Akun');
    const [modalSubmitLabel, setModalSubmitLabel] = useState('Tambah');

    const prevSearch = usePrevious(search);

    const {
        data,
        setData,
        reset,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        setError,
    } = useForm({
        name: '',
        code: '',
    });

    // useState
    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    // Function
    const handleShowInputModal = () => {
        setModalInputTitle('Tambah Kategori Akun');
        setModalSubmitLabel('Tambah');
        setIsEdit(false);
        setShowInputModal(true);
        reset();
        setError({
            code: '',
            name: '',
        });
    };

    const handleEdit = (category) => {
        setIsEdit(true);
        setShowInputModal(true);
        setModalInputTitle('Ubah Kategori Akun');
        setModalSubmitLabel('Ubah');
        setId(category.id);
        setError({
            code: '',
            name: '',
        });
        setData({
            name: category.name,
            code: category.code,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        isEdit
            ? patch(
                  route('data-ledger.account-category.patch', { organization: organization.id, accountCategory: id }),
                  {
                      onSuccess: () => {
                          setShowInputModal(false);
                          toast.success(`Kategori Akun Berhasil Diubah`, {
                              position: toast.POSITION.TOP_CENTER,
                          });
                          reset();
                      },
                  }
              )
            : post(route('data-ledger.account-category.post', organization.id), {
                  onSuccess: () => {
                      setShowInputModal(false);
                      toast.success(`Kategori Akun Berhasil Ditambah`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                      reset();
                  },
              });
    };

    const handleDelete = (accountCategory) => {
        setId(accountCategory.id);
        setShowDeleteConfirmation(true);
        setData({
            name: accountCategory.name,
            code: accountCategory.code,
        });
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        destroy(route('data-ledger.account-category.delete', { organization: organization.id, accountCategory: id }), {
            onSuccess: () => {
                setShowDeleteConfirmation(false);
                toast.success(`Kategori Akun Berhasil Dihapus`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                reset();
            },
            onError: (errors) => {
                setShowDeleteConfirmation(false);
                toast.error(errors.account_used, {
                    position: toast.POSITION.TOP_CENTER,
                });
                reset();
            },
        });
    };

    const handleCancelInput = () => {
        setShowInputModal(false);
    };

    const handleReloadPage = () => {
        router.reload({
            only: ['accountCategories'],
            data: {
                search,
            },
        });
    };

    return (
        <>
            {/* Mobile */}
            <Head title='Data Kategori Akun' />
            <ToastContainer />

            {role !== 'viewer' && <AddButtonMobile handleShowInputModal={handleShowInputModal} />}
            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    accountCategories.links[0].url ? (
                        <Link
                            href={`/data-ledger/${organization.id}/account-categories?page=${accountCategories.current_page - 1}&search=${search}`}
                            preserveState
                            only={['accountCategories']}>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    accountCategories.links[accountCategories.links.length - 1].url ? (
                        <Link
                            href={`/data-ledger/${organization.id}/account-categories?page=${accountCategories.current_page + 1}&search=${search}`}
                            only={['accountCategories']}
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
                        {accountCategories.current_page}/{accountCategories.last_page}
                    </>
                }
                data={accountCategories}
            />
            <ContentMobile>
                {accountCategories.data.map((category) => (
                    <AccountCategoryMobile
                        category={category}
                        key={category.id}
                        handleDelete={() => handleDelete(category)}
                        role={role}
                    />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                {/* Title, Pagination, Search */}
                <TitleDesktop>
                    <div className='my-auto w-7/12'>
                        {role !== 'viewer' && (
                            <PrimaryButton className='py-3' onClick={handleShowInputModal}>
                                Tambah Data
                            </PrimaryButton>
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
                            placeholder='Cari Kategori Akun'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={accountCategories} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {accountCategories.links[0].url ? (
                                <Link
                                    href={`/data-ledger/${organization.id}/account-categories?page=${accountCategories.current_page - 1}&search=${search}`}
                                    preserveState
                                    only={['accountCategories']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {accountCategories.current_page}/{accountCategories.last_page}
                        </div>
                        <div className='my-auto'>
                            {accountCategories.links[accountCategories.links.length - 1].url ? (
                                <Link
                                    href={`/data-ledger/${organization.id}/account-categories?page=${accountCategories.current_page + 1}&search=${search}`}
                                    only={['accountCategories']}
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
                                        <th className='bg-gray-200'>Kode</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountCategories.data.map((category, index) => (
                                        <AccountCategoryDesktop
                                            key={index}
                                            category={category}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                            handleEdit={() => handleEdit(category)}
                                            handleDelete={() => handleDelete(category)}
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
            <Modal show={showInputModal} onClose={handleCancelInput}>
                <form onSubmit={handleSubmit} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>{modalInputTitle}</h2>

                    <div className='mt-5 '>
                        <div className='flex flex-col sm:flex-row w-full gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel htmlFor='name' value='Kode' className='mx-auto my-auto' />
                            </div>

                            <div className='sm:w-2/3 w-full'>
                                <TextInput
                                    id='code'
                                    type='text'
                                    name='code'
                                    value={data.code}
                                    className={`mt-1 w-full ${errors && errors.code && 'border-red-500'}`}
                                    isFocused={true}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder='Kode Kategori Akun'
                                />
                                {errors && errors.code && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.code}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel htmlFor='name' value='Nama' className='mx-auto my-auto' />
                            </div>

                            <div className='sm:w-2/3 w-full'>
                                <TextInput
                                    id='name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    className={`mt-1 w-full ${errors && errors.name && 'border-red-500'}`}
                                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                    placeholder='Nama Kategori Akun'
                                />
                                {errors && errors.name && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.name}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={handleCancelInput}>Batal</SecondaryButton>

                        <PrimaryButton className='ms-3' disabled={processing}>
                            {modalSubmitLabel}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form onSubmit={handleSubmitDelete} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900 text-center'>
                        <div>Hapus Kategori Akun</div>
                        <div>
                            {data.name} ({data.code})
                        </div>
                    </h2>

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
        header={<Header>Data Kategori Akun</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Data Kategori Akun'
        backLink={
            <Link href={route('data-ledger', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('data-ledger', page.props.organization.id)}>Buku Besar</Link>
                    </li>
                    <li>Data Kategori Akun</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
