import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import {
    IoArrowBackOutline,
    IoFilter,
    IoPlayBack,
    IoPlayForward,
    IoSearchSharp,
    IoTrashOutline,
} from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import CashMutationMobile from './Components/CashMutationMobile';
import CashMutationDesktop from './Components/CashMutationDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';

export default function Index({
    cashMutations,
    startDate,
    endDate,
    role,
    organization,
    searchFilter,
    isApproved,
    projects,
    programs,
    departments,
}) {
    // state
    const { flash } = usePage().props;

    const [showModalFilter, setShowModalFilter] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [search, setSearch] = useState(searchFilter || '');
    const [debounceValue] = useDebounce(search, 500);
    const [dataFilter, setDataFilter] = useState({
        is_approved: isApproved || undefined,
        project: null,
        program: null,
        department: null,
    });

    const [selectedProgram, setSelectedProgram] = useState({
        id: null,
        name: '',
        code: '',
    });

    const [selectedProject, setSelectedProject] = useState({
        id: null,
        name: '',
        code: '',
    });

    const [selectedDepartment, setSelectedDepartment] = useState({
        id: null,
        name: '',
        code: '',
    });

    const [modalDelete, setModalDelete] = useState({
        title: '',
    });

    const {
        data,
        setData,
        delete: destroy,
        errors,
        setError,
        processing,
        reset,
    } = useForm({
        id: null,
        no_ref: '',
    });

    const [dateValue, setDateValue] = useState({
        startDate: startDate || '',
        endDate: endDate || '',
    });
    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevSearch = usePrevious(search);

    // useEffect
    useEffect(() => {
        if (prevSearch !== undefined) {
            handleReloadPage();
        }
    }, [debounceValue, debounceDateValue]);

    // function
    const handleReloadPage = () => {
        router.reload({
            only: ['cashMutations'],
            data: {
                search,
                start_date: dateValue.startDate,
                end_date: dateValue.endDate,
                is_approved: dataFilter.is_approved,
                program: dataFilter.program,
                project: dataFilter.project,
                department: dataFilter.department,
            },
            preserveState: true,
        });
    };

    const handleSelectedProgram = (selected) => {
        setSelectedProgram(selected);
        setDataFilter({ ...dataFilter, program: selected.id });
    };

    const handleDeleteSelectedProgram = () => {
        setSelectedProgram({ id: null, name: '', code: '' });
        setDataFilter({ ...dataFilter, program: null });
    };

    const handleSelectedProject = (selected) => {
        setSelectedProject(selected);
        setDataFilter({ ...dataFilter, project: selected.id });
    };

    const handleDeleteSelectedProject = () => {
        setSelectedProject({ id: null, name: '', code: '' });
        setDataFilter({ ...dataFilter, project: null });
    };

    const handleSelectedDepartment = (selected) => {
        setSelectedDepartment(selected);
        setDataFilter({ ...dataFilter, department: selected.id });
    };

    const handleDeleteSelectedDepartment = () => {
        setSelectedDepartment({ id: null, name: '', code: '' });
        setDataFilter({ ...dataFilter, department: null });
    };

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue);
    };

    const handleDelete = (cashMutation) => {
        setModalDelete({
            title: `Hapus Data Mutasi Kas No Ref ${cashMutation.no_ref}`,
        });
        setData({
            id: cashMutation.id,
            no_ref: cashMutation.no_ref,
        });
        setShowDeleteConfirmation(true);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        handleReloadPage();
        setShowModalFilter(false);
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();

        destroy(route('cashflow.cash-mutation.delete', { organization: organization.id, cashMutation: data.id }), {
            onSuccess: () => {
                reset();
                toast.success(`Mutasi Kas Berhasil Dihapus`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                setShowDeleteConfirmation(false);
            },
        });
    };

    return (
        <>
            {/* Mobile */}
            <Head title='Mutasi Kas' />
            <ToastContainer />

            {role !== 'viewer' && (
                <Link href={route('cashflow.cash-mutation.create', organization.id)}>
                    <AddButtonMobile label={'Tambah'} />
                </Link>
            )}
            <TitleMobile
                zIndex={'z-50'}
                search={search}
                setSearch={(e) => setSearch(e.target.value)}
                pageBefore={
                    cashMutations.links[0].url ? (
                        <Link
                            href={route('cashflow.cash-mutation', {
                                organization: organization.id,
                                start_date: dateValue.startDate,
                                end_date: dateValue.endDate,
                                page: cashMutations.current_page - 1,
                                search: search,
                            })}
                            preserveState
                            only={['cashMutations']}>
                            <IoPlayBack />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayBack />
                        </div>
                    )
                }
                pageAfter={
                    cashMutations.links[cashMutations.links.length - 1].url ? (
                        <Link
                            href={route('cashflow.cash-mutation', {
                                organization: organization.id,
                                start_date: dateValue.startDate,
                                end_date: dateValue.endDate,
                                page: cashMutations.current_page + 1,
                                search: search,
                            })}
                            only={['cashMutations']}
                            preserveState>
                            <IoPlayForward />
                        </Link>
                    ) : (
                        <div className='text-gray-300'>
                            <IoPlayForward />
                        </div>
                    )
                }
                page={
                    <>
                        {cashMutations.current_page}/{cashMutations.last_page}
                    </>
                }
                data={cashMutations}
                hasFilter={true}
                showFilter={() => setShowModalFilter(true)}
                hasDate={true}
                dateValue={dateValue}
                onChangeDate={handleDateValueChange}
            />
            <ContentMobile>
                {cashMutations.data.map((cashMutation) => (
                    <CashMutationMobile
                        cashMutation={cashMutation}
                        key={cashMutation.id}
                        handleDelete={() => handleDelete(cashMutation)}
                        role={role}
                    />
                ))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
                <TitleDesktop>
                    <div className='my-auto w-5/12'>
                        {role !== 'viewer' && (
                            <Link href={route('cashflow.cash-mutation.create', organization.id)}>
                                <PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
                            </Link>
                        )}
                    </div>

                    <div className='my-auto w-4/12 flex gap-5'>
                        <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
                            <IoFilter />
                        </button>
                        <Datepicker
                            value={dateValue}
                            onChange={handleDateValueChange}
                            showShortcuts={true}
                            configs={{
                                shortcuts: {
                                    today: 'Hari Ini',
                                    yesterday: 'Kemarin',
                                    past: (period) => `${period} Hari Terakhir`,
                                    currentMonth: 'Bulan Ini',
                                    pastMonth: 'Bulan Lalu',
                                    currentYear: 'Tahun Ini',
                                },
                            }}
                            separator={'s.d'}
                        />
                    </div>

                    <div className='w-3/12 border flex rounded-lg'>
                        <label htmlFor='search-input' className='my-auto ml-2'>
                            <IoSearchSharp />
                        </label>
                        <input
                            id='search-input'
                            name='search-input'
                            type='search'
                            placeholder='Cari Mutasi Kas'
                            className='w-full border-none focus:outline-none focus:ring-0'
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='italic text-xs my-auto w-1/12 text-center'>
                        <PageNumber data={cashMutations} />
                    </div>

                    <div className='my-auto flex space-x-2 w-1/12'>
                        <div className='my-auto'>
                            {cashMutations.links[0].url ? (
                                <Link
                                    href={route('cashflow.cash-mutation', {
                                        organization: organization.id,
                                        start_date: dateValue.startDate,
                                        end_date: dateValue.endDate,
                                        page: cashMutations.current_page - 1,
                                        search: search,
                                    })}
                                    preserveState
                                    only={['cashMutations']}>
                                    <IoPlayBack />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayBack />
                                </div>
                            )}
                        </div>
                        <div className='my-auto'>
                            {cashMutations.current_page}/{cashMutations.last_page}
                        </div>
                        <div className='my-auto'>
                            {cashMutations.links[cashMutations.links.length - 1].url ? (
                                <Link
                                    href={route('cashflow.cash-mutation', {
                                        organization: organization.id,
                                        start_date: dateValue.startDate,
                                        end_date: dateValue.endDate,
                                        page: cashMutations.current_page + 1,
                                        search: search,
                                    })}
                                    only={['cashMutations']}
                                    preserveState>
                                    <IoPlayForward />
                                </Link>
                            ) : (
                                <div className='text-gray-300'>
                                    <IoPlayForward />
                                </div>
                            )}
                        </div>
                    </div>
                </TitleDesktop>

                <div className='sm:flex hidden gap-5'>
                    <div className='w-full'>
                        <ContentDesktop>
                            <table className='table table-pin-rows table-pin-cols text-base'>
                                <thead className='text-base text-gray-900'>
                                    <tr className=''>
                                        <th className='bg-gray-200'>Tanggal</th>
                                        <th className='bg-gray-200'>No. Ref</th>
                                        <th className='bg-gray-200'>Deskripsi</th>
                                        <th className='bg-gray-200 text-end'>Nilai</th>
                                        <th className='bg-gray-200 text-center'>Status</th>
                                        <th className='bg-gray-200'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashMutations.data.map((cashMutation, index) => (
                                        <CashMutationDesktop
                                            key={index}
                                            cashMutation={cashMutation}
                                            className={`${index % 2 == 0 && 'bg-gray-100'}`}
                                            handleDelete={() => handleDelete(cashMutation)}
                                            role={role}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </ContentDesktop>
                    </div>
                </div>
            </ContainerDesktop>

            {/* Modal */}
            {/* Filter  */}
            <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
                <form onSubmit={handleFilter} className='p-6' id='filter' name='filter'>
                    <h2 className='text-lg font-medium text-gray-900'>Filter Mutasi Kas</h2>

                    <div className='mt-6 '>
                        <div className='flex w-full gap-1'>
                            <div className='w-1/4 my-auto font-bold'>Status</div>
                            <div className='w-3/4 flex'>
                                <div className='form-control'>
                                    <label className='label cursor-pointer space-x-2' htmlFor='all'>
                                        <input
                                            type='radio'
                                            name='all'
                                            className='radio radio-rimary'
                                            onChange={() => setDataFilter({ ...dataFilter, is_approved: undefined })}
                                            id='all'
                                            checked={dataFilter.is_approved == undefined}
                                        />
                                        <span className='label-text'>Semua</span>
                                    </label>
                                </div>
                                <div className='form-control'>
                                    <label className='label cursor-pointer space-x-2' htmlFor='approved'>
                                        <input
                                            type='radio'
                                            name='approved'
                                            className='radio radio-rimary'
                                            onChange={() => setDataFilter({ ...dataFilter, is_approved: true })}
                                            id='approved'
                                            checked={dataFilter.is_approved === true}
                                        />
                                        <span className='label-text'>Diterima</span>
                                    </label>
                                </div>
                                <div className='form-control'>
                                    <label className='label cursor-pointer space-x-2' htmlFor='draft'>
                                        <input
                                            type='radio'
                                            name='draft'
                                            className='radio radio-rimary'
                                            onChange={() => setDataFilter({ ...dataFilter, is_approved: false })}
                                            id='draft'
                                            checked={dataFilter.is_approved === false}
                                        />
                                        <span className='label-text'>Draft</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {programs.length > 0 && (
                            <div className='flex flex-col sm:flex-row w-full gap-1'>
                                <div className='w-full sm:w-3/12 my-auto font-bold'>Program</div>
                                <div className='w-full sm:w-9/12 flex'>
                                    <div className='w-10/12'>
                                        <ClientSelectInput
                                            resources={programs}
                                            selected={selectedProgram}
                                            setSelected={(selected) => handleSelectedProgram(selected)}
                                            maxHeight='max-h-40'
                                            placeholder='Cari Program'
                                            isError={false}
                                            id='program'
                                        />
                                    </div>
                                    <div className='w-2/12 my-auto'>
                                        {selectedProgram.id && (
                                            <button
                                                type='button'
                                                className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                onClick={handleDeleteSelectedProgram}>
                                                <IoTrashOutline />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {projects.length > 0 && (
                            <div className='flex flex-col sm:flex-row w-full gap-1'>
                                <div className='w-full sm:w-3/12 my-auto font-bold'>Proyek</div>
                                <div className='w-full sm:w-9/12 flex'>
                                    <div className='w-10/12'>
                                        <ClientSelectInput
                                            resources={projects}
                                            selected={selectedProject}
                                            setSelected={(selected) => handleSelectedProject(selected)}
                                            maxHeight='max-h-40'
                                            placeholder='Cari Project'
                                            isError={false}
                                            id='project'
                                        />
                                    </div>
                                    <div className='w-2/12 my-auto'>
                                        {selectedProject.id && (
                                            <button
                                                type='button'
                                                className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                onClick={handleDeleteSelectedProject}>
                                                <IoTrashOutline />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {departments.length > 0 && (
                            <div className='flex flex-col sm:flex-row w-full gap-1'>
                                <div className='w-full sm:w-3/12 my-auto font-bold'>Departemen</div>
                                <div className='w-full sm:w-9/12 flex'>
                                    <div className='w-10/12'>
                                        <ClientSelectInput
                                            resources={departments}
                                            selected={selectedDepartment}
                                            setSelected={(selected) => handleSelectedDepartment(selected)}
                                            maxHeight='max-h-40'
                                            placeholder='Cari Departemen'
                                            isError={false}
                                            id='department'
                                        />
                                    </div>
                                    <div className='w-2/12 my-auto'>
                                        {selectedDepartment.id && (
                                            <button
                                                type='button'
                                                className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                onClick={handleDeleteSelectedDepartment}>
                                                <IoTrashOutline />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

                        <PrimaryButton className='ms-3'>Filter</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <form onSubmit={handleSubmitDelete} className='p-6' id='deleteForm' name='deleteForm'>
                    <h2 className='text-lg font-medium text-gray-900 text-center'>{modalDelete.title}</h2>

                    <div className='mt-6 flex justify-end'>
                        <SecondaryButton onClick={() => setShowDeleteConfirmation(false)}>Batal</SecondaryButton>

                        <DangerButton className='ms-3' disabled={processing}>
                            Hapus
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Mutasi Kas</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Mutasi Kas'
        backLink={
            <Link href={route('cashflow', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('cashflow', page.props.organization.id)}>Arus Kas</Link>
                    </li>
                    <li>Mutasi Kas</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
