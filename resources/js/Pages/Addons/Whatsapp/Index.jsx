import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { FaArrowCircleLeft, FaWhatsapp } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import { IoArrowBackOutline, IoSettingsSharp } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function Index({ organization }) {
  return (
    <>
			<Head title='Add-ons' />
			<ToastContainer />

			{/* Desktop */}
			<ContainerDesktop>
        <div className='flex'>
          <section className='w-1/12 my-auto'>
            <Link href={route('add-ons', {organization: organization.id})}>
							<FaArrowCircleLeft size={50} color='gray'/>
            </Link>
          </section>
          <section>
            <div className='flex flex-wrap justify-center pt-5 pb-10 gap-5'>
              <Link href={route('add-ons.whatsapp.status', organization.id)}>
                <CardMenu bgColor={'bg-slate-500'} icon={<IoSettingsSharp />} title={'Status'} />
              </Link>
							<Link href={route('add-ons.whatsapp.status', organization.id)}>
                <CardMenu bgColor={'bg-red-500'} icon={<LiaFileInvoiceSolid />} title={'Berlangganan'} />
              </Link>
            </div>
          </section>
        </div>
				
			</ContainerDesktop>
			{/* Desktop */}

			{/* Mobile */}
			<section>
				<div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
					<Link href={route('add-ons.whatsapp.status', organization.id)}>
						<CardMenu bgColor={'bg-slate-500'} icon={<IoSettingsSharp />} title={'Status'} />
					</Link>
					<Link href={route('add-ons.whatsapp.status', organization.id)}>
							<CardMenu bgColor={'bg-red-500'} icon={<LiaFileInvoiceSolid />} title={'Berlangganan'} />
						</Link>
				</div>
			</section>
			{/* Mobile */}
		</>
  )
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header></Header>}
		children={page}
		user={page.props.auth.user}
		role={page.props.role}
		organization={page.props.organization}
		title='WhatsApp'
		backLink={
			<Link href={route('add-ons', page.props.organization.id)}>
					<IoArrowBackOutline />
			</Link>
	}
	/>
);
