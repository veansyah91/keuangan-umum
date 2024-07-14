import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import { FaHandHoldingUsd } from 'react-icons/fa';
import CardMenu from '@/Components/CardMenu';
import { BsCashCoin } from 'react-icons/bs';
import { FaMoneyBillTransfer } from 'react-icons/fa6';

export default function Index({ organization }) {
    return (
        <>
            <Head title='Arus Kas' />

            {/* Desktop */}
            <ContainerDesktop>
                <section className='pt-5 pb-10'>
                    <div className='flex justify-center gap-6'>
                        <Link href={route('cashflow.cash-in', organization.id)}>
                            <CardMenu bgColor={'bg-cyan-500'} icon={<FaHandHoldingUsd />} title={'Penerimaan'} />
                        </Link>
                        <Link href={route('cashflow.cash-out', organization.id)}>
                            <CardMenu
                                bgColor={'bg-rose-500'}
                                icon={
                                    <div className='rotate-180'>
                                        <FaHandHoldingUsd />
                                    </div>
                                }
                                title={'Pengeluaran'}
                            />
                        </Link>
                        <Link href={route('cashflow.cash-mutation', organization.id)}>
                            <CardMenu bgColor={'bg-orange-500'} icon={<FaMoneyBillTransfer />} title={'Mutasi Kas'} />
                        </Link>
                    </div>
                </section>
                <section className='pt-5 pb-10'>
                    <div className='text-center font-bold'>
                        Tabungan
                    </div>
                    <div className='flex justify-center gap-6'>
                        <Link href={route('cashflow.cash-in', organization.id)}>
                            <CardMenu bgColor={'bg-cyan-500'} icon={<FaHandHoldingUsd />} title={'Penerimaan'} />
                        </Link>
                        <Link href={route('cashflow.cash-out', organization.id)}>
                            <CardMenu
                                bgColor={'bg-rose-500'}
                                icon={
                                    <div className='rotate-180'>
                                        <FaHandHoldingUsd />
                                    </div>
                                }
                                title={'Pengeluaran'}
                            />
                        </Link>
                        <Link href={route('cashflow.cash-mutation', organization.id)}>
                            <CardMenu bgColor={'bg-orange-500'} icon={<FaMoneyBillTransfer />} title={'Mutasi Kas'} />
                        </Link>
                    </div>
                </section>  
            </ContainerDesktop>
            {/* Desktop */}

            {/* Mobile */}
            <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
                <Link href={route('cashflow.cash-in', organization.id)}>
                    <CardMenu bgColor={'bg-cyan-500'} icon={<FaHandHoldingUsd />} title={'Penerimaan'} />
                </Link>
                <Link href={route('cashflow.cash-out', organization.id)}>
                    <CardMenu
                        bgColor={'bg-rose-500'}
                        icon={
                            <div className='rotate-180'>
                                <FaHandHoldingUsd />
                            </div>
                        }
                        title={'Pengeluaran'}
                    />
                </Link>
                <Link href={route('cashflow.cash-mutation', organization.id)}>
                    <CardMenu bgColor={'bg-orange-500'} icon={<FaMoneyBillTransfer />} title={'Mutasi Kas'} />
                </Link>
            </div>
            {/* Mobile */}
        </>
    );
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header></Header>}
        children={page}
        user={page.props.auth.user}
        role={page.props.role}
        organization={page.props.organization}
        title='Arus Kas'
    />
);
