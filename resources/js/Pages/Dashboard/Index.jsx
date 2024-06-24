import Card from '@/Components/Card';
import Container from '@/Components/Container';
import Header from '@/Components/Header';
import AuthenticatedLayout, { AppContext } from '@/Layouts/AuthenticatedLayout';
import formatNumber from '@/Utils/formatNumber';
import { Head, router } from '@inertiajs/react';
import { useContext, useEffect, useState } from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import { LuLineChart } from 'react-icons/lu';
import { BsGraphDownArrow, BsGraphUpArrow } from 'react-icons/bs';
import { FaRupiahSign } from 'react-icons/fa6';
import dayjs from 'dayjs';
import Datepicker from 'react-tailwindcss-datepicker';
import { FaHandHoldingUsd } from 'react-icons/fa';
import CostRevenueChart from './Components/CostRevenueChart';
import CashflowChart from './Components/CashflowChart';

const Index = ({ balance, startDate, endDate }) => {
    const { date, setDate } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            reloadBasedOnMonthly();
        }, 0);
    }, [date]);

    // function
    const [dateValue, setDateValue] = useState({
        startDate: startDate || date,
        endDate: endDate || date,
    });

    const handleDateValueChange = (newValue) => {
        let startDate = `${dayjs(newValue.startDate).startOf('month').$y}-${dayjs(newValue.startDate).startOf('month').$M + 1}-${dayjs(newValue.startDate).startOf('month').$D}`;
        let endDate = `${dayjs(newValue.startDate).endOf('month').$y}-${dayjs(newValue.startDate).endOf('month').$M + 1}-${dayjs(newValue.startDate).endOf('month').$D}`;

        setDate({
            start: startDate,
            end: endDate,
        });
        setDateValue({
            startDate: startDate,
            endDate: endDate,
        });
    };

    const reloadBasedOnMonthly = () => {
        router.reload({
            only: ['balance', 'startDate', 'endDate'],
            data: {
                startDate: date.start,
                endDate: date.end,
            },
            onSuccess: ({ props }) => {
                setIsLoading(false);
                setDateValue({
                    startDate: props.startDate,
                    endDate: props.endDate,
                });
            },
            preserveState: true,
        });
    };
    return (
        <>
            <Head title='Dasbor' />

            <Container>
                <div className='sm:hidden p-2 mx-2 bg-white flex justify-between gap-2'>
                    <div className='font-bold my-auto'>Periode</div>
                    <div>
                        <Datepicker
                            value={dateValue}
                            onChange={handleDateValueChange}
                            useRange={false}
                            asSingle={true}
                            placeholder='Filter Bulan'
                            id='date'
                            displayFormat='MMMM YYYY'
                        />
                    </div>
                </div>
                <div className='flex gap-3 mt-2 mx-2'>
                    <Card>
                        <Card.Header className={'flex gap-3 justify-between'}>
                            <div className='flex gap-3'>
                                <div className='my-auto'>
                                    <FaBalanceScale />
                                </div>
                                <div>Neraca</div>
                            </div>
                            <div className='text-slate-400'>{dayjs(date.start).format('MMMM YYYY')}</div>
                        </Card.Header>
                        <Card.Content className={'flex gap-5 flex-col sm:flex-row px-2'}>
                            <Card className={'bg-lime-300 bg-opacity-20 shadow-md'}>
                                <Card.Header className={'flex gap-3 justify-between'}>
                                    <div>Aktiva</div>
                                    <div className='text-blue-600'>
                                        IDR {isLoading ? 0 : formatNumber(balance?.currentAsset + balance?.fixedAsset)}
                                    </div>
                                </Card.Header>
                                <Card.Content className={'sm:flex sm:space-y-0 space-y-2 sm:gap-3'}>
                                    <Card className={'shadow'}>
                                        <Card.Header>Harta Lancar</Card.Header>
                                        <Card.Content className={'text-end text-lg sm:text-2xl text-rose-700'}>
                                            IDR {isLoading ? 0 : formatNumber(balance?.currentAsset)}
                                        </Card.Content>
                                    </Card>
                                    <Card className={'shadow'}>
                                        <Card.Header>Harta Tetap</Card.Header>
                                        <Card.Content className={'text-end text-lg sm:text-2xl text-sky-500'}>
                                            IDR {isLoading ? 0 : formatNumber(balance?.fixedAsset)}
                                        </Card.Content>
                                    </Card>
                                </Card.Content>
                            </Card>
                            <Card className={'bg-blue-300 bg-opacity-20 shadow-md'}>
                                <Card.Header className={'flex gap-3 justify-between'}>
                                    <div>Pasiva</div>
                                    <div className='text-blue-600'>
                                        IDR {isLoading ? 0 : formatNumber(balance?.currentAsset + balance?.fixedAsset)}
                                    </div>
                                </Card.Header>
                                <Card.Content className={'sm:flex sm:space-y-0 space-y-2 sm:gap-3'}>
                                    <Card className={'shadow'}>
                                        <Card.Header>Kewajiban</Card.Header>
                                        <Card.Content className={'text-end text-lg sm:text-2xl text-orange-500'}>
                                            IDR {isLoading ? 0 : formatNumber(Math.abs(balance?.liability))}
                                        </Card.Content>
                                    </Card>
                                    <Card className={'shadow'}>
                                        <Card.Header>Modal</Card.Header>
                                        <Card.Content className={'text-green-500 text-end text-lg sm:text-2xl'}>
                                            IDR {isLoading ? 0 : formatNumber(Math.abs(balance?.equity))}
                                        </Card.Content>
                                    </Card>
                                </Card.Content>
                            </Card>
                        </Card.Content>
                    </Card>
                </div>
                <div className='flex gap-3 mt-2 mx-2'>
                    <Card>
                        <Card.Header className={'flex gap-3 justify-between'}>
                            <div className='flex gap-3'>
                                <div className='my-auto'>
                                    <LuLineChart />
                                </div>
                                <div>Laba Rugi</div>
                            </div>
                            <div className='text-slate-400'>{dayjs(date.start).format('MMMM YYYY')}</div>
                        </Card.Header>
                        <Card.Content className={'flex gap-5 flex-col sm:flex-row px-2'}>
                            <Card className={'bg-blue-300 bg-opacity-20 max-h-28 flex gap-2 shadow-md'}>
                                <Card.Content className={'w-full flex gap-2'}>
                                    <div className='w-1/4 text-4xl my-auto mx-auto'>
                                        <div className='w-full p-2 h-full'>
                                            <BsGraphUpArrow className='mx-auto text-blue-600' />
                                        </div>
                                    </div>
                                    <div className='space-y-2 w-3/4'>
                                        <div className='text-xl font-bold'>Pendapatan</div>
                                        <div className='text-blue-600 text-2xl sm:text-left text-end'>
                                            IDR {isLoading ? 0 : formatNumber(Math.abs(balance?.revenue))}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Card className={'bg-blue-300 bg-opacity-20 max-h-28 flex gap-2 shadow-md'}>
                                <Card.Content className={'w-full flex gap-2'}>
                                    <div className='w-1/4 text-4xl my-auto mx-auto'>
                                        <div className='w-full p-2 h-full'>
                                            <BsGraphDownArrow className='mx-auto text-red-600' />
                                        </div>
                                    </div>
                                    <div className='space-y-2 w-3/4'>
                                        <div className='text-xl font-bold'>Pengeluaran</div>
                                        <div className='text-red-600 text-2xl sm:text-left text-end'>
                                            IDR {isLoading ? 0 : formatNumber(Math.abs(balance?.cost))}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Card className={'bg-blue-300 bg-opacity-20 max-h-28 flex gap-2 shadow-md'}>
                                <Card.Content className={'w-full flex gap-2'}>
                                    <div className='w-1/4 text-4xl my-auto mx-auto'>
                                        <div className='w-full p-2 h-full'>
                                            <FaRupiahSign className='mx-auto text-green-600' />
                                        </div>
                                    </div>
                                    <div className='space-y-2 w-3/4'>
                                        <div className='text-xl font-bold'>Laba Rugi</div>
                                        <div className='text-green-600 text-2xl sm:text-left text-end'>
                                            IDR{' '}
                                            {Math.abs(balance?.revenue + balance?.cost) > 0
                                                ? formatNumber((balance?.revenue + balance?.cost) * -1)
                                                : 0}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Card.Content>
                    </Card>
                </div>

                {/* Pendapatan */}

                <CostRevenueChart
                    logo={<FaHandHoldingUsd />}
                    dataChart={balance?.revenueDay}
                    title={'Pendapatan'}
                    type={'revenue'}
                    data={balance?.revenues}
                />

                <CostRevenueChart
                    logo={<FaHandHoldingUsd />}
                    dataChart={balance?.costDay}
                    title={'Pengeluaran'}
                    type={'cost'}
                    data={balance?.costs}
                />

                {/* Arus Kas */}
                <CashflowChart data={balance?.cashflowDay} />
            </Container>
        </>
    );
};

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>{page.props.organization.name}</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        role={page.props.role}
        title={page.props.organization.name}
        showDateFilter={true}
        startDate={page.props.startDate}
        endDate={page.props.endDate}
    />
);

export default Index;
