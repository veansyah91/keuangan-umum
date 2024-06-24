import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, Link } from '@inertiajs/react';
import Container from '@/Components/Container';
import Header from '@/Components/Header';
import SecondaryButton from '@/Components/SecondaryButton';

function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <>
            <Head title='Profil' />

            {/* <Container> */}

            <div className='min-h-screen bg-gray-100'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6'>
                    <div className='p-4 sm:py-4 sm:px-8 bg-white shadow sm:rounded-t-lg -mb-6 border-b'>
                        <div className='flex justify-between'>
                            <div className='mb-auto'>
                                <Header>Profil</Header>
                            </div>
                            <div>
                                <Link
                                    className='text-slate-900 border border-slate-500 px-2 py-1 hover:bg-red-500 hover:text-white hover:border-none rounded-lg'
                                    href={route('logout')}
                                    method='post'
                                    as='button'>
                                    Log Out
                                </Link>
                            </div>
                        </div>

                        <div className='text-start text-blue-600 my-auto'>
                            <div>
                                <Link href='/organizations'>
                                    <small>halaman sebelumnya</small>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 py-2 sm:p-8 bg-white shadow sm:rounded-b-lg sm:rounded-none'>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className='max-w-xl'
                        />
                    </div>

                    <div className='p-4 sm:p-8 bg-white shadow sm:rounded-lg'>
                        <UpdatePasswordForm className='max-w-xl' />
                    </div>
                </div>
            </div>
            {/* </Container> */}
        </>
    );
}

export default Edit;
