import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp, IoTrash } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import NavgroupRegionalMobile from '@/Components/NavgroupRegionalMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import PageNumber from '@/Components/PageNumber';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import DistrictMobile from './Components/DistrictMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DistrictDesktop from './Components/DistrictDesktop';
import NavgroupRegional from '@/Components/NavgroupRegional';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';

export default function Index({districts, provinces, regencies, searchFilter, provinceFilter, regencyFilter}) {

    // state
    const [showSearch, setShowSearch] = useState(false);
    const [showModalImport, setShowModalImport] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);

    const prevSearch = usePrevious(search);

    // Province Select
    const [selectedProvince, setSelectedProvince] = useState('');
    const [queryProvince, setQueryProvince] = useState(provinceFilter || '');
    const [debounceQueryProvince] = useDebounce(queryProvince, 500);

    // Regency Select
    const [selectedRegency, setSelectedRegency] = useState('');
    const [queryRegency, setQueryRegency] = useState(regencyFilter || '');
    const [debounceQueryRegency] = useDebounce(queryRegency, 500);

    const { data, setData, post, progress, reset, processing } = useForm({
        district: ''
    });

    // Useeffect
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

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPageOnlyRegency();            
        }
    }, [debounceQueryRegency, selectedRegency, selectedProvince]);

    // Function
    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    }

    const handleInputFile = (e) => {
        if (e.currentTarget.files) {
            setData("district", e.currentTarget.files[0]);
        }
    }

    const handleSubmitImport = (e) => {
        e.preventDefault();
        post(route('admin.data-master.district.post'),{
            onSuccess: () => {
                reset();
                setShowModalImport(false);
                toast.success(`Kecamatan Berhasil Diimport`, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        });
    }

    const handleFilter = (e) => {
        e.preventDefault();
        setShowModalFilter(false);
        handleReloadPage();        
    }

    const handleReloadPage = () => {
        router.reload({ 
            only: ['districts'],
            data: {
                search,
                'province' : selectedProvince.id,
                'regency' : selectedRegency.id,
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

    const handleReloadPageOnlyRegency = () => {
        router.reload({ 
            only: ['regencies'],
            data: {
                'searchRegency' : queryRegency,
                'province' : selectedProvince.id
            },
            preserveState: true
         });
    }   

    const handleDeleteProvinceFilter = () => {
        setSelectedProvince('');
        setQueryProvince('');
    }

    const handleDeleteRegencyFilter = () => {
        setSelectedRegency('');
        setQueryRegency('');
    }

    return (
        <>
            <Head title='Data Kecamatan' />
            <ToastContainer />

            {/* Mobile */}
                {/* Sub Nav Mobile */}
                <div className="btm-nav sm:hidden">
                    <NavgroupRegionalMobile onClick={() => setShowModalImport(true)}/>
                </div> 

                <TitleMobile className={'z-50'}>
                    {/* search */}                        
                    <div className={`flex p-1 space-x-1 ${showSearch && 'w-full border-2'}`}>
                        <button className={`p-2 rounded-md border-2 ${showSearch ? 'border-none' : 'border-gray'}`} onClick={handleShowSearch}>
                            {
                                showSearch ? <IoArrowBackOutline /> : <IoSearchSharp />
                            }                                
                        </button>

                        {/* Search Input */}
                        {
                            showSearch && <input type="search" className='border-none max-h-full h-full my-auto focus:border-none w-full focus:ring-0' placeholder='Masukkan Pencarian' value={search || ''}
                            onChange={e => setSearch(e.target.value)}
                            />
                        }  

                        {/* Filter */}
                        {
                            !showSearch && 
                            <button onClick={() => setShowModalFilter(true)} className='my-auto border-2 p-2 rounded-md'><IoFilter /></button> 
                        } 
                    </div>    

                    {
                        !showSearch && <div className='my-auto flex space-x-2'>                            
                            <div className='my-auto'>
                                {
                                    districts.links[0].url 
                                    ? <Link href={`/admin/data-master/districts?page=${districts.current_page - 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}`} preserveState only={['districts']}><IoPlayBack /></Link>
                                    : <div className='text-gray-300'><IoPlayBack /></div>
                                }                                
                            </div>
                            <div className='my-auto'>{districts.current_page}/{districts.last_page}</div>
                            <div className='my-auto'>
                                {
                                    districts.links[districts.links.length-1].url 
                                    ? <Link href={`/admin/data-master/districts?page=${districts.current_page + 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}`}
                                        only={['districts']} preserveState>
                                        <IoPlayForward />
                                    </Link>
                                    : <div className='text-gray-300'><IoPlayForward /></div>
                                }   
                            </div>
                        </div>
                    }

                    {
                        !showSearch && <PageNumber data={districts} />
                    }
                </TitleMobile>
                <ContentMobile>
                    {
                        districts.data.map(district => 
                            <DistrictMobile
                                district={district}
                                key={district.id}
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
                                Import Kecamatan
                            </PrimaryButton>
                        </div>           
                        <div className='w-1/12 text-end'>
                            <button className='p-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button> 
                        </div>
                                  
                        <div className='w-3/12 border flex rounded-lg'>
                            <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                            <input id='search-input' name='search-input' type="search" placeholder='Cari Kecamatan' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                            onChange={e => setSearch(e.target.value)}/>
                        </div>

                        <div className='italic text-xs my-auto w-1/12 text-center'>
                            <PageNumber data={districts} />

                        </div>

                        <div className='my-auto flex space-x-2 w-1/12'>
                            <div className='my-auto'>
                                {
                                    districts.links[0].url 
                                    ? <Link 
                                            href={`/admin/data-master/districts?page=${districts.current_page - 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}`} 
                                            only={['districts']} preserveState
                                      >
                                        <IoPlayBack/>
                                      </Link>
                                    : <div className='text-gray-300'><IoPlayBack /></div>
                                }                                
                            </div>
                            <div className='my-auto'>{districts.current_page}/{districts.last_page}</div>
                            <div className='my-auto'>
                                {
                                    districts.links[districts.links.length-1].url 
                                    ? <Link 
                                            href={`/admin/data-master/districts?page=${districts.current_page + 1}&search=${search}${selectedProvince && `&province=${selectedProvince.id}`}
                                                            `}
                                        only={['districts']} preserveState
                                        >
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
                                            <th className='bg-gray-200'>Nama Kecamatan</th>
                                            <th className='bg-gray-200'>Nama Kabupaten</th>
                                            <th className='bg-gray-200'>Nama Provinsi</th>
                                            <th className='bg-gray-200'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            districts.data.map((district, index) =>
                                                <DistrictDesktop 
                                                    key={index} 
                                                    district={district} 
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
                                Import Kecamatan
                            </h2>

                            <div className="mt-6 ">
                                <div className='flex flex-col sm:flex-row w-full gap-1'>
                                    <div className='sm:w-1/4 w-full my-auto'>File Kecamatan</div>
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
                                Filter Kecamatan
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

                                <div className='flex w-full gap-1'>
                                    <div className='w-3/12 my-auto'>Kabupaten / Kota</div>
                                    <div className='w-8/12'>
                                        <GeneralSelectInput 
                                            data={regencies}
                                            selected={selectedRegency}
                                            setSelected={setSelectedRegency}
                                            query={queryRegency}
                                            setQuery={setQueryRegency}
                                            maxHeight='max-h-40'
                                            placeholder='Cari Kabupaten / Kota'
                                        />
                                    </div>
                                    <div className='w-1/12 my-auto'>
                                        {
                                            selectedRegency && <button className='p-2' onClick={handleDeleteRegencyFilter}><IoTrash /></button>
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
            {/* Modal */}
        </>
    )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data Kecamatan</Header>}
    breadcrumbs={<div className="text-sm breadcrumbs">
                    <ul>
                        <li className='font-bold'><Link href={route('admin.data-master')}>Data Master</Link></li> 
                        <li>Data Kecamatan</li>
                    </ul>
                </div>}
    children={page}
    user={page.props.auth.user}
    title="Data Kecamatan"
    backLink={<Link href={route('admin.data-master')}><IoArrowBackOutline/></Link>}
/>
