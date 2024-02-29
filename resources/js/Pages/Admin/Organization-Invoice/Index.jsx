import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoCalendarOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp, IoTrash } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Datepicker from 'react-tailwindcss-datepicker';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import OrganizationInvoiceMobile from './Components/OrganizationInvoiceMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import rupiah from '@/Utils/rupiah';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import OrganizationInvoiceDesktop from './Components/OrganizationInvoiceDesktop';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';
import PageNumber from '@/Components/PageNumber';

export default function Index({organizations, organizationInvoices, searchFilter, statusFilter, productFilter, searchOrganization}) {
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [showModalUpdateStatus, setShowModalUpdateStatus] = useState(false);

    // Filter
    const [search, setSearch] = useState(searchFilter || '');
    const [dataFilter, setDataFilter] = useState({
        status: statusFilter || '',
        product: productFilter || ''
    })
    const [dateValue, setDateValue] = useState({
        startDate: '', 
        endDate: ''
    });
    const [debounceValue] = useDebounce(search, 500);
    const [debounceDateValue] = useDebounce(dateValue, 500);
    const prevSearch = usePrevious(search);

    // Select Input
    // Organization Select
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [queryOrganization, setQueryOrganization] = useState(searchOrganization || '');
    const [debounceQueryOrganization] = useDebounce(queryOrganization, 500);

    // update
    const [organizationUpdate, setOrganizationUpdate] = useState({
        organizationName : '',
        id: '',
        status: '',
        noRef: '',
        product:'',
        price: 0
    });

    const {data, setData, patch, processing, reset} = useForm({
        status : '',
        product: '',
        price: 0
    });

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPage();
        }
    }, [debounceValue, debounceDateValue]);

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPageOnlyOrganization();
            
        }
    }, [debounceQueryOrganization, selectedOrganization]);

    const handleFilter = (e) => {
        e.preventDefault();
        setShowModalFilter(false);
        handleReloadPage();        
    }
        
    const handleReloadPage = () => {
        router.reload({ 
            only: ['organizationInvoices'],
            data: {
                search, 
                'start_date' : dateValue.startDate, 
                'end_date' : dateValue.endDate,
                'status' : dataFilter.status,
                'product' : dataFilter.product,
                'organization_id' : selectedOrganization.id
            },
            preserveState: true
         });
    } ;

    const handleReloadPageOnlyOrganization = () => {
        router.reload({ 
            only: ['organizations'],
            data: {
                'searchOrganization' : queryOrganization
            },
            preserveState: true
         });
    }    

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue); 
    } 

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    }

    const handleOrganizationInvoiceEdit = (organizationInvoice) => {
        setOrganizationUpdate({
            organizationName: organizationInvoice.organization.name,
            id: organizationInvoice.id,
            status: organizationInvoice.status,
            noRef: organizationInvoice.no_ref,
            product: organizationInvoice.product,
            price: organizationInvoice.price,
        });

        setData({
            status : organizationInvoice.status,
            product: organizationInvoice.product,
            price: organizationInvoice.price
        });
        setShowModalUpdateStatus(true)
    }

    const handleDeleteOrganizationFilter = () => {
        setSelectedOrganization('');
        setQueryOrganization('');
    }

    const updateOrganizationInvoiceStatus = (e) => {
        e.preventDefault();
        patch(route('admin.organization.invoice.payment.confirmation', organizationUpdate.id), {
            onSuccess: () => {
                setShowModalUpdateStatus(false);
                toast.success(`Pembayaran Invoice No. Ref ${organizationUpdate.noRef} Berhasil Dikonfirmasi`, {
                    position: toast.POSITION.TOP_CENTER
                });
                reset();
            }
        })
    }

    return (
        <>
            <Head title='Invoice Organisasi' />
            <ToastContainer />  

            {/* Mobile */}
                <TitleMobile 
                    zIndex={'z-50'}
                    search={search}
                    setSearch= {e => setSearch(e.target.value)}
                    pageBefore={
                        organizationInvoices.links[0].url 
                        ? <Link href={`/admin/data-master/organizationInvoices?page=${organizationInvoices.current_page - 1}&search=${search}`}preserveState><IoPlayBack /></Link>
                        : <div className='text-gray-300'><IoPlayBack /></div>
                    }
                    pageAfter={
                        organizationInvoices.links[organizationInvoices.links.length-1].url 
                        ? <Link href={`/admin/data-master/organizationInvoices?page=${organizationInvoices.current_page + 1}&search=${search}`}
                            only={['organizationInvoices']} preserveState>
                            <IoPlayForward />
                        </Link>
                        : <div className='text-gray-300'><IoPlayForward /></div>
                    }
                    page={
                        <>
                            {organizationInvoices.current_page}/{organizationInvoices.last_page}
                        </>
                    }
                    data={organizationInvoices}
                    hasFilter={true}
                    showFilter={() => setShowModalFilter(true)}
                    hasDate={true}
                    dateValue={dateValue}
                    onChangeDate={handleDateValueChange}
                />

                <ContentMobile>
                {
                    organizationInvoices.data.map(organizationInvoice => 
                        <OrganizationInvoiceMobile 
                            organizationInvoice={organizationInvoice} 
                            key={organizationInvoice.id}
                            handleEdit={() => handleOrganizationInvoiceEdit(organizationInvoice)}
                        />
                    )
                }
                </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
                <ContainerDesktop>
                    {/* Title, Pagination, Search */}
                    <TitleDesktop>
                        <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button>
                        <div className='w-1/4 my-auto '>
                            <Datepicker
                                value={dateValue} 
                                onChange={handleDateValueChange} 
                                showShortcuts={true} 
                                classNames={'border-2'}
                                separator={" - "} 
                            />
                        </div>
                        
                        <div className='w-1/4 border flex rounded-lg'>
                            <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                            <input id='search-input' name='search-input' type="search" placeholder='Cari Invoice Organisasi' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                            onChange={e => setSearch(e.target.value)}/>
                        </div>

                        <div className='italic text-xs my-auto w-1/12 text-center'>
                            <PageNumber data={organizationInvoices} />
                        </div>

                        <div className='my-auto flex space-x-2 w-1/12'>
                            <div className='my-auto'>
                                {
                                    organizationInvoices.links[0].url 
                                    ? <Link href={`/admin/organizations?page=${organizationInvoices.current_page - 1}&search=${search}&start_date=${dateValue.startDate}&end_date=${dateValue.endDate}&status=${dataFilter.status}&product=${dataFilter.product}&organization_id=${selectedOrganization.id}`}preserveState><IoPlayBack /></Link>
                                    : <div className='text-gray-300'><IoPlayBack /></div>
                                }                                
                            </div>
                            <div className='my-auto'>{organizationInvoices.current_page}/{organizationInvoices.last_page}</div>
                            <div className='my-auto'>
                                {
                                    organizationInvoices.links[organizationInvoices.links.length-1].url 
                                    ? <Link href={`/admin/organizations?page=${organizationInvoices.current_page + 1}&search=${search}&start_date=${dateValue.startDate}&end_date=${dateValue.endDate}&status=${dataFilter.status}&product=${dataFilter.product}&organization_id=${selectedOrganization.id}`}
                                        only={['organizations']} preserveState>
                                        <IoPlayForward />
                                    </Link>
                                    : <div className='text-gray-300'><IoPlayForward /></div>
                                }   
                            </div>
                        </div>
                    </TitleDesktop>

                    <ContentDesktop>
                        <table className='table table-pin-rows table-pin-cols text-base'>
                            <thead className='text-base text-gray-900'>
                                <tr className=''>
                                    <th className='bg-gray-200'>Organisasi</th>
                                    <th className='bg-gray-200'>No Ref</th>
                                    <th className='bg-gray-200'>Product</th>
                                    <th className='bg-gray-200 text-end'>Harga</th>
                                    <th className='bg-gray-200'>Status</th>
                                    <th className='bg-gray-200'>Dibuat Tanggal</th>
                                    <th className='bg-gray-200'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    organizationInvoices.data.map((organizationInvoice, index) =>
                                        <OrganizationInvoiceDesktop 
                                            key={index} 
                                            organizationInvoice={organizationInvoice} 
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                                            handleEdit={() => handleOrganizationInvoiceEdit(organizationInvoice)}/>
                                    )
                                }
                            </tbody>
                        </table>                                
                    </ContentDesktop>
                </ContainerDesktop>
            {/* Desktop */}

            {/* Modal */}
                {/* Update Status */}
                    <Modal show={showModalUpdateStatus} onClose={() => setShowModalUpdateStatus(false)}>
                        <form 
                            onSubmit={updateOrganizationInvoiceStatus} 
                            className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Konfirmasi Pembayaran
                            </h2>

                            <div className="mt-6 ">
                                <div className='flex gap-2'>
                                    <div className='w-1/4 flex justify-between'>
                                        <div>No Ref</div>
                                        <div>:</div>
                                    </div>
                                    <div className='w-3/4'>{organizationUpdate.noRef}</div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='w-1/4 flex justify-between'>
                                        <div>Organisasi</div>
                                        <div>:</div>
                                    </div>
                                    <div className='w-3/4'>{organizationUpdate.organizationName}</div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='w-1/4 flex justify-between'>
                                        <div>Produk</div>
                                        <div>:</div>
                                    </div>
                                    <div className='w-3/4'>{organizationUpdate.product}</div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='w-1/4 flex justify-between'>
                                        <div>Harga</div>
                                        <div>:</div>
                                    </div>
                                    <div className='w-3/4'>{rupiah(organizationUpdate.price)}</div>
                                </div>
                                
                            </div>

                            <div className="mt-6 flex sm:flex-row flex-col-reverse gap-2 sm:gap-0 sm:justify-end">
                                <SecondaryButton 
                                    onClick={() => setShowModalUpdateStatus(false)}
                                >
                                    <div className='w-full'>
                                        Batal
                                    </div>
                                </SecondaryButton>

                                {/* Mobile */}
                                <PrimaryButton className="sm:hidden" 
                                    disabled={processing}
                                    >
                                    <div className='w-full'>
                                        Konfirmasi Pembayaran
                                    </div>
                                </PrimaryButton>

                                {/* Desktop */}
                                <PrimaryButton className="ms-3 hidden sm:block" 
                                    disabled={processing}
                                    >
                                    Konfirmasi Pembayaran
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>
                {/* Update Status */}

                {/* Modal Filter */}
                    <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
                        <form 
                            onSubmit={handleFilter} 
                            className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Filter Organisasi
                            </h2>

                            <div className="mt-6 space-y-2">
                                <div className='flex w-full gap-1'>
                                    <div className='w-3/12 my-auto'>Organisasi</div>
                                    <div className='w-8/12'>
                                        <GeneralSelectInput 
                                            data={organizations}
                                            selected={selectedOrganization}
                                            setSelected={setSelectedOrganization}
                                            query={queryOrganization}
                                            setQuery={setQueryOrganization}
                                            maxHeight='max-h-40'
                                            placeholder='Cari Organisasi'
                                        />
                                    </div>
                                    <div className='w-1/12 my-auto'>
                                        {
                                            selectedOrganization && <button className='p-2' onClick={handleDeleteOrganizationFilter}><IoTrash /></button>
                                        }
                                        
                                    </div>
                                </div>
                                <div className='flex w-full gap-1'>
                                    <div className='w-3/12 my-auto'>Status</div>
                                    <div className='w-8/12'>
                                        <select className="w-full rounded-lg border-gray-300" onChange={(e) => setDataFilter({status: e.target.value})} value={dataFilter.status}>
                                            <option value=''>Semua</option>
                                            <option value="pending">Menunggu</option>
                                            <option value="paid">Lunas</option>
                                            <option value="canceled">Batal</option>
                                        </select>
                                    </div>
                                    <div className='w-1/12 my-auto'>
                                        
                                    </div>
                                </div>
                                <div className='flex w-full gap-1'>
                                    <div className='w-3/12 my-auto'>Produk</div>
                                    <div className='w-8/12'>
                                        <select className="w-full rounded-lg border-gray-300" onChange={(e) => setDataFilter({product: e.target.value})} value={dataFilter.product}>
                                            <option value=''>Semua</option>
                                            <option value="Bulanan">Bulanan</option>
                                            <option value="Tahunan">Tahunan</option>
                                        </select>
                                    </div>
                                    <div className='w-1/12 my-auto'>
                                        
                                    </div>
                                </div>
                                
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

                                <PrimaryButton className="ms-3">
                                    Filter
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>
                {/* Modal Filter */}

            {/* Modal */}
        </>
    )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Invoice Organisasi</Header>}
    breadcrumbs={<div className="text-sm breadcrumbs">
                    <ul>
                        <li className='font-bold'><Link href={route('admin.organization.menu')}>Organisasi</Link></li> 
                        <li>Invoice Organisasi</li>
                    </ul>
                </div>}
    children={page}
    user={page.props.auth.user}
    title="Invoice Organisasi"
    backLink={<Link href={route('admin.organization.menu')}><IoArrowBackOutline/></Link>}
/>
