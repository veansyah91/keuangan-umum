import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { IoArrowBackOutline, IoCalendarOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';    
import formatNumber from '@/Utils/formatNumber';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import { IoEllipsisVertical, IoTrash } from 'react-icons/io5/index.esm';
import { GiTakeMyMoney } from "react-icons/gi";
import TextInput from '@/Components/TextInput';

function Index({users, userCollections, searchFilter, affiliateCoderecommendation}) {
    const [showSearch, setShowSearch] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [search, setSearch] = useState(searchFilter || '');
    const [dateValue, setDateValue] = useState({
        startDate: '', 
        endDate: ''
    });
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [showAffilateModal, setShowAffiliateModal] = useState(false);

    const [debounceValue] = useDebounce(search, 500);
    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevSearch = usePrevious(search);

    const { data, setData, patch, errors, processing } = useForm({
        'id': null,
        'name' : '',
        'affiliatedCode' : '',
        'insentive' : 10
    })

    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPage();
        }
    }, [debounceValue, debounceDateValue]);
    

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    }

    const handleReloadPage = () => {
        router.reload({ 
            only: ['users','userCollections'],
            data: {
                search, 
                'start_date' : dateValue.startDate, 
                'end_date' : dateValue.endDate 
            }
         });
    }   ;

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue); 
    } 

    const handleSetAffiliation = (user) => {
        setShowAffiliateModal(true);
        let newCode = user.name.replace(/\s+/g, '');

        let tempData = data;
        tempData = {
            ...data,
            'id': user.id,
            'name': user.name,
            'affiliatedCode' : newCode.toUpperCase()
        }
        setData(tempData); 
        router.reload({
            only: ['affiliateCoderecommendation'],
            data: {
                'name' : newCode.toUpperCase()
            },
            onSuccess : () => {
                console.log(affiliateCoderecommendation);
            }
        });
    }

    const handleSubmitAffiliation = (e) => {
        e.preventDefault()

        patch(route('admin.user.store.affiliation', data.id), {
            onSuccess: () => {
                console.log('success');
            }
        })
    }

    return (
        <>
            <Head title='Pengguna' />

            {/* Mobile */}
                {/* Title */}
                <TitleMobile 
                    zIndex={'z-50'}
                    search={search}
                    setSearch= {e => setSearch(e.target.value)}
                    pageBefore={
                        users.links[0].url 
                        ? <Link href={`/admin/data-master/users?page=${users.current_page - 1}&search=${search}`}preserveState><IoPlayBack /></Link>
                        : <div className='text-gray-300'><IoPlayBack /></div>
                    }
                    pageAfter={
                        users.links[users.links.length-1].url 
                        ? <Link href={`/admin/data-master/users?page=${users.current_page + 1}&search=${search}`}
                            only={['users']} preserveState>
                            <IoPlayForward />
                        </Link>
                        : <div className='text-gray-300'><IoPlayForward /></div>
                    }
                    page={
                        <>
                            {users.current_page}/{users.last_page}
                        </>
                    }
                    data={users}
                    hasDate={true}
                    dateValue={dateValue}
                    onChangeDate={handleDateValueChange}
                />

                {/* Content */}
                <ContentMobile>
                    {
                        userCollections.map(user => 
                            <div key={user.id} className=' text-gray-900 py-2 px-1 border flex justify-between'>
                                <div className=''>
                                    <div>
                                        {user.email}
                                    </div>
                                    <div className='text-sm'>
                                        {user.name}
                                    </div>
                                    <div className='text-sm'>
                                        Dibuat Tanggal: {user.date}
                                    </div>
                                    <div className='text-sm'>
                                        {
                                            user.email_verified_at 
                                            ? <div className='italic text-green-600'>Telah Terverifikasi</div>
                                            : <div className='italic text-red-600'>Belum Terverifikasi</div>
                                        }
                                    </div>
                                </div>
                                <div>
                                    {user.role.toUpperCase()}
                                </div>                                   
                            </div>) 
                    }
                </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
                <ContainerDesktop>
                    {/* Title, Pagination, Search */}
                    <TitleDesktop>
                        <div className='w-1/4 my-auto '>
                            <Datepicker
                                value={dateValue} 
                                onChange={handleDateValueChange} 
                                showShortcuts={true} 
                                classNames={'border-2'}
                                separator={" sampai "} 
                            />
                        </div>
                        
                        <div className='w-1/4 border flex rounded-lg'>
                            <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                            <input id='search-input' name='search-input' type="search" placeholder='Cari Pengguna' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                            onChange={e => setSearch(e.target.value)}/>
                        </div>

                        <div className='italic text-xs my-auto w-1/12 text-center'>
                            {formatNumber(users.current_page*users.per_page-(users.per_page-1))}-{formatNumber(users.to)} dari {formatNumber(users.total)}
                        </div>

                        <div className='my-auto flex space-x-2 w-1/12'>
                            <div className='my-auto'>
                                {
                                    users.links[0].url 
                                    ? <Link href={`/admin/users?page=${users.current_page - 1}&search=${search}`}preserveState><IoPlayBack /></Link>
                                    : <div className='text-gray-300'><IoPlayBack /></div>
                                }                                
                            </div>
                            <div className='my-auto'>{users.current_page}/{users.last_page}</div>
                            <div className='my-auto'>
                                {
                                    users.links[users.links.length-1].url 
                                    ? <Link href={`/admin/users?page=${users.current_page + 1}&search=${search}`}
                                        only={['users','userCollections']} preserveState>
                                        <IoPlayForward />
                                    </Link>
                                    : <div className='text-gray-300'><IoPlayForward /></div>
                                }   
                            </div>
                        </div>
                    </TitleDesktop>

                    {/* Data */}
                    <ContentDesktop>
                        <table className='table table-pin-rows table-pin-cols text-base'>
                            <thead className='text-base text-gray-900'>
                                <tr className=''>
                                    <th className='bg-gray-200'>Nama</th>
                                    <th className='bg-gray-200'>Email</th>
                                    <th className='bg-gray-200'>Dibuat Tanggal</th>
                                    <th className='bg-gray-200'>Verifikasi</th>
                                    <th className='bg-gray-200'>Afiliasi</th>
                                    <th className='bg-gray-200'></th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    userCollections.map((user, index) =>
                                        <tr className={`${index % 2 == 0 && 'bg-gray-100'}`} key={index}>
                                            <td className=''>{user.name}</td>
                                            <td className=''>{user.email}</td>
                                            <td className=''>{user.date}</td>
                                            <td className=''>
                                            {
                                                user.email_verified_at 
                                                ? <div className='italic text-green-600'>Telah Terverifikasi</div>
                                                : <div className='italic text-red-600'>Belum Terverifikasi</div>
                                            }
                                            </td>
                                            <td className=''>

                                            </td>
                                            <td className='text-end'>
                                                <div className="dropdown dropdown-left">
                                                    <div                             
                                                        tabIndex={0} 
                                                        role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                                                        <IoEllipsisVertical />
                                                    </div>
                                                    <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                                                        <li>                                
                                                            <button 
                                                                onClick={() => handleSetAffiliation(user)}
                                                            ><GiTakeMyMoney />Afiliasi</button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>                                
                    </ContentDesktop>
                </ContainerDesktop>

                {/* Modal */}
                <Modal show={showFilter} onClose={() => setShowFilter(false)}>
                    <div className='p-5'>
                        <h2 className="text-lg font-medium text-gray-900">
                            Filter Data
                        </h2>
                        <div className="mt-6 flex justify-between space-x-5">
                            <InputLabel htmlFor="date-input" className='my-auto'>Tanggal</InputLabel>
                            <Datepicker
                                value={dateValue} 
                                onChange={handleDateValueChange} 
                                classNames={'z-100'}
                            />
                            {/* <input type="date" /> */}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={() => setShowFilter(false)}>Batal</SecondaryButton>

                            <PrimaryButton className="ms-3" 
                                // disabled={processing}
                            >
                                Filter
                            </PrimaryButton>
                        </div>
                    </div>
                </Modal>

                <Modal show={showAffilateModal} onClose={() => setShowAffiliateModal(false)}>
                    <form onSubmit={handleSubmitAffiliation}>
                        <div className='p-5'>
                            <h2 className="text-lg font-medium text-gray-900">
                                Buat Affiliasi
                            </h2>
                            <section className='mt-5 space-y-2'>
                                <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                    <div className='w-full sm:w-1/3 my-auto'>
                                        <InputLabel value={'Nama'} htmlFor='name' className=' mx-auto my-auto'/>
                                    </div>
                                    
                                    <div className='w-full sm:w-2/3'>
                                        <TextInput 
                                        id="name"
                                        name='name'
                                        className={`w-full ${errors?.name && 'border-red-500'}`}
                                        isFocused={true}
                                        placeholder='Nama'
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                        />
                                        {
                                        errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>
                                        }
                                        
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                    <div className='w-full sm:w-1/3 my-auto'>
                                        <InputLabel value={'Kode'} htmlFor='affiliatedCode' className=' mx-auto my-auto'/>
                                    </div>
                                    
                                    <div className='w-full sm:w-2/3'>
                                        <TextInput 
                                        id="name"
                                        name='affiliatedCode'
                                        className={`w-full ${errors?.affiliatedCode && 'border-red-500'}`}
                                        placeholder='Kode'
                                        value={data.affiliatedCode}
                                        onChange={(e) => setData('affiliatedCode', e.target.value.toUpperCase())}
                                        />
                                        {
                                        errors?.affiliatedCode && <span className='text-red-500 text-xs'>{errors.affiliatedCode}</span>
                                        }
                                        
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row justify-between gap-1'>
                                    <div className='w-full sm:w-1/3 my-auto'>
                                        <InputLabel value={'Insenstive (%)'} htmlFor='insentive' className=' mx-auto my-auto'/>
                                    </div>
                                    
                                    <div className='w-full sm:w-2/3'>
                                        <TextInput 
                                        id="name"
                                        name='insentive'
                                        className={`w-full ${errors?.insentive && 'border-red-500'}`}
                                        placeholder='Kode'
                                        value={data.insentive}
                                        onChange={(e) => setData('insentive', e.target.value.toUpperCase())}
                                        />
                                        {
                                        errors?.insentive && <span className='text-red-500 text-xs'>{errors.insentive}</span>
                                        }
                                        
                                    </div>
                                </div>
                            </section>

                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={() => setShowAffiliateModal(false)}>Batal</SecondaryButton>

                                <PrimaryButton className="ms-3" 
                                    disabled={processing}
                                >
                                    Buat Afiliasi
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </Modal>
            {/* Desktop */}

        </>
    );
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data User</Header>}
    children={page}
    user={page.props.auth.user}
    title="Data User"
/>

export default Index;
