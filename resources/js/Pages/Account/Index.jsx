import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import AccountMobile from './Components/AccountMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import AccountDesktop from './Components/AccountDesktop';
import DangerButton from '@/Components/DangerButton';

export default function Index({
    organization,
    accounts,
    role,
    accountCategories,
    code,
    searchFilter,
    accountCategoryFilter,
    selectedAccountCategoryFilter,
}) {
    const accountCategoriesData = accountCategories;
    const [filteredAccountCategories, setFilteredAccountCategories] = useState(accountCategoriesData);

    // State
    const [showSearch, setShowSearch] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const [isEdit, setIsEdit] = useState(false);
    const [id, setId] = useState('');
    const [modalInputTitle, setModalInputTitle] = useState('Tambah Akun');
    const [modalSubmitLabel, setModalSubmitLabel] = useState('Tambah');

    // account categories select
    const [selectedAccountCategory, setSelectedAccountCategory] = useState({
        id: null,
        name: '',
        code: '',
    });
    const [queryAccountCategory, setQueryAccountCategory] = useState('');

    const [tempData, setTempData] = useState({
        selectedAccountCategoryId: null,
        code: '',
    });

    // prev data
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
        account_category_id: selectedAccountCategoryFilter || '',
        name: '',
        code: '',
        is_cash: false,
        is_active: true,
    });

    // useEffect
    useEffect(() => {
        const tempData =
            queryAccountCategory === ''
                ? accountCategoriesData
                : accountCategoriesData.filter((accountCategoryData) =>
                      accountCategoryData.name
                          .toLowerCase()
                          .replace(/\s+/g, '')
                          .includes(queryAccountCategory.toLowerCase().replace(/\s+/g, ''))
                  );

        setFilteredAccountCategories(tempData);
    }, [queryAccountCategory]);

    useEffect(() => {
        if (prevSearch !== undefined) {
            getNewRef();
        }
    }, [selectedAccountCategory]);

    useEffect(() => {
        if (prevSearch !== undefined) {
            reloadPage();
        }
    }, [debounceValue]);

    // function
    const getNewRef = () => {
        router.reload({
            only: ['code'],
            data: {
                selectedAccountCategory: selectedAccountCategory?.id,
            },
            onSuccess: (page) => {
                setData({
                    ...data,
                    code:
                        tempData.selectedAccountCategoryId == selectedAccountCategory?.id
                            ? tempData.code
                            : page.props.code.toString(),
                    account_category_id: selectedAccountCategory?.id,
                    is_cash: !isEdit && parseInt(page.props.code) < 120000000 ? true : false,
                });
            },
            preserveState: true,
        });
    };

    const reloadPage = () => {
        router.reload({
            only: ['accounts'],
            data: {
                search,
            },
        });
    };

    const handleEdit = (account) => {        
        setSelectedAccountCategory({
            id: account.account_category_id,
            name: account.account_category.name,
            code: account.account_category.code,
        });
        setQueryAccountCategory(account.account_category.name);
        setModalInputTitle('Ubah Akun');
        setModalSubmitLabel('Ubah');
        setIsEdit(true);
        setId(account.id);
        setTempData({
            selectedAccountCategoryId: account.account_category_id,
            code: account.code,
        });
        setData({
            account_category_id: account.account_category_id,
            name: account.name,
            code: account.code,
            is_cash: account.is_cash,
            is_active: account.is_active,
        });
        setShowInputModal(true);
    };

    const handleShowInputModal = () => {
        setModalInputTitle('Tambah Akun');
        setModalSubmitLabel('Tambah');
        setIsEdit(false);
        reset();
        setTempData({
            selectedAccountCategoryId: null,
            code: '',
        });
        setQueryAccountCategory('');
        setSelectedAccountCategory({
            id: '',
            name: '',
            code: '',
        });
        setError({
            code: '',
            name: '',
            account_category_id: '',
        });
        setShowInputModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        isEdit
            ? patch(route('data-ledger.account.update', { organization: organization.id, account: id }), {
                  onSuccess: () => {
                      setShowInputModal(false);
                      toast.success(`Akun Berhasil Diubah`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                      reset();
                  },
                  preserveScroll: true,
              })
            : post(route('data-ledger.account.post', organization.id), {
                  onSuccess: () => {
                      setShowInputModal(false);
                      toast.success(`Akun Berhasil Ditambah`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                      reset();
                  },
                  preserveScroll: true,
              });
    };

    const handleCancelInput = () => {
        setShowInputModal(false);
    };

    const handleDelete = (account) => {
        setId(account.id);
        setData({
            account_category_id: account.account_category_id,
            name: account.name,
            code: account.code,
            is_cash: account.is_cash,
            is_active: account.is_active,
        });

        setShowDeleteConfirmation(true);
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        destroy(route('data-ledger.account.delete', { organization: organization.id, account: id }), {
            onSuccess: () => {
                setShowDeleteConfirmation(false);
                toast.success(`Akun Berhasil Dihapus`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                reset();
            },
            onError: (error) => {
                setShowDeleteConfirmation(false);
                toast.error(error.used, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title='Data Akun' />
            <ToastContainer />
            {/* Mobile */}
            {role !== 'viewer' && <AddButtonMobile handleShowInputModal={handleShowInputModal} label={'Tambah'} />}
            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    accounts.links[0].url ? (
                        <Link
                            href={route('data-ledger.account', {
                                organization: organization.id,
                                page: accounts.current_page - 1,
                                search: search,
                            })}
                            preserveState
                            only={['accounts']}>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    accounts.links[accounts.links.length - 1].url ? (
                        <Link
                            href={route('data-ledger.account', {
                                organization: organization.id,
                                page: accounts.current_page + 1,
                                search: search,
                            })}
                            only={['accounts']}
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
                        {accounts.current_page}/{accounts.last_page}
                    </>
                }
                data={accounts}
            />

            <ContentMobile>
                {accounts.data.map((account) => (
                    <AccountMobile
                        account={account}
                        key={account.id}
                        handleEdit={() => handleEdit(account)}
                        handleDelete={() => handleDelete(account)}
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
                            placeholder='Cari Akun'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={accounts} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {accounts.links[0].url ? (
                                <Link
                                    href={route('data-ledger.account', {
                                        organization: organization.id,
                                        page: accounts.current_page - 1,
                                        search: search,
                                    })}
                                    preserveState
                                    only={['accounts']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {accounts.current_page}/{accounts.last_page}
                        </div>
                        <div className='my-auto'>
                            {accounts.links[accounts.links.length - 1].url ? (
                                <Link
                                    href={route('data-ledger.account', {
                                        organization: organization.id,
                                        page: accounts.current_page + 1,
                                        search: search,
                                    })}
                                    only={['accounts']}
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
                                        <th className='bg-gray-200'>Kategori</th>
                                        <th className='bg-gray-200'>Kode</th>
                                        <th className='bg-gray-200'>Nama</th>
                                        <th className='bg-gray-200 text-center'>Status</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.data.map((account, index) => (
                                        <AccountDesktop
                                            key={index}
                                            account={account}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                            handleEdit={() => handleEdit(account)}
                                            handleDelete={() => handleDelete(account)}
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
                <form onSubmit={handleSubmit} className='p-6' id='form-input' name='form-input'>
                    <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>{modalInputTitle}</h2>

                    <div className='mt-5 '>
                        <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel htmlFor='name' value='Kategori Akun' className='mx-auto my-auto' />
                            </div>

                            <div className='sm:w-2/3 w-full'>
                                <GeneralSelectInput
                                    data={filteredAccountCategories}
                                    selected={selectedAccountCategory}
                                    setSelected={setSelectedAccountCategory}
                                    query={queryAccountCategory}
                                    setQuery={setQueryAccountCategory}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Kategori Akun'
                                    isFocused={true}
                                />
                                {errors && errors.account_category_id && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>
                                            The account category field is requred
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel htmlFor='name' value='Kode' className='mx-auto my-auto' />
                            </div>

                            <div className='sm:w-2/3 w-full'>
                                <TextInput
                                    id='code'
                                    type='text'
                                    name='code'
                                    value={data.code !== '0' ? data.code : ''}
                                    className={`mt-1 w-full ${errors && errors.code && 'border-red-500'}`}
                                    onChange={(e) => setData('code', e.target.value.toString())}
                                    placeholder='Kode Akun'
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
                                    placeholder='Nama Akun'
                                />
                                {errors && errors.name && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.name}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='flex justify-start w-full gap-1 mt-5'>
                                <div className='w-1/12'>
                                    <div className='form-control '>
                                        <label className='label cursor-pointer gap-2' htmlFor={`is_cash`}>
                                            <input
                                                type='checkbox'
                                                className='checkbox'
                                                id={`is_cash`}
                                                value={data.is_cash}
                                                onChange={() => setData('is_cash', !data.is_cash)}
                                                checked={data.is_cash}
                                            />
                                            <span className='label-text font-bold'>Kas</span>
                                        </label>
                                    </div>
                                    {errors && errors.is_cash && (
                                        <div className='-mb-3'>
                                            <div className='text-xs text-red-500'>{errors.is_cash}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isEdit && (
                                <div className='flex justify-start w-full gap-1 mt-5'>
                                    <div className='w-1/12'>
                                        <div className='form-control '>
                                            <label className='label cursor-pointer gap-2' htmlFor={`is_active`}>
                                                <input
                                                    type='checkbox'
                                                    className='checkbox'
                                                    id={`is_active`}
                                                    value={data.is_active}
                                                    onChange={() => setData('is_active', !data.is_active)}
                                                    checked={data.is_active}
                                                />
                                                <span className='label-text font-bold'>Aktif</span>
                                            </label>
                                        </div>
                                        {errors && errors.is_active && (
                                            <div className='-mb-3'>
                                                <div className='text-xs text-red-500'>{errors.is_active}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
                <form onSubmit={handleSubmitDelete} className='p-6' id='delete-confirmation' name='delete-confirmation'>
                    <h2 className='text-lg font-medium text-gray-900 text-center'>
                        <div>Hapus Kategori Akun</div>
                        {data && (
                            <div>
                                {data.name} ({data.code})
                            </div>
                        )}
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
        header={<Header>Daftar Akun</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Data Akun'
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
                    <li>Daftar Akun</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
