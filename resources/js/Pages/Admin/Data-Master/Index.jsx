import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoMap } from 'react-icons/io5';
import { MdOutlinePageview } from 'react-icons/md';
import { IoIosMenu } from 'react-icons/io';

export default function Index() {
    return (
        <>
            <Head title='Data Master' />

            {/* Desktop */}
            <ContainerDesktop>
                <div className='flex justify-center pt-5 pb-10 gap-2'>
                    <Link href={route('admin.data-master.province')}>
                        <CardMenu bgColor={'bg-orange-500'} icon={<IoMap />} title={'Data Wilayah'} />
                    </Link>
                    <Link href={route('admin.data-master.page')}>
                        <CardMenu bgColor={'bg-green-500'} icon={<MdOutlinePageview />} title={'Data Halaman'} />
                    </Link>
                    <Link href={route('admin.data-master.menu')}>
                        <CardMenu bgColor={'bg-cyan-500'} icon={<IoIosMenu  />} title={'Data Menu'} />
                    </Link>
                </div>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Mobile */}
            <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
                <Link href={route('admin.data-master.province')}>
                    <CardMenu bgColor={'bg-orange-500'} icon={<IoMap />} title={'Data Wilayah'} />
                </Link>
                <Link href={route('admin.data-master.page')}>
                    <CardMenu bgColor={'bg-green-500'} icon={<MdOutlinePageview />} title={'Data Halaman'} />
                </Link>
                <Link href={route('admin.data-master.menu')}>
                    <CardMenu bgColor={'bg-cyan-500'} icon={<IoIosMenu  />} title={'Data Menu'} />
                </Link>
            </div>
            {/* Mobile */}
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Data Master</Header>}
        children={page}
        user={page.props.auth.user}
        title='Data Master'
    />
);
