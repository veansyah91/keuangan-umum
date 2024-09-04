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
import { NumericFormat } from 'react-number-format';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import FixedAssetCategoryDesktop from './Components/FixedAssetCategoryDesktop';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import FixedAssetCategoryMobile from './Components/FixedAssetCategoryMobile';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ role, organization, fixedAssetCategories, status, searchFilter }) {
    const [showInputModal, setShowInputModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);
    const [dataFilter, setDataFilter] = useState({
        status: status || undefined,
    });

    const [edit, setEdit] = useState({
        status: false,
        id: null,
    });

    const [modalDelete, setModalDelete] = useState({
        title: false,
        id: null,
    });

    const prevSearch = usePrevious(search);

    const {
        data,
        setData,
        delete: destroy,
        post,
        patch,
        errors,
        setError,
        processing,
        reset,
    } = useForm({
        id: null,
        name: '',
        lifetime: 0,
        status: true,
    });

    // useEffect
    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    // function
    const handleReloadPage = () => {
        router.reload({
            only: ['fixedAssetCategories'],
            data: {
                search,
                status: dataFilter.status,
            },
            preserveState: true,
        });
    };

    const handleEdit = (data) => {
        setError({
            name: '',
        });
        setShowInputModal(true);
        setData({
            id: data.id,
            name: data.name,
            lifetime: data.lifetime,
            status: data.status,
        });
        setEdit({
            status: true,
            id: data.id,
        });
    };

    const handleDelete = (data) => {
        setModalDelete({
            title: `Hapus Kelompok Harta Tetap ${data.name}?`,
        });
        setShowDeleteConfirmation(true);
        setData({
            id: data.id,
            name: data.name,
            lifetime: data.lifetime,
            status: data.status,
        });
    };

    const handleCancelInput = () => {
        setShowInputModal(false);
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        destroy(
            route('data-master.fixed-asset-category.destroy', {
                organization: organization.id,
                fixedAssetCategory: data.id,
            }),
            {
                onSuccess: () => {
                    setShowDeleteConfirmation(false);
                    toast.success(`Kelompok Harta Tetap Berhasil Dihapus`, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                },
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        edit.status
            ? patch(
                  route('data-master.fixed-asset-category.update', {
                      organization: organization.id,
                      fixedAssetCategory: edit.id,
                  }),
                  {
                      onSuccess: () => {
                          setShowInputModal(false);
                          toast.success(`Kelompok Harta Tetap Berhasil Diubah`, {
                              position: toast.POSITION.TOP_CENTER,
                          });
                      },
                      preserveScroll: true,
                  }
              )
            : post(route('data-master.fixed-asset-category.post', organization.id), {
                  onSuccess: () => {
                      setShowInputModal(false);
                      toast.success(`Kelompok Harta Tetap Berhasil Ditambahkan`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                  },
                  preserveScroll: true,
              });
    };

    const handleAddButton = () => {
        setError({
            name: '',
        });
        reset();
        setShowInputModal(true);
    };

    const handleChangeValue = (value) => {
        const { floatValue } = value;
        setData('lifetime', floatValue);
    };

    return (
        <>
            <Head title='Kelompok Harta Tetap' />
            <ToastContainer />

            {/* Mobile */}
            {role !== 'viewer' && <AddButtonMobile label={'Tambah'} handleShowInputModal={handleAddButton} />}
            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    fixedAssetCategories.links[0].url ? (
                        <Link
                            href={route('data-master.fixed-asset-category', {
                                organization: organization.id,
                                page: fixedAssetCategories.current_page - 1,
                                search: search,
                            })}
                            preserveState
                            only={['fixedAssetCategories']}>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    fixedAssetCategories.links[fixedAssetCategories.links.length - 1].url ? (
                        <Link
                            href={route('data-master.fixed-asset-category', {
                                organization: organization.id,
                                page: fixedAssetCategories.current_page + 1,
                                search: search,
                            })}
                            only={['fixedAssetCategories']}
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
                        {fixedAssetCategories.current_page}/{fixedAssetCategories.last_page}
                    </>
                }
                data={fixedAssetCategories}
                hasFilter={true}
                showFilter={() => setShowModalFilter(true)}
            />
            <ContentMobile>
                {fixedAssetCategories.data.map((data) => (
                    <FixedAssetCategoryMobile
                        data={data}
                        key={data.id}
                        handleDelete={() => handleDelete(data)}
                        role={role}
                    />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop  */}
            <ContainerDesktop>
                <TitleDesktop>
                    <div className='my-auto w-7/12'>
                        {role !== 'viewer' && (
                            <PrimaryButton className='py-3' onClick={handleAddButton}>
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
                            placeholder='Cari Kelompok Harta Tetap'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={fixedAssetCategories} />
                    </div>
                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {fixedAssetCategories.links[0].url ? (
                                <Link
                                    href={route('data-master.fixed-asset-category', {
                                        organization: organization.id,
                                        page: fixedAssetCategories.current_page - 1,
                                        search: search,
                                    })}
                                    preserveState
                                    only={['fixedAssetCategories']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {fixedAssetCategories.current_page}/{fixedAssetCategories.last_page}
                        </div>
                        <div className='my-auto'>
                            {fixedAssetCategories.links[fixedAssetCategories.links.length - 1].url ? (
                                <Link
                                    href={route('data-master.fixed-asset-category', {
                                        organization: organization.id,
                                        page: fixedAssetCategories.current_page + 1,
                                        search: search,
                                    })}
                                    only={['fixedAssetCategories']}
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
                                        <th className='bg-gray-200'>Usia Penggunaan (Bulan)</th>
                                        <th className='bg-gray-200'>Usia Penggunaan (Tahun)</th>
                                        <th className='bg-gray-200 text-center'>Status</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fixedAssetCategories.data.map((data, index) => (
                                        <FixedAssetCategoryDesktop
                                            key={index}
                                            data={data}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                            handleEdit={() => handleEdit(data)}
                                            handleDelete={() => handleDelete(data)}
                                            role={role}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </ContentDesktop>
                    </div>
                </div>
            </ContainerDesktop>

            {/* Desktop  */}

            {/* Modal */}
            <Modal show={showInputModal} onClose={handleCancelInput}>
                <form onSubmit={handleSubmit} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>
                        {edit.status ? 'Ubah' : 'Tambah'} Kelompok Harta Tetap
                    </h2>

                    <div className='mt-5 '>
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
                        <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    htmlFor='lifetime'
                                    value='Usia Pemakaian (Bulan)'
                                    className='mx-auto my-auto'
                                />
                            </div>

                            <div className='sm:w-2/3 w-full'>
                                <NumericFormat
                                    value={data.lifetime}
                                    customInput={TextInput}
                                    onValueChange={(values) => handleChangeValue(values)}
                                    thousandSeparator={true}
                                    className='text-end w-full'
                                    // prefix={'IDR '}
                                    id='lifetime'
                                />
                                {errors && errors.lifetime && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.lifetime}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-start w-full gap-1 mt-5'>
                            <div className='w-1/12'>
                                <div className='form-control '>
                                    <label className='label cursor-pointer gap-2' htmlFor={`status`}>
                                        <input
                                            type='checkbox'
                                            className='checkbox'
                                            id={`status`}
                                            value={data.status}
                                            onChange={() => setData('status', !data.status)}
                                            checked={data.status}
                                        />
                                        <span className='label-text font-bold'>Aktif</span>
                                    </label>
                                </div>
                                {errors && errors.status && (
                                    <div className='-mb-3'>
                                        <div className='text-xs text-red-500'>{errors.status}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={handleCancelInput}>Batal</SecondaryButton>

                        <PrimaryButton className='ms-3' disabled={processing}>
                            {edit.status ? 'Ubah' : 'Tambah'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form onSubmit={handleSubmitDelete} className='p-6' id='deleteForm' name='deleteForm'>
                    <h2 className='text-lg font-medium text-gray-900 text-center'>{modalDelete.title}</h2>

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
        header={<Header>Kelompok Harta Tetap</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Kelompok Harta Tetap'
        backLink={
            <Link href={route('data-master', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('data-master', page.props.organization.id)}>Master</Link>
                    </li>
                    <li>Kelompok Harta Tetap</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
