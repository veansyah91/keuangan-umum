import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { PiNotebook } from "react-icons/pi";
import { LiaClipboardListSolid } from 'react-icons/lia';
import { RiBook2Line, RiBookletLine } from "react-icons/ri";

export default function Index({organization}) {
    return (
        <>
            <Head title='Data ledger' />
            {/* Desktop */}
            <ContainerDesktop>
                <div className='flex justify-start pt-5 pb-10 gap-2'>
                    <Link href={route('data-ledger.account-category', organization.id)}>
                        <CardMenu 
                            bgColor={'bg-cyan-500'}
                            icon={<LiaClipboardListSolid />}
                            title={'Data Kategori Akun'}
                        />
                    </Link>
                    <Link href={route('data-ledger.account', organization.id)}>
                        <CardMenu 
                            bgColor={'bg-orange-500'}
                            icon={<PiNotebook />}
                            title={'Data Akun'}
                        />
                    </Link>
                    <Link href={route('data-ledger.journal', organization.id)}>
                        <CardMenu 
                            bgColor={'bg-emerald-500'}
                            icon={<RiBookletLine />}
                            title={'Jurnal Umum'}
                        />
                    </Link>
                </div>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Mobile */}
            <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
                <Link href={route('data-ledger.account-category', organization.id)}>
                    <CardMenu 
                        bgColor={'bg-cyan-500'}
                        icon={<LiaClipboardListSolid />}
                        title={'Data Kategori Akun'}
                    />
                </Link>
                <Link href={route('data-ledger.account', organization.id)}>
                    <CardMenu 
                        bgColor={'bg-orange-500'}
                        icon={<PiNotebook />}
                        title={'Data Akun'}
                    />
                </Link>        
                <Link href={route('data-ledger.journal', organization.id)}>
                    <CardMenu 
                        bgColor={'bg-emerald-500'}
                        icon={<RiBookletLine />}
                        title={'Jurnal Umum'}
                    />
                </Link>        
            </div>
            {/* Mobile */}

        </>
    )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header></Header>}
    children={page}
    user={page.props.auth.user}
    role={page.props.role}
    organization={page.props.organization}
    title="Buku Besar"
/>
