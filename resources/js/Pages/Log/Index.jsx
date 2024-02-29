import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router } from '@inertiajs/react';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { IoArrowBackOutline, IoCalendarOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { useDebounce } from 'use-debounce';
import PageNumber from '@/Components/PageNumber';
import Datepicker from 'react-tailwindcss-datepicker';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import LogMobile from './Components/LogMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import LogDesktop from './Components/LogDesktop';
import { usePrevious } from 'react-use';

export default function Index({logs, organization, searchFilter, startDate, endDate}) {
    
    // state
    const [showSearch, setShowSearch] = useState(false);
    const [showDateFilter, setShowDateFilter] = useState(false);

    // filter 
    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);
    const [dateValue, setDateValue] = useState({
        startDate: '', 
        endDate: ''
    });
    const [debounceDateValue] = useDebounce(dateValue, 500);
    const prevSearch = usePrevious(search);

    //useState
    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPage();
        }
    }, [debounceValue, debounceDateValue]);

    // function
    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    }

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue); 
    } 

    const handleReloadPage = () => {
        router.reload({ 
            only: ['logs'],
            data: {
                search, 
                'start_date' : dateValue.startDate, 
                'end_date' : dateValue.endDate,
            }
        })
    }

    return <>
        <Head title='Data Log Aktifitas' />

        {/* Mobile */}
            <TitleMobile 
                zIndex={'z-50'}
                search={search}
                setSearch= {e => setSearch(e.target.value)}
                pageBefore={
                            logs.links[0].url 
                ? <Link href={`/logs/${organization.id}?page=${logs.current_page - 1}&search=${search}`} preserveState only={['logs']}><IoPlayBack /></Link>
                : <div className='text-gray-300'><IoPlayBack /></div>
                }
                pageAfter={
                            logs.links[logs.links.length-1].url 
                            ? <Link href={`/logs/${organization.id}?page=${logs.current_page + 1}&search=${search}`}
                                only={['logs']} preserveState>
                                <IoPlayForward />
                            </Link>
                            : <div className='text-gray-300'><IoPlayForward /></div>
                }
                page={
                    <>
                        {logs.current_page}/{logs.last_page}
                    </>
                }
                data={logs}
            />

            <ContentMobile>
                {
                    logs.data.map(log => 
                        <LogMobile 
                            logItem={log} 
                            key={log.id}
                        />
                    )
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
                        id='date-picker-desktop'
                    />
                </div>
                
                <div className='w-1/4 border flex rounded-lg'>
                    <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                    <input id='search-input' name='search-input' type="search" placeholder='Cari Log Aktifitas' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                    onChange={e => setSearch(e.target.value)}/>
                </div>

                <div className='italic text-xs my-auto w-1/12 text-center'>
                    <PageNumber data={logs} />
                </div>

                <div className='my-auto flex space-x-2 w-1/12'>
                    <div className='my-auto'>
                        {
                            logs.links[0].url 
                            ? <Link href={`/logs/${organization.id}?page=${logs.current_page - 1}&search=${search}&start_date=${dateValue.startDate}&end_date=${dateValue.endDate}`} preserveState><IoPlayBack /></Link>
                            : <div className='text-gray-300'><IoPlayBack /></div>
                        }                                
                    </div>
                    <div className='my-auto'>{logs.current_page}/{logs.last_page}</div>
                    <div className='my-auto'>
                        {
                            logs.links[logs.links.length-1].url 
                            ? <Link href={`/logs/${organization.id}?page=${logs.current_page + 1}&search=${search}&start_date=${dateValue.startDate}&end_date=${dateValue.endDate}`}
                            only={['logs']} preserveState>
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
                            <th className='bg-gray-200'>Deskripsi</th>
                            <th className='bg-gray-200'>Dibuat Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            logs.data.map((logItem, index) =>
                                <LogDesktop 
                                    key={index} 
                                    logItem={logItem} 
                                    className={`${index % 2 == 0 && 'bg-gray-100'}`}/>
                            )
                        }
                    </tbody>
                </table>                                
            </ContentDesktop>
        </ContainerDesktop>
        {/* Desktop */}

    </>
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Log Aktifitas</Header>}
    children={page}
    user={page.props.auth.user}
    role={page.props.role}
    organization={page.props.organization}
    title="Log Aktifitas"
/>
