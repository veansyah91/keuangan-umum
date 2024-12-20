import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, usePage } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { FaWhatsapp } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';

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
			<Head title='Add-ons' />
			<ToastContainer />

			{/* Desktop */}
			<ContainerDesktop>
				<section>
					<div className='flex flex-wrap justify-center pt-5 pb-10 gap-5'>
						<Link href={route('add-ons.whatsapp', organization.id)}>
							<CardMenu bgColor={'bg-green-500'} icon={<FaWhatsapp />} title={'WhatsApp Broadcast'} />
						</Link>
					</div>
				</section>
			</ContainerDesktop>
			{/* Desktop */}

			{/* Mobile */}
			<section>
				<div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
					<Link href={route('add-ons.whatsapp', organization.id)}>
						<CardMenu bgColor={'bg-green-500'} icon={<FaWhatsapp />} title={'WhatsApp Broadcast'} />
					</Link>
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
		title='Add-ons'
	/>
);
