import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title='Log in' />

            {status && <div className='mb-4 font-medium text-sm text-green-600'>{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor='email' value='Email' />

                    <TextInput
                        id='email'
                        type='email'
                        name='email'
                        value={data.email}
                        className='mt-1 block w-full'
                        autoComplete='username'
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className='mt-2' />
                </div>

                <div className='mt-4'>
                    <InputLabel htmlFor='password' value='Sandi' />

                    <TextInput
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        value={data.password}
                        className='mt-1 block w-full'
                        autoComplete='current-password'
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className='mt-2' />

                    <div className='flex justify-between mt-2'>
                        <div className='block'>
                            <label className='flex items-center'>
                                <Checkbox
                                    name='show'
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(!showPassword)}
                                />
                                <span className='ms-2 text-sm text-gray-600'>Tampilkan Sandi</span>
                            </label>
                        </div>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className='underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:ring-2 focus:ring-offset-2'>
                                Lupa Password?
                            </Link>
                        )}  
                        
                    </div>

                    
                </div>

                

                <div className='flex items-center justify-end mt-4'>
                    <Link
                        href={route('register')}
                        className='font-bold text-sm text-gray-600 hover:text-gray-900 rounded-md focus:ring-2 focus:ring-offset-2'>
                        Daftar Gratis
                    </Link>

                    <PrimaryButton className='ms-4' disabled={processing}>
                        Masuk
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
