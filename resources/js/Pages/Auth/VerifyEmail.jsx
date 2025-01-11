import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title='Email Verification' />

            <div className='mb-4 text-sm text-gray-600'>
                Terima Kasih Telah Melakukan Registrasi. Silakan Verifikasi Email Anda Untuk Melanjutkan Layanan.
            </div>

            {status === 'verification-link-sent' && (
                <div className='mb-4 font-medium text-sm text-green-600'>
                    Link verifikasi dikirim ke email anda dalam 1-2 menit. Silakan cek email anda.
                </div>
            )}

            <form onSubmit={submit}>
                <div className='mt-4 flex items-center justify-between'>
                    <PrimaryButton disabled={processing}>Kirim Kembali Email Verifikasi</PrimaryButton>

                    <Link
                        href={route('logout')}
                        method='post'
                        as='button'
                        className='underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                        Keluar
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
