import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import { IoArrowBackOutline, IoFilter, IoLogoWhatsapp, IoPlayBack, IoPlayForward, IoPrintOutline, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SuccessButton from '@/Components/SuccessButton';
import dayjs from 'dayjs';
import BadgeWarning from '@/Components/Badges/BadgeWarning';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeDanger from '@/Components/Badges/BadgeDanger';
import formatNumber from '@/Utils/formatNumber';
import copy from 'copy-to-clipboard';

export default function Show({
  organization, invoice, role, whatsappContact, bank, appName, flash
}) {
  const [copyLabel, setCopyLabel] = useState('Copy');

  const [waLink] = useState('https://web.whatsapp.com/send');
  const [message] = useState(`
  *KONFIRMASI PEMBAYARAN PERPANJANG LAYANAN TAMBAHAN WHATSAPP BROADCASTING*
  %0A-------------------------------------------------------%0A*No Faktur:* ${invoice.no_ref}%0A*Jenis Layanan:* ${invoice.product.toUpperCase()}%0A*Tanggal Pengajuan:* ${dayjs(invoice.created_at).locale('id').format('DD MMMM YYYY, HH:mm:ss')}%0A*Jumlah Bayar:* IDR. ${formatNumber(invoice.price)}%0A-------------------------------------------------------%0A_Mohon Sertakan Bukti Transfer Apabila Telah Melakukan Membayaran Agar Proses Konfirmasi Dilakukan Lebih Cepat_`);

  const [waContent, setWaContent] = useState('');

  useEffect(() => {
      flash.success &&
          toast.success(flash.success, {
              position: toast.POSITION.TOP_CENTER,
          });
  }, []);

  const handleConfirm = () => {
      setWaContent(`${waLink}?phone=${whatsappContact}&text=${message}`);
      window.open(waContent, '_blank');
  };

  const handleCopy = () => {
      copy(bank.account);
      setCopyLabel('Copied');
      setTimeout(() => {
          setCopyLabel('Copy');
      }, 2000);
  };

  const handlePrintWindow = () => {
      window.print();
  };
  return (
    <>
      <Head title={`Rincian Invoice`} />
			<div className='sm:pt-0 pb-16 pt-12'>
        <div className='bg-white py-2 sm:pt-0 px-5'>

          <div className='hidden print:block'>
            <div className='flex gap-3 mt-10'>
              <ApplicationLogo />
              <h1 className='text-2xl my-auto'>{appName.toUpperCase()}</h1>
            </div>

            <div className='mt-10 flex justify-between'>
              <div className='font-bold w-1/2'>
                FAKTUR PEMBAYARAN PERPANJANGAN LAYANAN WHATSAPP BROADCASTING
              </div>
              <div>
                <div className='font-bold'>Kepada:</div>
                <div>{organization.name}</div>
                <div>{organization.address}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <section className='px-4 py-4'>
            <div className='sm:flex sm:flex-row-reverse sm:space-x-3'>
              <div className='mt-2 sm:w-1/2'>
                <div className='font-bold'>Dibuat Tanggal : </div>
                <div>{dayjs(invoice.created_at).locale('id').format('DD MMMM YYYY, HH:mm:ss')}</div>
              </div>
              <div className='mt-2 sm:w-1/2'>
                <div className='sm:-ml-3 font-bold'>No. Faktur : </div>
                <div className='sm:-ml-3'>{invoice.no_ref}</div>
              </div>
            </div>
            <div className='mt-2'>
              <div className='font-bold'>Jenis Layanan :</div>
              <div className='uppercase'>{invoice.product}</div>
            </div>
            <div className='sm:flex sm:space-x-3'>
              <div className='mt-2 sm:w-1/2'>
                <div className='font-bold'>Harga :</div>
                <div>IDR. {formatNumber(invoice.price)}</div>
              </div>
              <div className='mt-2 sm:w-1/2'>
                <div className='font-bold'>Status : </div>
                <div>
                  {invoice.status == 'pending' && (
                    <BadgeWarning>Mengunggu Pembayaran</BadgeWarning>
                  )}
                  {invoice.status == 'paid' && <BadgeSuccess>Telah Bayar</BadgeSuccess>}
                  {invoice.status == 'canceled' && (
                    <BadgeDanger>Batal Perpanjangan</BadgeDanger>
                  )}
                </div>
              </div>
            </div>
            <div className='hidden print:flex print:justify-end'>
              <div>
                <div>Hormat Kami</div>
                <div className='mt-10'>{appName.toUpperCase()}</div>
              </div>
            </div>
            {invoice.status == 'paid' && (
              <div className='mt-5 print:hidden'>
                <SecondaryButton className='space-x-2' onClick={handlePrintWindow}>
                  <IoPrintOutline className='text-xl' /> <span>Print Invoice</span>
                </SecondaryButton>
              </div>
            )}
            {invoice.status == 'pending' && (
              <div className='mt-3'>
                <hr className='border-black' />
                <div className='sm:flex sm:space-x-3'>
                  <div className='mt-3 space-y-2 sm:w-1/2'>
                    <div>Silakan Lakukan Pembayaran via Transfer Bank: </div>
                    <div className='text-xl flex justify-between'>
                      <div>
                        {bank.provider} {bank.account}
                      </div>
                      <div>
                        <button className='btn btn-xs' onClick={handleCopy}>
                          {copyLabel}
                        </button>
                      </div>
                    </div>
                    <div className='text-xl'>an {bank.name}</div>
                  </div>
                  <div className='mt-3 space-y-2 sm:w-1/2'>
                    <div>Konfirmasi: </div>
                    <div>
                      <SuccessButton type='button' className='space-x-2' onClick={handleConfirm}>
                        <span>
                          <IoLogoWhatsapp />
                        </span>
                        <span>Konfirmasi Pembayaran</span>
                      </SuccessButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

Show.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Detail Invoice WhatsApp</Header>}
		children={page}
		user={page.props.auth.user}
		role={page.props.role}
		organization={page.props.organization}
		title='WhatsApp'
		backLink={
			<Link href={route('add-ons.whatsapp-invoice', page.props.organization.id)}>
        <IoArrowBackOutline />
			</Link>
	  }
    breadcrumbs={
			<div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('add-ons', page.props.organization.id)}>Add-ons</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('add-ons.whatsapp', page.props.organization.id)}>WhatsApp Broadcast</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('add-ons.whatsapp-invoice', page.props.organization.id)}>Data Invoice</Link>
          </li>
          <li>Detail</li>
        </ul>
			</div>
		}
	/>
);