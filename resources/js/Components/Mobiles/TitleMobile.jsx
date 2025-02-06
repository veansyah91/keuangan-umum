import React, { useState } from 'react';
import { IoArrowBackOutline, IoCalendarOutline, IoFilter, IoSearchSharp } from 'react-icons/io5';
import PageNumber from '../PageNumber';
import Datepicker from 'react-tailwindcss-datepicker';

function SearchInput() {}

export default function TitleMobile({
    zIndex,
    search,
    setSearch,
    pageBefore,
    pageAfter,
    page,
    data,
    hasFilter = false,
    showFilter,
    hasDate = false,
    dateValue,
    onChangeDate,
}) {
    const [showSearch, setShowSearch] = useState(false);
    const [showDate, setShowDate] = useState(false);

    return (
        <>
            {!showSearch && !showDate && (
                <div
                    className={`sm:hidden fixed mt-12 w-full bg-white border px-3 py-1 flex justify-between shadow-lg ${zIndex}`}>
                    {/* search */}
                    <div className={`flex p-1 space-x-1 ${showSearch && 'w-full border-2'}`}>
                        <button className={`p-2 rounded-md border-2 border-gray`} onClick={() => setShowSearch(true)}>
                            <IoSearchSharp />
                        </button>
                        {hasDate && (
                            <button className={`p-2 rounded-md border-2 border-gray`} onClick={() => setShowDate(true)}>
                                <IoCalendarOutline />
                            </button>
                        )}
                        {hasFilter && (
                            <button className={`p-2 rounded-md border-2 border-gray`} onClick={showFilter}>
                                <IoFilter />
                            </button>
                        )}
                    </div>

                    <div className='my-auto flex space-x-2'>
                        <div className='my-auto'>{pageBefore}</div>
                        <div className='my-auto'>{page}</div>
                        <div className='my-auto'>{pageAfter}</div>
                    </div>
                    <PageNumber data={data} />
                </div>
            )}

            {showDate && (
                <div
                    className={`sm:hidden fixed mt-12 w-full bg-white border px-3 py-1 justify-between shadow-lg ${zIndex} p-1`}>
                    <div className='flex p-1'>
                        <div className='w-1/12 mx-auto my-auto'>
                            <button onClick={() => setShowDate(false)} className='my-auto p-2'>
                                <IoArrowBackOutline />
                            </button>
                        </div>
                        <div className='w-11/12'>
                            <Datepicker
                                value={dateValue}
                                onChange={onChangeDate}
                                classNames={'border-2'}
                                separator={'s.d'}
                                useRange={false}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showSearch && (
                <div
                    className={`sm:hidden fixed mt-12 w-full bg-white border px-1 py-1 justify-between shadow-lg ${zIndex} p-1`}>
                    <div className='flex p-1'>
                        <div className='w-2/12 mx-auto my-auto'>
                            <button onClick={() => setShowSearch(false)} className='my-auto p-2'>
                                <IoArrowBackOutline />
                            </button>
                        </div>
                        <div className='w-10/12 border-2 rounded-lg'>
                            <input
                                type='search'
                                className='border-none max-h-full h-full my-auto focus:border-none w-full focus:ring-0'
                                placeholder='Masukkan Pencarian'
                                value={search || ''}
                                onChange={setSearch}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
