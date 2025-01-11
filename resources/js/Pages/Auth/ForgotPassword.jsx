import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title='Forgot Password' />

            <div className='mb-4 text-sm text-gray-600'>
                Lupa password anda? Tidak Masalah. Silakan masukkan email anda, lalu kami akan mengirimkan Link untuk
                mengatur kembali password anda.
            </div>

            {status && <div className='mb-4 font-medium text-sm text-green-600'>Permintaan perubahan password dikirim ke email anda dalam 1-2 menit, silakan cek pada email anda</div>}

            <form onSubmit={submit}>
                <TextInput
                    id='email'
                    type='email'
                    name='email'
                    value={data.email}
                    className='mt-1 block w-full'
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className='mt-2' />

                <div className='flex items-center justify-end mt-4'>
                    <PrimaryButton className='ms-4' disabled={processing}>
                        Link Reset Password Email
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
