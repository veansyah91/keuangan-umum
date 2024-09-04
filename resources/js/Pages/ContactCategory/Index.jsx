import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { useDebounce } from 'use-debounce';
import PageNumber from '@/Components/PageNumber';
import ContactCategoryMobile from './Components/ContactCategoryMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import AddButtonMobile from '@/Components/AddButtonMobile';
import { usePrevious } from 'react-use';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import ContactCategoryDesktop from './Components/ContactCategoryDesktop';
import InputLabel from '@/Components/InputLabel';

export default function Index({ role, organization, contactCategories, searchFilter }) {
    // state
    const [showSearch, setShowSearch] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [isUpdate, setIsUpdate] = useState(false);
    const [id, setId] = useState(null);
    const [modalInputTitle, setModalInputTitle] = useState('Tambah Kategori Kontak');
    const [modalSubmitLabel, setModalSubmitLabel] = useState('Tambah');
    const [titleDeleteModal, setTitleDeleteModal] = useState('');

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const prevSearch = usePrevious(search);
    const { flash } = usePage().props;

    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        delete: destroy,
        setError,
    } = useForm({
        name: '',
    });

    // useEffect
    useEffect(() => {
        flash.success &&
            toast.success(flash.success, {
                position: toast.POSITION.TOP_CENTER,
            });
    }, []);

    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    // Function
    const handleReloadPage = () => {
        router.reload({
            only: ['contactCategories'],
            data: {
                search,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        isUpdate
            ? patch(
                  route('data-master.contact-category.update', { organization: organization.id, contactCategory: id }),
                  {
                      onSuccess: () => {
                          reset();
                          toast.success(`Kategori Kontak Berhasil Diubah`, {
                              position: toast.POSITION.TOP_CENTER,
                          });
                          handleCancelInput();
                      },
                  }
              )
            : post(route('data-master.contact-category.post', organization.id), {
                  onSuccess: () => {
                      reset();
                      toast.success(`Kategori Kontak Berhasil Ditambahkan`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                      handleCancelInput();
                  },
              });
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();

        router.delete(
            route('data-master.contact-category.destroy', { organization: organization.id, contactCategory: id }),
            {
                onSuccess: () => {
                    setShowDeleteConfirmation(false);
                    toast.success(`Kategori Kontak Berhasil Dihapus`, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    reset();
                },
                onError: (error) => {
                    setShowDeleteConfirmation(false);
                    toast.error(error.delete_confirmation, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                },
            }
        );
    };

    const handleCancelInput = () => {
        setShowModalInput(false);
        setModalInputTitle('Tambah Kategori Kontak');
        setIsUpdate(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleEdit = (contactCategory) => {
        setIsUpdate(true);
        setError('name', '');
        setId(contactCategory.id);
        setShowModalInput(true);
        setModalSubmitLabel('Ubah');
        setModalInputTitle(`Ubah Kategori Kontak`);
        setData('name', contactCategory.name);
    };

    const handleDelete = (contactCategory) => {
        setId(contactCategory.id);
        setShowDeleteConfirmation(true);
        setTitleDeleteModal(`Hapus ${contactCategory.name}?`);
    };

    const handleShowInputModal = () => {
        setError('name', '');
        setShowModalInput(true);
        setData('name', '');
    };

    return (
        <>
            <Head title='Data Kategori Kontak' />
            <ToastContainer />

            {/* Mobile */}
            {role !== 'viewer' && <AddButtonMobile handleShowInputModal={handleShowInputModal} label={'Tambah'} />}

            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    contactCategories.links[0].url ? (
                        <Link
                            href={route('data-master.contact-category', {
                                organization: organization.id,
                                page: contactCategories.current_page - 1,
                                search: search,
                            })}
                            preserveState
                            only={['contactCategories']}>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    contactCategories.links[contactCategories.links.length - 1].url ? (
                        <Link
                            href={route('data-master.contact-category', {
                                organization: organization.id,
                                page: contactCategories.current_page + 1,
                                search: search,
                            })}
                            only={['contactCategories']}
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
                        {contactCategories.current_page}/{contactCategories.last_page}
                    </>
                }
                data={contactCategories}
            />

            <ContentMobile>
                {contactCategories.data.map((contactCategory) => (
                    <ContactCategoryMobile
                        contactCategory={contactCategory}
                        key={contactCategory.id}
                        handleEdit={() => handleEdit(contactCategory)}
                        handleDelete={() => handleDelete(contactCategory)}
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
                            placeholder='Cari Kategori Kontak'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={contactCategories} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {contactCategories.links[0].url ? (
                                <Link
                                    href={route('data-master.contact-category', {
                                        organization: organization.id,
                                        page: contactCategories.current_page - 1,
                                        search: search,
                                    })}
                                    preserveState
                                    only={['contactCategories']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {contactCategories.current_page}/{contactCategories.last_page}
                        </div>
                        <div className='my-auto'>
                            {contactCategories.links[contactCategories.links.length - 1].url ? (
                                <Link
                                    href={route('data-master.contact-category', {
                                        organization: organization.id,
                                        page: contactCategories.current_page + 1,
                                        search: search,
                                    })}
                                    only={['contactCategories']}
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
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contactCategories.data.map((contactCategory, index) => (
                                        <ContactCategoryDesktop
                                            key={index}
                                            contactCategory={contactCategory}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                            handleEdit={() => handleEdit(contactCategory)}
                                            handleDelete={() => handleDelete(contactCategory)}
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
            <Modal show={showModalInput} onClose={() => setShowModalInput(false)}>
                <form onSubmit={handleSubmit} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>{modalInputTitle}</h2>

                    <div className='mt-5 '>
                        <div className='flex flex-col sm:flex-row w-full gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel htmlFor='name' value='Nama Kategori Kontak' className='mx-auto my-auto' />
                            </div>

                            {/* <div className='sm:w-1/3 w-full my-auto'>Nama Kategori Kontak</div> */}
                            <div className='sm:w-2/3 w-full'>
                                <TextInput
                                    id='name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    className={`mt-1 w-full ${errors && errors.name && 'border-red-500'}`}
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                    placeholder='Nama Kategori Kontak'
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
                    <h2 className='text-lg font-medium text-gray-900 text-center'>{titleDeleteModal}</h2>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={handleCancelDelete}>Batal</SecondaryButton>

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
        header={<Header>Data Kategori Kontak</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Data Kategori Kontak'
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
                    <li>Data Kategori Kontak</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
