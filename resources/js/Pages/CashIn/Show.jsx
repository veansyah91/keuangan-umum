import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FaPrint } from 'react-icons/fa';
import SecondaryButton from '@/Components/SecondaryButton';
import dayjs from 'dayjs';
import formatNumber from '@/Utils/formatNumber';

export default function Show({ cashIn, organization, program, department, project, journal, ledgers, journalUser }) {
    const handlePrint = () => {
        window.print();
    };
    return (
        <>
            <Head title='Detail Kas Masuk Umum' />
            {/* Desktop */}
            <div className='sm:pt-0 pb-16 pt-12 print:font-["Open_Sans"]'>
                <div className='bg-white py-2 sm:pt-0 px-5'>
                    {/* Nav Title */}
                    <div className='text-end px-3 print:hidden'>
                        <SecondaryButton onClick={handlePrint}>
                            <div className='flex gap-2'>
                                <div className='my-auto'>
                                    <FaPrint />
                                </div>
                                <div className='my-auto'>Print</div>
                            </div>
                        </SecondaryButton>
                    </div>

                    {/* Title */}
                    <div className='uppercase pt-10 pb-5 border-b hidden print:flex print:justify-between'>
                        <div className='w-1/2 text-2xl my-auto'>voucher Kas Masuk</div>
                        <div className='w-1/2 text-end mt-auto'>
                            <div>{organization.name}</div>
                            <div className='text-xs'>{organization.address}</div>
                            <div className='text-xs'>
                                {organization.village}, {organization.district}, {organization.regency},{' '}
                                {organization.province}
                            </div>
                        </div>
                    </div>

                    {/* Sub Title */}
                    <div className='w-full flex print:pt-5 gap-2'>
                        <div className='w-5/12 space-y-3'>
                            <div className='flex gap-2'>
                                <div className='w-4/12'>No. Ref</div>
                                <div className='w-1/12 text-end'>:</div>
                                <div className='w-7/12'>{journal.no_ref}</div>
                            </div>
                            <div className='flex gap-2'>
                                <div className='w-4/12'>Tanggal</div>
                                <div className='w-1/12 text-end'>:</div>
                                <div className='w-7/12'>{dayjs(journal.date).format('MMM DD, YYYY')}</div>
                            </div>
                            <div className='flex gap-2'>
                                <div className='w-4/12'>Deskripsi</div>
                                <div className='w-1/12 text-end'>:</div>
                                <div className='w-7/12'>{journal.description}</div>
                            </div>
                        </div>
                        <div className='w-7/12 space-y-3'>
                            {program && (
                                <div className='flex gap-2'>
                                    <div className='w-4/12'>Program Kegiatan</div>
                                    <div className='w-1/12 text-end'>:</div>
                                    <div className='w-7/12'>{program.name}</div>
                                </div>
                            )}
                            {project && (
                                <div className='flex gap-2'>
                                    <div className='w-4/12'>Proyek</div>
                                    <div className='w-1/12 text-end'>:</div>
                                    <div className='w-7/12'>{project.name}</div>
                                </div>
                            )}
                            {department && (
                                <div className='flex gap-2'>
                                    <div className='w-4/12'>Departemen</div>
                                    <div className='w-1/12 text-end'>:</div>
                                    <div className='w-7/12'>{department.name}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ledgers */}
                    <div className='w-full flex pt-5'>
                        <table className='w-full border border-slate-800 text-sm'>
                            <thead className='border border-slate-800 bg-slate-800 text-white print:text-slate-800 '>
                                <tr>
                                    <th className='text-start px-3 py-2 border border-slate-800'>Kode Akun</th>
                                    <th className='text-start px-3 py-2 border border-slate-800'>Nama Akun</th>
                                    <th className='text-end px-3 py-2 border border-slate-800'>Debit</th>
                                    <th className='text-end px-3 py-2 border border-slate-800'>Kredit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgers.map((ledger) => (
                                    <tr key={ledger.id} className='border border-slate-800'>
                                        <td className='px-3 py-2 border border-slate-800'>{ledger.account.code}</td>
                                        <td className='px-3 py-2 border border-slate-800'>{ledger.account.name}</td>
                                        <td className='text-end px-3 py-2 border border-slate-800'>
                                            IDR {formatNumber(ledger.debit)}
                                        </td>
                                        <td className='text-end px-3 py-2 border border-slate-800'>
                                            IDR {formatNumber(ledger.credit)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className='border border-slate-800 bg-slate-800 text-white print:text-slate-800'>
                                <tr>
                                    <th colSpan={2} className='text-start px-3 py-2'>
                                        Total
                                    </th>
                                    <th className='text-end px-3 py-2 border border-slate-800'>
                                        IDR {formatNumber(journal.value)}
                                    </th>
                                    <th className='text-end px-3 py-2 border border-slate-800'>
                                        IDR {formatNumber(journal.value)}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* sign */}
                    <div className='w-full py-5 flex print:flex-row-reverse'>
                        <div></div>
                        <div className='w-1/3 flex flex-col gap-28 mx-12'>
                            <div className='w-full text-center'>Dibuat Oleh</div>
                            <div className='w-full text-center border-t border-slate-900'>{journalUser[0].name}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile */}
        </>
    );
}

Show.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Detail Kas Masuk</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Detail Kas Masuk'
        backLink={
            <Link href={route('cashflow.cash-in', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('cashflow', page.props.organization.id)}>Buku Besar</Link>
                    </li>
                    <li className='font-bold'>
                        <Link href={route('cashflow.cash-in', page.props.organization.id)}>Kas Masuk Umum</Link>
                    </li>
                    <li>Detail Kas Masuk</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
