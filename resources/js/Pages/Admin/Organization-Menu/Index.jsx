import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import { IoReaderOutline } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import CardMenu from '@/Components/CardMenu';

export default function Index() {
  return (
    <>
        <Head title='Organisasi' />

        {/* Desktop */}
        <ContainerDesktop>
            <div className='flex justify-start pt-5 pb-10 gap-2'>
                <Link href={route('admin.organization.index')}>
                    <CardMenu 
                        bgColor={'bg-orange-500'}
                        icon={<IoReaderOutline/>}
                        title={'Daftar Organisasi'}
                    />
                </Link>
                <Link href={route('admin.organization.invoice.index')}>
                    <CardMenu 
                        bgColor={'bg-cyan-500'}
                        icon={<LiaFileInvoiceSolid/>}
                        title={'Invoice Organisasi'}
                    />
                </Link>
            </div>
        </ContainerDesktop>

        {/* Desktop */}

        {/* Mobile */}
            <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
                <Link href={route('admin.organization.index')}>
                    <CardMenu 
                        bgColor={'bg-orange-500'}
                        icon={<IoReaderOutline/>}
                        title={'Daftar Organisasi'}
                    />
                </Link>
                <Link href={route('admin.organization.invoice.index')}>
                    <CardMenu 
                        bgColor={'bg-cyan-500'}
                        icon={<LiaFileInvoiceSolid/>}
                        title={'Invoice Organisasi'}
                    />
                </Link>
            </div>
        {/* Mobile */}
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Organisasi</Header>}
    children={page}
    user={page.props.auth.user}
    title="Organisasi"
/>
