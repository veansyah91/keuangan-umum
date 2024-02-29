import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp, IoTrash } from 'react-icons/io5';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import RegencyMobile from './Components/RegencyMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import RegencyDesktop from './Components/RegencyDesktop';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import NavgroupRegional from '@/Components/NavgroupRegional';
import NavgroupRegionalMobile from '@/Components/NavgroupRegionalMobile';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';
import PageNumber from '@/Components/PageNumber';

export default function Index({regencies, provinces, provinceFilter, searchFilter}) {
    
    const [showSearch, setShowSearch] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');

    // Province Select
    const [selectedProvince, setSelectedProvince] = useState('');
    const [queryProvince, setQueryProvince] = useState(provinceFilter || '');
    const [debounceQueryProvince] = useDebounce(queryProvince, 500);

    const { data, setData, post, progress, reset, processing } = useForm({
        regency: ''
    });

    const [debounceValue] = useDebounce(search, 500);

    const prevSearch = usePrevious(search);

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPage();
        }
    }, [debounceValue]);

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPageOnlyProvince();            
        }
    }, [debounceQueryProvince, selectedProvince]);

    const handleReloadPage = () => {
        router.reload({ 
            only: ['regencies'],
            data: {
                search,
                'province' : selectedProvince ? selectedProvince.id : ''
            }
         });
    };

    const handleReloadPageOnlyProvince = () => {
        router.reload({ 
            only: ['provinces'],
            data: {
                'searchProvince' : queryProvince
            },
            preserveState: true
         });
    }    

    const handleFilter = (e) => {
        e.preventDefault();
        setShowModalFilter(false);
        handleReloadPage();        
    }

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    }

    const handleSubmitImport = (e) => {
        e.preventDefault();
        post(route('admin.data-master.regency.post'),{
            onSuccess: () => {
                reset();
                setShowModalImport(false);
                toast.success(`Kabupaten / Kota Berhasil Diimport`, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        });
    }

    const handleInputFile = (e) => {
        if (e.currentTarget.files) {
            setData("regency", e.currentTarget.files[0]);
        }
    }

    // Filter Function
    const handleDeleteProvinceFilter = () => {
        setSelectedProvince('');
        setQueryProvince('');
    }

    return (
        <>
            <Head title='Data Provinsi' />
            <ToastContainer />  

            {/* Mobile */}
                {/* Sub Nav Mobile */}
                <div className="btm-nav sm:hidden">
                    <NavgroupRegionalMobile onClick={() => setShowModalImport(true)}/>
                </div> 

                <TitleMobile 
                    zIndex={'z-50'}
                    search={search}
                    setSearch= {e => setSearch(e.target.value)}
                    pageBefore={
                        regencies.links[0].url 
                        ? <Link href={`/admin/data-master/regencies?page=${regencies.current_page - 1}&search=${search}`}preserveState><IoPlayBack /></Link>
                        : <div className='text-gray-300'><IoPlayBack /></div>
                    }
                    pageAfter={
                        regencies.links[regencies.links.length-1].url 
                        ? <Link href={`/admin/data-master/regencies?page=${regencies.current_page + 1}&search=${search}`}
                            only={['regencies']} preserveState>
                            <IoPlayForward />
                        </Link>
                        : <div className='text-gray-300'><IoPlayForward /></div>
                    }
                    page={
                        <>
                            {regencies.current_page}/{regencies.last_page}
                        </>
                    }
                    data={regencies}
                    hasFilter={true}
                    showFilter={() => setShowModalFilter(true)}
                />
                <ContentMobile>
                    {
                        regencies.data.map(regency => 
                            <RegencyMobile
                                regency={regency}
                                key={regency.id}
                            />
                        )
                    }
                </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
                <ContainerDesktop>
                {/* Title, Pagination, Search */}
                    <TitleDesktop>  
                        <div className='my-auto w-6/12'>
                            <PrimaryButton className='py-3' onClick={() => setShowModalImport(true)}>
                                Import Kabupaten / Kota
                            </PrimaryButton>
                        </div>           
                        <div className='w-1/12 text-end'>
                            <button className='p-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button> 
                        </div>
                                  
                        <div className='w-3/12 border flex rounded-lg'>
                            <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                            <input id='search-input' name='search-input' type="search" placeholder='Cari Kabupaten / Kota' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                            onChange={e => setSearch(e.target.value)}/>
                        </div>

                        <div className='italic text-xs my-auto w-1/12 text-center'>
                            <PageNumber data={regencies} />

                        </div>

                        <div className='my-auto flex space-x-2 w-1/12'>
                            <div className='my-auto'>
                                {
                                    regencies.links[0].url 
                                    ? <Link href={`/admin/data-master/regencies?page=${regencies.current_page - 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}`}preserveState><IoPlayBack /></Link>
                                    : <div className='text-gray-300'><IoPlayBack /></div>
                                }                                
                            </div>
                            <div className='my-auto'>{regencies.current_page}/{regencies.last_page}</div>
                            <div className='my-auto'>
                                {
                                    regencies.links[regencies.links.length-1].url 
                                    ? <Link href={`/admin/data-master/regencies?page=${regencies.current_page + 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}`}
                                        only={['regencies']} preserveState>
                                        <IoPlayForward />
                                    </Link>
                                    : <div className='text-gray-300'><IoPlayForward /></div>
                                }   
                            </div>
                        </div>
                    </TitleDesktop>

                    <div className='sm:flex hidden gap-5'>
                        <div className='w-11/12'>
                            <ContentDesktop>
                                <table className='table table-pin-rows table-pin-cols text-base'>
                                    <thead className='text-base text-gray-900'>
                                        <tr className=''>
                                            <th className='bg-gray-200'>Kode</th>
                                            <th className='bg-gray-200'>Nama Kabupaten / Kota</th>
                                            <th className='bg-gray-200'>Nama Provinsi</th>
                                            <th className='bg-gray-200'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            regencies.data.map((regency, index) =>
                                                <RegencyDesktop 
                                                    key={index} 
                                                    regency={regency} 
                                                    className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                                                />
                                            )
                                        }
                                    </tbody>
                                </table>
                            </ContentDesktop>
                        </div>
                        <div className='w-1/12 text-end'>
                            <NavgroupRegional />
                        </div>
                    </div>
                    
                </ContainerDesktop>
            {/* Desktop */}

            {/* Modal */}
            {/* Modal Import */}
                <Modal show={showModalImport} onClose={() => setShowModalImport(false)}>
                    <form 
                        onSubmit={handleSubmitImport} 
                        className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Import Kabupaten / Kota
                        </h2>

                        <div className="mt-6 ">
                            <div className='flex flex-col sm:flex-row w-full gap-1'>
                                <div className='sm:w-1/4 w-full my-auto'>File Kabupaten / Kota</div>
                                <div className='sm:w-3/4 w-full'>
                                <input type="file" className="file-input file-input-bordered file-input-sm w-full" 
                                    value={undefined} 
                                    onChange={handleInputFile}
                                />
                                {progress && (
                                    <progress value={progress.percentage} max="100">
                                        {progress.percentage}%
                                    </progress>
                                )}
                                </div>
                            </div>
                            
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={() => setShowModalImport(false)}>Batal</SecondaryButton>

                            <PrimaryButton className="ms-3" 
                                disabled={processing}
                                >
                                Import
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            {/* Modal Import */}

            {/* Modal Filter */}
                <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
                    <form 
                        onSubmit={handleFilter} 
                        className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Filter Kabupaten / Kota
                        </h2>

                        <div className="mt-6 space-y-2">
                            <div className='flex w-full gap-1'>
                                <div className='w-3/12 my-auto'>Provinsi</div>
                                <div className='w-8/12'>
                                    <GeneralSelectInput 
                                        data={provinces}
                                        selected={selectedProvince}
                                        setSelected={setSelectedProvince}
                                        query={queryProvince}
                                        setQuery={setQueryProvince}
                                        maxHeight='max-h-40'
                                        placeholder='Cari Provinsi'
                                    />
                                </div>
                                <div className='w-1/12 my-auto'>
                                    {
                                        selectedProvince && <button className='p-2' onClick={handleDeleteProvinceFilter}><IoTrash /></button>
                                    }                                    
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
        </>
    )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data Kabupaten / Kota</Header>}
    breadcrumbs={<div className="text-sm breadcrumbs">
                    <ul>
                        <li className='font-bold'><Link href={route('admin.data-master')}>Data Master</Link></li> 
                        <li>Data Kabupaten / Kota</li>
                    </ul>
                </div>}
    children={page}
    user={page.props.auth.user}
    title="Data Kabupaten / Kota"
    backLink={<Link href={route('admin.data-master')}><IoArrowBackOutline/></Link>}
/>
