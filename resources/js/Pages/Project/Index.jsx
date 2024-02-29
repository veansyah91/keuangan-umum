import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import ProjectDesktop from './Components/ProjectDesktop';
import ProjectMobile from './Components/ProjectMobile';
import Datepicker from 'react-tailwindcss-datepicker';

export default function Index({role, organization, projects, searchFilter}) {
    // state
    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);
    const [dataFilter, setDataFilter] = useState({
        'status' :''
    });

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);

    const {data, setData, processing, delete: destroy} = useForm({
        'id' : null,
        'code' : '',
        'name' : ''
    });

	const prevSearch = usePrevious(search);

    // useEffect
    useEffect(() => {
        if(prevSearch!==undefined) {
            handleReloadPage();
        }
    },[debounceValue])

    // function
    const handleReloadPage = () => {
        router.reload({
			only: ['projects'],
			data: {
                search, 
                'status' : dataFilter.status
            },
			preserveState: true
		})
    }

    const handleDelete = (project) => {
        setShowDeleteConfirmation(true);
        setData({
            'id' : project.id,
            'code' : project.code,
            'name' : project.name,
        });
    }

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        destroy(route('data-master.project.destroy', {organization: organization.id, project: data.id}),{
            onSuccess: () => {
                toast.success(`Proyek Berhasil Dihapus`, {
					position: toast.POSITION.TOP_CENTER
				});
                setShowDeleteConfirmation(false);
            },
            onError: error => {
                toast.error(error.delete, {
					position: toast.POSITION.TOP_CENTER
				});
                setShowDeleteConfirmation(false);
            }
        })
    }

    const handleFilter = (e) => {
        e.preventDefault();
        handleReloadPage();
        setShowModalFilter(false);
    }

    return (
        <>
            <Head title='Data Proyek' />
            <ToastContainer />

            {/* Mobile */}
            {
            (role !== 'viewer') && <Link href={route('data-master.project.create', organization.id)}><AddButtonMobile label={"Tambah"}/></Link> 
            }
            <TitleMobile 
                zIndex={'z-50'}
                search={search}
                setSearch= {e => setSearch(e.target.value)}
                pageBefore={
                            projects.links[0].url 
                ? <Link href={`/data-master/projects?page=${projects.current_page - 1}&search=${search}`} preserveState only={['projects']}><IoPlayBack /></Link>
                : <div className='text-gray-300'><IoPlayBack /></div>
                }
                pageAfter={
                            projects.links[projects.links.length-1].url 
                            ? <Link href={`/data-master/projects?page=${projects.current_page + 1}&search=${search}`}
                                only={['projects']} preserveState>
                                <IoPlayForward />
                            </Link>
                            : <div className='text-gray-300'><IoPlayForward /></div>
                }
                page={
                    <>
                        {projects.current_page}/{projects.last_page}
                    </>
                }
                data={projects}
                hasFilter={true}
                showFilter={() => setShowModalFilter(true)}
            />
            <ContentMobile>
            {
                projects.data.map(project => 
                <ProjectMobile
                    project={project}
                    key={project.id}
                    handleDelete={() => handleDelete(project)}
                    role={role}
                />
                )
            }
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                <TitleDesktop>
                    <div className='my-auto w-5/12'>
                        {
                            (role !== 'viewer') &&
                            <Link href={route('data-master.project.create', organization.id)}>
                                <PrimaryButton className='py-3'>
                                        Tambah Data
                                </PrimaryButton>         
                            </Link>                   
                        }
                    </div>

                    <div className='my-auto w-4/12 gap-5 justify-end'>
                        <div className='text-end'>
                            <button className='py-3 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button>
                        </div>
                        
                    </div>
                    
                    <div className='w-3/12 border flex rounded-lg'>					
                        <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                        <input id='search-input' name='search-input' type="search" placeholder='Cari Proyek' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                        onChange={e => setSearch(e.target.value)}/>
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={projects} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {
                                projects.links[0].url 
                                ? <Link 
                                        href={`/data-master/${organization.id}/projects?page=${projects.current_page - 1}&search=${search}`}
                                        preserveState only={['projects']}
                                    >
                                        <IoPlayBack />
                                    </Link>
                                : <div className='text-gray-300'><IoPlayBack /></div>
                            }                                
                        </div>
                        <div className='my-auto'>{projects.current_page}/{projects.last_page}</div>
                        <div className='my-auto'>
                            {
                                projects.links[projects.links.length-1].url 
                                ? <Link 
                                        href={`/data-master/${organization.id}/projects?page=${projects.current_page + 1}&search=${search}`}
                                        only={['projects']} preserveState
                                    >
                                    <IoPlayForward />
                                </Link>
                                : <div className='text-gray-300'><IoPlayForward /></div>
                            }   
                        </div>
                    </div>
                </TitleDesktop>

                
                <div className='sm:flex hidden gap-5'>
                    <div className='w-full'>
                        <ContentDesktop>
                            <table className='table table-pin-rows table-pin-cols text-base'>
                                <thead className='text-base text-gray-900'>
                                    <tr className=''>
                                        <th className='bg-gray-200'>Kode</th>
                                        <th className='bg-gray-200'>Nama Proyek</th>
                                        <th className='bg-gray-200'>Deksripsi</th>
                                        <th className='bg-gray-200 text-end'>Estimasi Nilai</th>
                                        <th className='bg-gray-200 text-center'>Status</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    projects.data.map((project, index) =>
                                    <ProjectDesktop 
                                        key={index} 
                                        project={project} 
                                        className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                                        handleDelete={() => handleDelete(project)}
                                        role={role}
                                    />
                                    )
                                }
                                </tbody>
                            </table>
                        </ContentDesktop>
                    </div>
                </div>
            </ContainerDesktop>
            {/* Desktop */}

            {/* Modal */}
            {/* Filter  */}
            <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
                <form 
                    onSubmit={handleFilter} 
                    className="p-6"
                    id='filter'
                    name='filter'
                >
                    <h2 className="text-lg font-medium text-gray-900">
                        Filter Proyek
                    </h2>

                    
                    <div className="mt-6 ">
                        <div className='flex w-full gap-1'>
                            <div className='w-1/4 my-auto'>
                                Status
                            </div>
                            <div className='w-3/4 flex'>
                                <select className="select select-bordered w-full" id='status' value={dataFilter.status} onChange={(e) => setDataFilter({...dataFilter, status: e.target.value})}>
                                    <option disabled value=''>--Pilih Status--</option>
                                    <option value='not started'>Belum Dimulai</option>
                                    <option value='pending'>Menunggu</option>
                                    <option value='in progress'>Dalam Pengerjaan</option>
                                    <option value='finished'>Selesai</option>
                                </select>
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

            {/* Delete Modal */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form 
                    onSubmit={handleSubmitDelete} 
                    className="p-6"
                    id='deleteForm'
                    name='deleteForm'
                >
                    <h2 className="text-lg font-medium text-gray-900 text-center">
                        Hapus Proyek {data.name}
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowDeleteConfirmation(false)}>Batal</SecondaryButton>

                        <DangerButton className="ms-3" 
                            disabled={processing}
                            >
                            Hapus
                        </DangerButton>
                    </div>
                </form>
            </Modal>
            {/* Modal */}
        </>
    )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data Proyek</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title="Data Proyek"
    backLink={<Link href={route('data-master',page.props.organization.id)}><IoArrowBackOutline/></Link>}
    breadcrumbs={<div className="text-sm breadcrumbs">
        <ul>
            <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Data Master</Link></li> 
            <li>Data Proyek</li>
        </ul>
    </div>}
    role={page.props.role}
/>
