import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoIdCardOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdChecklist } from 'react-icons/md';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { CgListTree } from 'react-icons/cg';
import { TbBuildingCommunity } from 'react-icons/tb';
import { BsBuildings } from 'react-icons/bs';

export default function Index({ organization, role }) {
    return (
        <>
            <Head title='Data Master' />
            {/* Desktop */}
            <ContainerDesktop>
                <div className='flex flex-wrap justify-center pt-5 pb-10 gap-5'>
                    <Link href={route('data-master.contact-category', organization.id)}>
                        <CardMenu bgColor={'bg-cyan-500'} icon={<IoIdCardOutline />} title={'Data Kategori Kontak'} />
                    </Link>
                    <Link href={route('data-master.contact', organization.id)}>
                        <CardMenu bgColor={'bg-orange-500'} icon={<IoPeopleOutline />} title={'Data Kontak'} />
                    </Link>
                    <Link href={route('data-master.project', organization.id)}>
                        <CardMenu bgColor={'bg-emerald-500'} icon={<MdChecklist />} title={'Data Proyek'} />
                    </Link>
                    <Link href={route('data-master.program', organization.id)}>
                        <CardMenu
                            bgColor={'bg-red-500'}
                            icon={<LiaClipboardListSolid />}
                            title={'Data Program Kegiatan'}
                        />
                    </Link>
                    <Link href={route('data-master.department', organization.id)}>
                        <CardMenu bgColor={'bg-slate-500'} icon={<CgListTree />} title={'Data Departemen'} />
                    </Link>
                    <Link href={route('data-master.fixed-asset-category', organization.id)}>
                        <CardMenu
                            bgColor={'bg-blue-500'}
                            icon={<TbBuildingCommunity />}
                            title={'Kelompok Harta Tetap'}
                        />
                    </Link>
                    <Link href={route('data-master.fixed-asset', organization.id)}>
                        <CardMenu bgColor={'bg-rose-500'} icon={<BsBuildings />} title={'Data Harta Tetap'} />
                    </Link>
                </div>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Mobile */}
            <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
                <Link href={route('data-master.contact-category', organization.id)}>
                    <CardMenu bgColor={'bg-cyan-500'} icon={<IoIdCardOutline />} title={'Data Kategori Kontak'} />
                </Link>
                <Link href={route('data-master.contact', organization.id)}>
                    <CardMenu bgColor={'bg-orange-500'} icon={<IoPeopleOutline />} title={'Data Kontak'} />
                </Link>
                <Link href={route('data-master.project', organization.id)}>
                    <CardMenu bgColor={'bg-emerald-500'} icon={<MdChecklist />} title={'Data Proyek'} />
                </Link>
                <Link href={route('data-master.program', organization.id)}>
                    <CardMenu bgColor={'bg-red-500'} icon={<LiaClipboardListSolid />} title={'Data Program Kegiatan'} />
                </Link>
                <Link href={route('data-master.department', organization.id)}>
                    <CardMenu bgColor={'bg-slate-500'} icon={<CgListTree />} title={'Data Departemen'} />
                </Link>
                <Link href={route('data-master.fixed-asset-category', organization.id)}>
                    <CardMenu bgColor={'bg-blue-500'} icon={<TbBuildingCommunity />} title={'Kelompok Harta Tetap'} />
                </Link>
                <Link href={route('data-master.fixed-asset', organization.id)}>
                    <CardMenu bgColor={'bg-rose-500'} icon={<BsBuildings />} title={'Data Harta Tetap'} />
                </Link>
            </div>
            {/* Mobile */}
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header></Header>}
        children={page}
        user={page.props.auth.user}
        role={page.props.role}
        organization={page.props.organization}
        title='Data Master'
    />
);
