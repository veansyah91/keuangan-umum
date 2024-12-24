import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { PiNotebook } from 'react-icons/pi';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { RiBookletLine } from 'react-icons/ri';
import { IoMdList } from 'react-icons/io';

export default function Index({ organization }) {
	return (
		<>
			<Head title='Data Akun' />
			{/* Desktop */}
			<ContainerDesktop>
				<section>	
					<div className='mx-auto w-full text-center font-bold'>Akun-Akun</div>
					<div className='flex justify-center pt-5 pb-10 gap-5'>
						<Link href={route('data-ledger.account-category', organization.id)}>
							<CardMenu
								bgColor={'bg-cyan-500'}
								icon={<LiaClipboardListSolid />}
								title={'Data Kategori Akun'}
							/>
						</Link>
						<Link href={route('data-ledger.account', organization.id)}>
							<CardMenu bgColor={'bg-orange-500'} icon={<PiNotebook />} title={'Daftar Akun'} />
						</Link>				
					</div>
					<div className='mx-auto w-full text-center font-bold'>Sekolah</div>
					<div className='flex justify-center pt-5 pb-10 gap-5'>		
						<Link href={route('data-ledger.account-school', organization.id)}>
							<CardMenu bgColor={'bg-slate-500'} icon={<IoMdList />} title={'Daftar Akun Sekolah'} />
						</Link>					
					</div>
				</section>
				<section>
					<div className='mx-auto w-full text-center font-bold'>Jurnal</div>

					<div className='flex justify-center pt-5 pb-10 gap-5'>
						<Link href={route('data-ledger.journal', organization.id)}>
							<CardMenu bgColor={'bg-emerald-500'} icon={<RiBookletLine />} title={'Jurnal Umum'} />
						</Link>
					</div>
				</section>
			</ContainerDesktop>
			{/* Desktop */}

			{/* Mobile */}
			<div className='sm:hidden pt-14 pb-5 px-2 mx-auto bg-white '>
				<div className='mx-auto w-full text-center font-bold'>Akun-Akun</div>
				<div className='flex flex-wrap gap-2 w-full justify-center'>
					<Link href={route('data-ledger.account-category', organization.id)}>
						<CardMenu bgColor={'bg-cyan-500'} icon={<LiaClipboardListSolid />} title={'Data Kategori Akun'} />
					</Link>
					<Link href={route('data-ledger.account', organization.id)}>
						<CardMenu bgColor={'bg-orange-500'} icon={<PiNotebook />} title={'Data Akun'} />
					</Link>
				</div>
				<div className='mx-auto w-full text-center font-bold pt-2'>Sekolah</div>
				<div className='flex flex-wrap gap-2 w-full justify-center'>
					<Link href={route('data-ledger.account-school', organization.id)}>
						<CardMenu bgColor={'bg-slate-500'} icon={<IoMdList />} title={'Daftar Akun Sekolah'} />
					</Link>		
				</div>
				<div className='flex flex-wrap gap-2 w-full justify-center mt-5'>
					<Link href={route('data-ledger.journal', organization.id)}>
						<CardMenu bgColor={'bg-emerald-500'} icon={<RiBookletLine />} title={'Jurnal Umum'} />
					</Link>
				</div>
				
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
        title='Buku Besar'
    />
);
