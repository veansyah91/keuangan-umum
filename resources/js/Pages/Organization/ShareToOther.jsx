import Container from '@/Components/Container';
import Header from '@/Components/Header';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';
import UserSelectInput from '@/Components/SelectInput/UserSelectInput';
import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { IoAddOutline, IoCreateOutline, IoEllipsisVertical, IoTrashOutline } from 'react-icons/io5';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DangerButton from '@/Components/DangerButton';

const roles = [
    { id: 0, name: 'PELIHAT', value: 'viewer' },
    { id: 1, name: 'EDITOR', value: 'editor' },
];

export default function ShareToOther({ organization, users, userFilter, userOrganization }) {
    // console.log(users);
    const [showAdd, setShowAdd] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [user] = useState(userFilter || '');
    const [isUpdate, setIsUpdate] = useState(false);
    const [userDelete, setUserDelete] = useState('');

    // Users
    const [selectedUser, setSelectedUser] = useState(userFilter ? users[0] : {});
    const [queryUser, setQueryUser] = useState(userFilter || '');
    const [debounceQueryUser] = useDebounce(queryUser, 500);

    // Roles
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [queryRole, setQueryRole] = useState('');
    const [filterRole, setFilterRole] = useState([]);

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
        user_id: users.length > 0 ? users[0].id : '',
        user_name: users.length > 0 ? users[0].name : '',
        organization_id: organization.id,
        role: roles[0].name,
    });

    const prevSearch = usePrevious(user);

    useEffect(() => {
        setFilterRole(roles);
    }, []);

    useEffect(() => {
        if (prevSearch !== undefined) {
            setData('user_id', selectedUser.id);
            handleReloadUser();
        }
    }, [selectedUser, debounceQueryUser]);

    useEffect(() => {
        setFilterRole(
            roles.filter((role) =>
                role.name.toLowerCase().replace(/\s+/g, '').includes(queryRole?.toLowerCase().replace(/\s+/g, ''))
            )
        );
    }, [queryRole]);

    useEffect(() => {
        setData('role', selectedRole.value);
    }, [selectedRole]);

    const handleShowEdit = (user) => {
        setData({
            ...data,
            user_id: user.id,
            user_name: user.name,
            role: user.pivot.role,
        });

        setSelectedRole(roles.find(({ value }) => value === user.pivot.role));
        setQueryRole(user.pivot.role);
        setShowAdd(true);
        setIsUpdate(true);
    };

    const handleShowDelete = (user) => {
        setUserDelete(user.name);
        setData({
            user_id: user.id,
            user_name: user.name,
            organization_id: organization.id,
            role: user.pivot.role,
        });
        setShowDeleteConfirmation(true);
    };

    const handleOpenModalInput = () => {
        setShowAdd(true);
        setIsUpdate(false);
        setSelectedRole(roles[0]);
        setError({});
    };

    const handleReloadUser = () => {
        router.reload({
            only: ['users'],
            data: {
              user: queryUser,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        isUpdate
            ? patch(route('organization.share-to-other.patch', organization.id), {
                  onSuccess: () => {
                      toast.success(`Kontak Berhasil Diperbarui`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                      setShowAdd(false);
                      setData({
                          user_id: '',
                          user_name: '',
                          organization_id: organization.id,
                          role: roles[0].name,
                      });
                  },
              })
            : post(route('organization.share-to-other.post', organization.id), {
                  onSuccess: () => {
                      toast.success(`Kontak Berhasil Ditautkan, Mohon Menunggu Konfirmasi Dari Pengguna`, {
                          position: toast.POSITION.TOP_CENTER,
                      });
                      setShowAdd(false);
                      setData({
                          user_id: '',
                          user_name: '',
                          organization_id: organization.id,
                          role: roles[0].name,
                      });
                  },
              });
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        destroy(route('organization.share-to-other.delete', organization.id), {
            onSuccess: () => {
                toast.success(`Tautan Kontak dan Organisasi Berhasil Dihapus`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                setShowDeleteConfirmation(false);
                setData({
                    user_id: '',
                    user_name: '',
                    organization_id: organization.id,
                    role: roles[0].name,
                });
            },
        });
    };

    return (
        <>
            <ToastContainer />

            <div className='min-h-screen bg-gray-100'>
                <div className='max-w-2xl mx-auto sm:px-6 lg:px-8 bg-white rounded-lg pb-10'>
                    <Head title='Organization' />

                    <Header>
                        <div className='pt-4 text-center'>Bagikan Organisasi</div>
                    </Header>
                    <Container className={'sm:mt-5'}>
                        <div className='flex justify-between gap-2 sm:my-2'>
                            <div className=''>
                                <PrimaryButton className='hidden sm:block' onClick={handleOpenModalInput}>
                                    Tambah Pengguna
                                </PrimaryButton>
                            </div>

                            {/* Permintaan Menghubungkan User dan Organisasi */}

                            {/* Permintaan Menghubungkan User dan Organisasi */}

                            <div className='md:hidden block fixed left-2 bottom-2'>
                                {/* Mobile */}
                                <div>
                                    <button
                                        className={'btn btn-circle bg-gray-800 text-white'}
                                        onClick={handleOpenModalInput}>
                                        <div className='text-xl font-bold'>
                                            <IoAddOutline height={20} width={20} />
                                        </div>
                                    </button>
                                </div>
                                {/* End Mobile */}
                            </div>
                            <div className='mt-auto text-xs mr-2 sm:mr-0'>
                                Jumlah Pengguna Tertaut: {organization.users.length} pengguna
                            </div>
                        </div>
                        {organization.users.map((user, index) => (
                            <div
                                className={`hover:bg-slate-100 ${user.pivot.is_waiting ? 'border-orange-400 border' : ''} hover:rounded-sm px-2 py-3`}
                                key={index}>
                                {user.pivot.is_waiting ? (
                                    <div className='w-full text-center text-xs my-auto bg-orange-400 text-white'>
                                        Menunggu Konfirmasi
                                    </div>
                                ) : (
                                    ''
                                )}

                                <div className='flex justify-between sm:px-4 grid-2 w-full'>
                                    <div className='w-2/4'>
                                        <div>{user.name}</div>
                                        <div className='text-xs'>{user.email}</div>
                                    </div>
                                    <div className='sm:w-1/4 w-5/12 my-auto italic text-center'>
                                        {user.pivot.role == 'admin' && 'Admin'}
                                        {user.pivot.role == 'viewer' && 'Hanya Lihat'}
                                        {user.pivot.role == 'editor' && 'Editor'}
                                    </div>
                                    <div className='sm:w-1/4 w-1/12 my-auto text-end'>
                                        {user.pivot.role !== 'admin' && (
                                            <div className='dropdown dropdown-left'>
                                                <div tabIndex={0} role='button' className='bg-inherit border-none '>
                                                    <IoEllipsisVertical />
                                                </div>
                                                <ul
                                                    tabIndex={0}
                                                    className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                                                    {userOrganization.pivot.role == 'admin' && (
                                                        <>
                                                            <li>
                                                                <button onClick={() => handleShowEdit(user)}>
                                                                    <IoCreateOutline />
                                                                    Ubah Role
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button onClick={() => handleShowDelete(user)}>
                                                                    <IoTrashOutline />
                                                                    Hapus Tautan
                                                                </button>
                                                            </li>
                                                        </>
                                                    )}
                                                    {userOrganization.pivot.is_waiting ? (
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
                                                                        user_id: userOrganization.pivot.user_id,
                                                                        organization_id:
                                                                            userOrganization.pivot.organization_id,
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
                                                                        user_id: userOrganization.pivot.user_id,
                                                                        organization_id:
                                                                            userOrganization.pivot.organization_id,
                                                                        is_waiting: false,
                                                                    }}>
                                                                    Tolak
                                                                </Link>
                                                            </div>
                                                        </li>
                                                    ) : (
                                                        ''
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className='mt-9 px-8 sm:px-4'>
                            <Link href='/organizations'>
                                <SecondaryButton>Kembali</SecondaryButton>
                            </Link>
                        </div>
                    </Container>
                </div>
            </div>

            {/* Modal */}
            {/* Add or Update */}
            <Modal show={showAdd} onClose={() => setShowAdd(false)}>
                <form onSubmit={handleSubmit} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>
                        {isUpdate ? `Ubah Role Pengguna ${data.user_name}` : 'Tambah Tautan Pengguna'}
                    </h2>

                    <div className='mt-6 space-y-2'>
                        {!isUpdate && (
                            <div className='sm:flex w-full gap-1'>
                                <div className='sm:w-3/12 my-auto'>Pengguna</div>
                                <div className='sm:w-8/12'>
                                    <UserSelectInput
                                        resources={users}
                                        selected={selectedUser}
                                        setSelected={setSelectedUser}
                                        // query={queryUser}
                                        // setQuery={setQueryUser}
                                        maxHeight='max-h-40'
                                        placeholder='Cari Pengguna'
                                        className={errors?.user_id && `border-red-500 border`}
                                    />
                                    {errors?.user_id && <div className='text-xs text-red-500'>{errors.user_id}</div>}
                                </div>
                            </div>
                        )}

                        <div className='sm:flex w-full gap-1'>
                            <div className='sm:w-3/12 my-auto'>Role</div>
                            <div className='sm:w-8/12'>
                                <GeneralSelectInput
                                    data={filterRole}
                                    selected={selectedRole}
                                    setSelected={setSelectedRole}
                                    query={queryRole}
                                    setQuery={setQueryRole}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Role'
                                />
                            </div>
                        </div>
                        <div className='mt-10 py-10 flex flex-col-reverse justify-center sm:flex-row sm:justify-end'>
                            <div className='text-center'>
                                <SecondaryButton className='w-full mt-2 sm:mt-0' onClick={() => setShowAdd(false)}>
                                    <div className='text-center w-full'>Batal</div>
                                </SecondaryButton>
                            </div>

                            <div className='text-center'>
                                <PrimaryButton className='sm:ms-3 w-full' disabled={processing}>
                                    <div className='text-center w-full'>Tautkan Pengguna</div>
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Delete */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form onSubmit={handleSubmitDelete} className='p-6'>
                    <h2 className='text-lg font-medium text-gray-900'>Konfirmasi Hapus Penautan</h2>

                    <div className='mt-6 space-y-2'>
                        <div className='text-center'>
                            Apakah Anda Yakin Menghapus Tautan Dengan{' '}
                            <span className='font-bold'>{userDelete.toUpperCase()}</span> ?
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
            {/* Modal */}
        </>
    );
}
