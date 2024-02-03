import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import Container from './Components/Container';
import Header from '@/Components/Header';
import { IoAddCircleOutline, IoArrowBackOutline, IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5';
import TextInput from '@/Components/TextInput';
import rupiah from '@/Utils/rupiah';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Invoice({ organization, organizationInvoices, searchFilter }) {
    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const prevSearch = usePrevious(search);

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleSearch();
        }
    },[debounceValue]);

    const handleSearch = _ => {
        router.reload({ 
            only: ['organizationInvoices'],
            data: {
                search
            }
         });
    }

    return (
        <>
            <Head title='Organization' />

            <Container>
                {/* Mobile */}
                <div className='sm:hidden'>     
                    {/* Title*/}
                    <div className={'px-6 py-6 fixed w-full bg-white z-20'}>
                        <div className='flex '>
                            <Link href='/organizations' className='w-2/12 my-auto text-lg'>
                                <IoArrowBackOutline />     
                            </Link> 
                            <Header>
                                Invoice Perpanjangan Layanan               
                            </Header>
                            
                        </div>
                        <div className='mt-5'>
                            {/* Input Search */}
                            <div className='flex w-full border px-3 rounded-lg'>
                                <input type="search" className='border-0 w-full focus:border-0 focus:border-white focus:ring-0' placeholder='Cari Invoice' onChange={e => setSearch(e.target.value)}/>
                                
                            </div>
                        </div>
                    </div>
                    
                    <div className='pt-32 text-gray-800'>
                        {
                            organizationInvoices.map((organizationInvoice, index) =>
                                <div key={index} className='bg-white shadow-sm px-6 py-3 flex border'>
                                    <div className='w-6/12'>
                                        <div>{organizationInvoice.no_ref}</div>
                                        <div className='uppercase'>{organizationInvoice.product}</div>
                                        <div>Status: 
                                            <span 
                                                className={`italic
                                                    ${organizationInvoice.status == 'paid' && 'text-green-600'}
                                                    ${organizationInvoice.status == 'pending' && 'text-yellow-600'}
                                                    ${organizationInvoice.status == 'canceled' && 'text-red-600'}
                                                `}
                                            >
                                                {organizationInvoice.status == 'paid' && 'Telah Bayar'}                                            
                                                {organizationInvoice.status == 'pending' && 'Menunggu'}                                            
                                                {organizationInvoice.status == 'canceled' && 'Dibatalkan'}                                            
                                            </span> 
                                        </div>
                                    </div>
                                    <div className='w-5/12 text-end text-xl my-auto'>
                                    {
                                        rupiah(organizationInvoice.price)
                                    }                                        
                                    </div>
                                    <div className='w-1/12 my-auto text-end'>
                                        <div className="dropdown dropdown-left">
                                            <div tabIndex={0} role="button" className="btn bg-white border-none hover:bg-gray-100"><IoEllipsisVertical /></div>
                                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                                                <li>
                                                    <Link href={`/organizations/${organization.id}/invoices/${organizationInvoice.id}`}>
                                                        <IoSearchOutline /> Detail
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div> 
                                    </div>
                                </div>
                            )
                        }
                        
                    </div>              
                </div>

                {/* Desktop */}
                <div className='hidden sm:block'>
                    {/* Header */}
                    <div className='pb-4'>
                        <div className='flex py-6'>
                            <div className='w-1/2 text-end text-sm breadcrumbs my-auto'>
                                <ul>
                                    <li className='font-bold'>
                                        <Link href='/organizations'>Daftar Organisasi</Link>
                                    </li> 
                                    <li>Invoice Perpanjangan Layanan </li>
                                </ul>
                            </div>
                            <div className='w-1/2 my-auto text-end'>
                                <Header>
                                    Invoice Perpanjangan Layanan               
                                </Header>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <TextInput className="w-1/2" type="search" placeholder='Cari Invoice' onChange={e => setSearch(e.target.value)}/>
                            <Link href={`/organizations/${organization.id}/invoices/create`}>
                                <PrimaryButton className='space-x-2'>
                                    <IoAddCircleOutline className='text-xl'/><span>Berlangganan</span>
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    <section className='py-3'>
                        {/* Table Header */}
                        <div className='flex font-bold border-b-2 pb-2 border-gray-500'>
                            <div className='w-3/12 text-center'>Tanggal</div>
                            <div className='w-2/12 text-center'>No Ref</div>
                            <div className='w-2/12 text-center'>Layanan</div>
                            <div className='w-2/12 text-center'>Status</div>
                            <div className='w-2/12 text-end'>Total</div>
                            <div className='w-1/12 text-center'></div>
                        </div>
                        <div className='max-h-[24rem] overflow-auto z-20'>
                            {organizationInvoices.map( (organizationInvoice, index) =>
                                <div className='flex my-3' key={index}>
                                    <div className='w-3/12 text-center my-auto'>{organizationInvoice.date}</div>
                                    <div className='w-2/12 text-center my-auto'>{organizationInvoice.no_ref}</div>
                                    <div className='w-2/12 text-center my-auto'>{organizationInvoice.product}</div>
                                    <div className=
                                        {`w-2/12 text-center my-auto
                                            ${organizationInvoice.status == 'paid' && 'text-green-600'}
                                            ${organizationInvoice.status == 'pending' && 'text-yellow-600'}
                                            ${organizationInvoice.status == 'canceled' && 'text-red-600'}
                                        `}
                                    >
                                        {organizationInvoice.status == 'paid' && 'Telah Bayar'}                                            
                                        {organizationInvoice.status == 'pending' && 'Menunggu'}                                            
                                        {organizationInvoice.status == 'canceled' && 'Dibatalkan'}               
                                    </div>
                                    <div className='w-2/12 text-end my-auto'>{
                                        rupiah(organizationInvoice.price)
                                    }  </div>
                                    <div className='w-1/12 text-end dropdown dropdown-left'>
                                        <div tabIndex={0} role="button" className="btn bg-white border-none hover:bg-gray-100"><IoEllipsisVertical /></div>
                                        <ul tabIndex={0} className="dropdown-content menu p-2 bg-base-100 rounded-box w-52 z-10">
                                            <li>
                                                <Link href={`/organizations/${organization.id}/invoices/${organizationInvoice.id}`}>
                                                    <IoSearchOutline /> Detail
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                                        
            </Container>

        </>
    )
}
