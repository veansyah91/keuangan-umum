import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeWarning from '@/Components/Badges/BadgeWarning';
import Header from '@/Components/Header';
import SuccessButton from '@/Components/SuccessButton';
import formatNumber from '@/Utils/formatNumber';
import rupiah from '@/Utils/rupiah';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io5/index.esm';

export default function Detail({ auth, affiliation, affiliationWithdraw, appName, whatsappContact }) {
    const [waLink] = useState('https://web.whatsapp.com/send');
    const [message] = useState(`
  *KONFIRMASI PENGAJUAN PENARIKAN SALDO*
  %0A-------------------------------------------------------%0A*No Ref:* ${affiliationWithdraw.no_ref}%0A*Tanggal Pengajuan:* ${affiliationWithdraw.created_at}%0A*Nilai Pengajuan:* ${rupiah(affiliationWithdraw.value)}%0A-------------------------------------------------------%0A`);

    const [waContent, setWaContent] = useState('');

    const handleConfirm = () => {
        setWaContent(`${waLink}?phone=${whatsappContact}&text=${message}`);
        window.open(waContent, '_blank');
    };
    return (
        <>
            <Head title='Detail Pengajuan Penarikan' />

            <div className='bg-gray-100 min-h-screen'>
                <div className='bg-white rounded-md max-w-4xl mx-auto sm:px-6 lg:px-8'>
                    {/* Breadcrumbs */}
                    <div className='flex justify-between'>
                        <div className='text-sm breadcrumbs px-4 py-4'>
                            <ul>
                                <li className='font-bold'>
                                    <Link href={route('organization')}>Daftar Organisasi</Link>
                                </li>
                                <li className='font-bold'>
                                    <Link href={route('affiliation.index', affiliation.id)}>Afiliasi</Link>
                                </li>
                                <li>Detail</li>
                            </ul>
                        </div>
                        <Header className='hidden sm:block my-auto'>Detail Invoice</Header>
                    </div>

                    {/* Title */}
                    <Header className='block sm:hidden'>
                        <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
                            <div className='sm:p-6 px-6 py-3 text-gray-800 flex-none sm:flex'>
                                <div className='sm:flex-1 my-auto'>Rincian Pengajuan Penarikan Saldo</div>
                            </div>
                        </div>
                    </Header>

                    {/* Content */}
                    <section className='px-3 py-4 space-y-5 mt-5'>
                        <div className='sm:flex sm:w-1/2 space-y-5 sm:space-y-0'>
                            <div className='sm:w-1/2'>
                                <div className='font-bold'>Tanggal Pengajuan :</div>
                                <div>{dayjs(affiliationWithdraw.created_at).format('MMM DD, YYYY')}</div>
                            </div>
                            <div className='sm:w-1/2'>
                                <div className='font-bold'>No. Ref :</div>
                                <div>{affiliationWithdraw.no_ref}</div>
                            </div>
                        </div>
                        <div className='sm:flex sm:w-1/2 space-y-5 sm:space-y-0'>
                            <div className='sm:w-1/2'>
                                <div className='font-bold'>Nilai Pengajuan :</div>
                                <div>IDR. {formatNumber(affiliationWithdraw.value)}</div>
                            </div>
                            <div className='sm:w-1/2'>
                                <div className='font-bold'>Status :</div>
                                <div>
                                    {affiliationWithdraw.status > 0 ? (
                                        <BadgeSuccess>Sukses</BadgeSuccess>
                                    ) : (
                                        <BadgeWarning>Mengunggu</BadgeWarning>
                                    )}
                                </div>
                            </div>
                        </div>
                        {affiliationWithdraw.status < 1 && (
                            <>
                                <hr className='border-black' />
                                <div>
                                    <div className='sm:flex sm:space-x-3'>
                                        <div className='mt-3 space-y-2 sm:w-1/2'>
                                            <div>Rekening Anda: </div>
                                            <div className='text-xl flex justify-between'>
                                                <div>No. Rekening : {affiliation.bank_account}</div>
                                            </div>
                                            <div className='text-xl'>Nama Bank : {affiliation.bank_name}</div>
                                        </div>
                                        <div className='mt-3 space-y-2 sm:w-1/2'>
                                            <div>Konfirmasi: </div>
                                            <div>
                                                <SuccessButton
                                                    type='button'
                                                    className='space-x-2'
                                                    onClick={handleConfirm}>
                                                    <span>
                                                        <IoLogoWhatsapp />
                                                    </span>
                                                    <span>Konfirmasi Pengajuan Penarikan Saldo</span>
                                                </SuccessButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
