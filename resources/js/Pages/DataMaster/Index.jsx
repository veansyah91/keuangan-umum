import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, usePage } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoIdCardOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdChecklist } from 'react-icons/md';
import { LiaClipboardListSolid, LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { CgListTree } from 'react-icons/cg';
import { TbBuildingCommunity } from 'react-icons/tb';
import { BsBuildings } from 'react-icons/bs';
import { IoMdPeople } from 'react-icons/io';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BiCategory, BiDetail } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import { RiFileListLine } from 'react-icons/ri';


export default function Index({ organization }) {
	const { errors } = usePage().props;

	useEffect(() => {
		errors && 
		toast.error(errors.message, {
			position: toast.POSITION.TOP_CENTER,
		});
	},[]);

	return (
		<>
			<Head title='Data Master' />
			<ToastContainer />

			{/* Desktop */}
			<ContainerDesktop>
				<section>
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
				</section>
				<section className='text-center font-bold'>
					<section className='pt-2 pb-10 space-y-3'>
						<div className='text-center font-bold'>
							Siswa
						</div>
							<div className='flex justify-center gap-6'>
								<Link 
									href={route('data-master.students', organization.id)}
									onError={errors => 
										toast.error(errors.message, {
											position: toast.POSITION.TOP_CENTER,
										})
									}    
								>
									<CardMenu 
										bgColor={'bg-green-500'} 
										icon={<IoMdPeople />} 
										title={'Data Siswa'} 
									/>
								</Link>
								<Link href={route('data-master.student-payment-category', organization.id)}>
									<CardMenu 
										bgColor={'bg-orange-900'} 
										icon={<BiDetail />} 
										title={'Rincian Biaya Bulanan'} 
									/>
								</Link>
								<Link href={route('data-master.student-entry-payment-category', organization.id)}>
									<CardMenu 
										bgColor={'bg-slate-900'} 
										icon={<BiCategory />} 
										title={'Rincian Biaya Masuk'} 
									/>
								</Link>
							</div>
					</section>  
					<section className='pt-2 pb-10 space-y-3'>
						<div className='text-center font-bold'>
							Staff
						</div>
						<div className='flex justify-center gap-6'>
							<Link 
								href={route('data-master.staff', organization.id)}
							>
								<CardMenu 
									bgColor={'bg-cyan-900'} 
									icon={<FaPeopleGroup />} 
									title={'Data Staf'} 
								/>
							</Link>
							<Link href={route('data-master.salary-category', organization.id)}>
								<CardMenu 
									bgColor={'bg-rose-700'} 
									icon={<RiFileListLine />} 
									title={'Rincian Penggajian'} 
								/>
							</Link>
						</div>
					</section>  
				</section>
			</ContainerDesktop>
			{/* Desktop */}

			{/* Mobile */}
			<section>
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

				<div className='sm:hidden pt-2 pb-5 px-2 mx-auto bg-white '>
					<div className='text-center font-bold'>
						Siswa
					</div>
					<div className='flex flex-wrap gap-2 w-full justify-center'>
						<Link 
							href={route('data-master.students', organization.id)}
							onError={errors => 
								toast.error(errors.message, {
									position: toast.POSITION.TOP_CENTER,
								})
							}    
						>
							<CardMenu 
								bgColor={'bg-green-500'} 
								icon={<IoMdPeople />} 
								title={'Data Siswa'} 
							/>
						</Link>
						<Link href={route('data-master.student-payment-category', organization.id)}>
							<CardMenu 
								bgColor={'bg-orange-900'} 
								icon={<BiDetail />} 
								title={'Rincian Biaya Bulanan'} 
							/>
						</Link>
						<Link href={route('data-master.student-entry-payment-category', organization.id)}>
							<CardMenu 
								bgColor={'bg-slate-900'} 
								icon={<BiCategory />} 
								title={'Rincian Biaya Masuk'} 
							/>
						</Link>
					</div>
				</div>

				<div className='sm:hidden pt-2 pb-5 px-2 mx-auto bg-white '>
					<div className='text-center font-bold'>
						Staff
					</div>
					<div className='flex flex-wrap gap-2 w-full justify-center'>
						<Link 
							href={route('data-master.staff', organization.id)}
						>
							<CardMenu 
								bgColor={'bg-cyan-900'} 
								icon={<FaPeopleGroup />} 
								title={'Data Staf'} 
							/>
						</Link>
						<Link href={route('data-master.salary-category', organization.id)}>
							<CardMenu 
								bgColor={'bg-rose-700'} 
								icon={<RiFileListLine />} 
								title={'Rincian Penggajian'} 
							/>
						</Link>
					</div>
				</div>
			</section>
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
