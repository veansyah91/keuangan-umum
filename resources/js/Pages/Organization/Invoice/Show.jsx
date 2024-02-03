import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Container from './Components/Container'
import Header from '@/Components/Header';
import { IoArrowBackOutline, IoPrintOutline } from 'react-icons/io5';
import rupiah from '@/Utils/rupiah';
import BadgeWarning from '@/Components/Badges/BadgeWarning';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeDanger from '@/Components/Badges/BadgeDanger';
import SuccessButton from '@/Components/SuccessButton';
import { IoLogoWhatsapp } from 'react-icons/io';
import copy from 'copy-to-clipboard';
import SecondaryButton from '@/Components/SecondaryButton';


export default function Show({organization, organizationInvoice, bank, whatsappContact, appName}) {
    
    const { flash } = usePage().props;
    const [copyLabel, setCopyLabel] = useState('Copy');

    const [waLink] = useState('https://web.whatsapp.com/send');
    const [message] = useState(`
    *KONFIRMASI PEMBAYARAN PERPANJANG LAYANAN ${appName.toUpperCase()}*
    %0A-------------------------------------------------------%0A*No Faktur:* ${organizationInvoice.no_ref}%0A*Jenis Layanan:* ${organizationInvoice.product.toUpperCase()}%0A*Tanggal Pengajuan:* ${organizationInvoice.date}%0A*Jumlah Bayar:* ${rupiah(organizationInvoice.price)}%0A-------------------------------------------------------%0A_Mohon Sertakan Bukti Transfer Agar Proses Konfirmasi Dilakukan Lebih Cepat_`);

    const [waContent, setWaContent] = useState('');

    useEffect(()=>{
        flash.success && 
            toast.success(flash.success, {
                position: toast.POSITION.TOP_CENTER
            });
        ;
    },[]);

    const handleConfirm = () => {
        setWaContent(`${waLink}?phone=${whatsappContact}&text=${message}`)
        window.open(waContent, '_blank');
    }

    const handleCopy = () => {
        copy(bank.account);
        setCopyLabel('Copied');
        setTimeout(() => {
            setCopyLabel('Copy');
        }, 2000);
    }

    const handlePrintWindow = () => {
        window.print();
    }

    return (
        <>
            <Head title='Organization' />
            <ToastContainer />       

            <Container>
                {/* Title */}
                <div className='py-3 px-4 flex print:hidden'> 
                    <Link href={`/organizations/${organization.id}/invoices`} className='w-2/12 my-auto text-lg sm:hidden'>
                        <IoArrowBackOutline />     
                    </Link> 
                    <div className='w-1/2 text-sm breadcrumbs my-auto hidden sm:block'>
                        <ul>
                            <li className='font-bold'>
                                <Link href='/organizations'>Daftar Organisasi</Link>
                            </li> 
                            <li className='font-bold'>
                                <Link href={`/organizations/${organization.id}/invoices`}>Invoice Perpanjangan Layanan </Link>
                                
                            </li>
                            <li>Detail </li>
                        </ul>
                    </div>
                    <div className='sm:w-1/2 w-10/12 my-auto sm:text-end'>
                        <Header>Detail Invoice</Header>
                    </div>
                </div>
                <div className='hidden print:block'>
                    <h1 className='text-2xl'>{appName.toUpperCase()}</h1>

                    <div className='mt-5 flex justify-between'>
                        <div className='mt-auto font-bold'>
                            FAKTUR PEMBAYARAN PERPANJANGAN LAYANAN
                        </div>
                        <div>
                            Kepada:
                            <div>{organization.name}</div>
                            <div>{organization.address}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <section className='px-4 py-4'>
                    <div className='sm:flex sm:flex-row-reverse sm:space-x-3'>
                        <div className='mt-2 sm:w-1/2'>
                            <div>Dibuat Tanggal : </div>
                            <div>{organizationInvoice.date}</div>
                        </div>
                        <div className='mt-2 sm:w-1/2'>
                            <div className='sm:-ml-3'>No. Ref : </div>
                            <div className='sm:-ml-3'>{organizationInvoice.no_ref}</div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <div>Jenis Layanan :</div>
                        <div className='uppercase'>{organizationInvoice.product}</div>
                    </div>
                    <div className='sm:flex sm:space-x-3'>
                        <div className='mt-2 sm:w-1/2'>
                            <div>Harga :</div>
                            <div>{rupiah(organizationInvoice.price)}</div>
                        </div>
                        <div className='mt-2 sm:w-1/2'>
                            <div>Status : </div>
                            <div>
                            {
                                organizationInvoice.status == 'pending' && 
                                <BadgeWarning>Mengunggu Pembayaran</BadgeWarning>
                            }
                            {
                                organizationInvoice.status == 'paid' && 
                                <BadgeSuccess>Telah Bayar</BadgeSuccess>
                            }
                            {
                                organizationInvoice.status == 'canceled' && 
                                <BadgeDanger>Batal Perpanjangan</BadgeDanger>
                            }
                            </div>
                        </div>
                    </div>
                    <div className='hidden print:flex print:justify-end'>
                        <div>
                            <div>
                                Hormat Kami
                            </div>   
                            <div className='mt-10'>
                                {appName.toUpperCase()}
                            </div>                              
                        </div>
                    </div>
                    {
                        organizationInvoice.status == 'paid' && <div className='mt-5 print:hidden'>
                            <SecondaryButton className='space-x-2' onClick={handlePrintWindow}><IoPrintOutline className='text-xl'/> <span>Print Invoice</span></SecondaryButton>
                        </div>
                    }
                    {
                         organizationInvoice.status == 'pending' && 
                         <div className='mt-3'>
                            <hr className='border-black'/>
                            <div className='sm:flex sm:space-x-3'>
                                <div className='mt-3 space-y-2 sm:w-1/2'>
                                    <div>Silakan Lakukan Pembayaran via Transfer Bank: </div>
                                    <div className='text-xl flex justify-between'>
                                        <div>
                                            {bank.provider} {bank.account} 
                                        </div>
                                        <div>
                                            <button className='btn btn-xs' onClick={handleCopy}>{copyLabel}</button>
                                        </div>                                        
                                    </div>
                                    <div className='text-xl'>an {bank.name}</div>
                                </div>
                                <div className='mt-3 space-y-2 sm:w-1/2'>
                                    <div>Konfirmasi: </div>
                                    <div>
                                        <SuccessButton type="button" className='space-x-2' onClick={handleConfirm}>
                                            <span><IoLogoWhatsapp /></span>
                                            <span>Konfirmasi Pembayaran</span>                                        
                                        </SuccessButton>
                                    </div>
                                </div>
                            </div>
                         </div>
                    }
                </section>
            </Container>
        </>
    )
}
