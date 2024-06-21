import {IoMdSettings} from 'react-icons/io'
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import "react-toastify/dist/ReactToastify.css";
import { createContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Datepicker from 'react-tailwindcss-datepicker';

export const AppContext = createContext();

export default function Authenticated({ user, header, children, organization = '', backLink, title='', breadcrumbs, role, showDateFilter = false, startDate, endDate}) {
    const [ date, setDate ] = useState({
        start: '',
        end: ''
    });

    const [dateValue, setDateValue] = useState({
        startDate: startDate || date, 
        endDate: endDate || date
    });

    const handleDateValueChange = (newValue) => {

        if (!newValue.startDate) {
            return
        }
        let startDate = `${dayjs(newValue.startDate).startOf('month').$y}-${dayjs(newValue.startDate).startOf('month').$M + 1}-${dayjs(newValue.startDate).startOf('month').$D}`;
        let endDate = `${dayjs(newValue.startDate).endOf('month').$y}-${dayjs(newValue.startDate).endOf('month').$M + 1}-${dayjs(newValue.startDate).endOf('month').$D}`;

        setDate({
            start: startDate,
            end: endDate,
        })
        setDateValue({
            startDate: startDate,
            endDate: endDate,
        });
    } 

    useEffect(() => {
        let now = dayjs();
        let startDate = `${now.startOf('month').$y}-${now.startOf('month').$M + 1}-${now.startOf('month').$D}`;
        let endDate = `${now.endOf('month').$y}-${now.endOf('month').$M + 1}-${now.endOf('month').$D}`;
        setDate({
            start: startDate,
            end: endDate,
        });
        setDateValue({
            startDate: startDate,
            endDate: endDate,
        });
    },[]);

    return (
        <AppContext.Provider value={{ date, setDate }}>
            <div className='min-h-screen bg-gray-100'>
                <div className="drawer">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <nav className='bg-white border-[#4f8315] border-b-2 w-full fixed z-10 print:hidden'>
                            <div className='mx-auto px-2 sm:px-6'>
                                <div className='flex justify-between sm:h-16 h-12'>
                                    <div className='sm:flex hidden'>
                                        <div className='shrink-0 flex items-center'>
                                            <Link href='/'>
                                                <ApplicationLogo className='block h-9 w-auto fill-current text-gray-800' />
                                            </Link>
                                        </div>

                                        {
                                            route().current('admin*') ? 
                                            <div className='hidden space-x-8 sm:-my-px sm:ms-10 sm:flex'>
                                                <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard*')}>
                                                    DASBOR
                                                </NavLink>
                                                <NavLink href={route('admin.data-master')} active={route().current('admin.data-master*')}>
                                                    DATA MASTER
                                                </NavLink>
                                                <NavLink href={route('admin.user-master')} active={route().current('admin.user-master*')}>
                                                    DATA PENGGUNA
                                                </NavLink>
                                                {/* <NavLink href={route('admin.users')} active={route().current('admin.users*')}>
                                                    DATA PENGGUNA
                                                </NavLink> */}
                                                <NavLink href={route('admin.organization.menu')} active={route().current('admin.organization*')}>
                                                    ORGANISASI
                                                </NavLink>
                                            </div> :
                                            <div className='hidden space-x-8 sm:-my-px sm:ms-10 sm:flex'>
                                                <NavLink href={route('dashboard', organization?.id)} active={route().current('dashboard*')}>
                                                    DASBOR
                                                </NavLink>
                                                <NavLink href={route('data-master', organization?.id)} active={route().current('data-master*')}>
                                                    DATA MASTER
                                                </NavLink>
                                                <NavLink href={route('data-ledger', organization?.id)} active={route().current('data-ledger*')}>
                                                    BUKU BESAR
                                                </NavLink>
                                                <NavLink href={route('cashflow', organization?.id)} active={route().current('cashflow*')}>
                                                    ARUS KAS
                                                </NavLink>
                                                <NavLink href={route('report', organization?.id)} active={route().current('report*')}>
                                                    LAPORAN
                                                </NavLink>
                                            </div>
                                        }
                                    </div>

                                    <div className='hidden sm:flex sm:items-center sm:ms-6'>
                                        <div className='ms-3 relative'>
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className='inline-flex rounded-md text-[#4f8315] text-lg'>
                                                        <button
                                                            type='button'
                                                            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#4f8315] hover:opacity-60 focus:outline-none transition ease-in-out duration-150'>
                                                            
                                                            <IoMdSettings size={"2em"} />
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    {
                                                        !route().current('admin*') && <>
                                                            <Dropdown.Link href={route('organization')}>Daftar Organisasi</Dropdown.Link>
                                                            <hr />
                                                        </> 
                                                    }

                                                    {
                                                        role === 'admin' && 
                                                        <Dropdown.Link className={route().current('logs*') && `border-l-2 border-[#4f8315]`} href={route('logs', organization?.id)}>Log Aktifitas</Dropdown.Link>
                                                    }
                                                    
                                                    <Dropdown.Link href={route('logout')} method='post' as='button'>
                                                        Keluar
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                            
                                        </div>
                                    </div>

                                    <div className='my-auto flex sm:hidden space-x-3 text-[#4f8315] px-2 print:hidden'> 
                                        <div className='my-auto'>
                                            {backLink}
                                        </div>                                    
                                        <div className='font-bold uppercase my-auto'>{title}</div>
                                        
                                    </div>
                                
                                    {/* Second Nav for Mobile */}
                                    <div className='-me-2 flex items-center sm:hidden'>
                                        <label htmlFor="my-drawer" className="btn bg-white border-none">
                                            <svg className='h-6 w-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                                                <path
                                                    className='inline-flex text-[#4f8315]'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M4 6h16M4 12h16M4 18h16'
                                                />
                                            </svg>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {header && (
                            <header className='bg-white shadow hidden sm:flex sm:justify-between pt-16 print:hidden'>
                                <div className='max-w-7xl py-3 px-4 sm:px-6 lg:px-8 my-auto'>{header}</div>
                                {
                                    breadcrumbs && 
                                    <div className='max-w-7xl py-3 px-4 sm:px-6 lg:px-8'>{breadcrumbs}</div>
                                }
                                {
                                    showDateFilter && 
                                    <div className='max-w-7xl py-3 px-4 sm:px-6 lg:px-8'>
                                        <Datepicker
                                            value={dateValue} 
                                            onChange={handleDateValueChange}  
                                            useRange={false} 
                                            asSingle={true} 
                                            placeholder='Filter Bulan'
                                            id="date"
                                            displayFormat='MMMM YYYY'
                                        />
                                    </div>

                                }

                            </header>
                        )}                   

                        <main>{children}</main>
                    </div>
                    <div className="drawer-side z-50">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        {
                            route().current('admin*') ?
                            // Admin Menu
                            <ul className="menu p-4 w-64 min-h-full text-[#4f8315] bg-white font-lg bg-opacity-95">
                            {/* Sidebar content here */}                            
                                <li className={`${route().current('admin.dashboard*') ? 'border-l-2 border-[#4f8315] font-bold' :''}`}><Link href={route('admin.dashboard')}>Dasbor</Link></li>
                                <li className={`${route().current('admin.data-master*') ? 'border-l-2 border-[#4f8315] font-bold' :''}`}><Link href={route('admin.data-master')}>Data Master</Link></li>
                                <li className={`${route().current('admin.user-master*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('admin.user-master')}>Data Pengguna</Link></li>     
                                <li className={`${route().current('admin.organization*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('admin.organization.menu')}>Organisasi</Link></li>     
                                <hr />
                                <li className={`${route().current('organizations*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('logout')} method='post' as='button'>Keluar</Link></li>
                            </ul> :
                            // User Menu
                            <ul className="menu p-4 w-64 min-h-full text-[#4f8315] bg-white font-lg bg-opacity-95">
                            {/* Sidebar content here */}                            
                                <li className={`${route().current('dashboard*') ? 'border-l-2 border-[#4f8315] font-bold' :''}`}><Link href={route('dashboard', organization.id)}>Dasbor</Link></li>
                                <li className={`${route().current('data-master*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('data-master', organization.id)}>Data Master</Link></li>     
                                <li className={`${route().current('data-ledger*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('data-ledger', organization.id)}>Buku Besar</Link></li>     
                                <li className={`${route().current('cashflow*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('cashflow', organization.id)}>Arus Kas</Link></li>     
                                <li className={`${route().current('report*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('report', organization.id)}>Laporan</Link></li>     
                                <hr className='border border-[#4f8315] my-3'/>
                                <li className={`${route().current('organizations*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('organization')}>Daftar Organisasi</Link></li>
                                {
                                    role === 'admin' && 
                                    <li className={`${route().current('logs*') ? 'border-l-2 border-[#4f8315] font-bold' : ''}`}><Link href={route('logs', organization?.id)}>Log Aktifitas</Link></li>
                                }
                                <li><Link href={route('logout')} method='post' as='button'>Keluar</Link></li>
                            </ul>                        
                        }                    
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
}
