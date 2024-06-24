import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IoCheckmarkCircleOutline, IoChevronDownOutline } from 'react-icons/io5';

export default function GeneralMultipleSelectInput({ data, selected, setSelected, maxHeight = 'max-h-60' }) {
    return (
        <Listbox value={selected} onChange={setSelected} multiple>
            <div className='relative mt-1'>
                <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm border-gray-300 border'>
                    <span className={`block truncate ${selected.length < 1 && 'text-slate-500'} `}>
                        {selected.length > 0 ? selected.map((s) => s.name).join(', ') : 'Pilih Kategori'}
                    </span>
                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                        <IoChevronDownOutline className='h-5 w-5 text-gray-400' aria-hidden='true' />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave='transition ease-in duration-100'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <Listbox.Options
                        className={`absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${maxHeight}`}>
                        {data.map((d, index) => (
                            <>
                                <Listbox.Option
                                    key={index}
                                    selected={selected.some((s) => s.id === d.id)}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                    value={d}>
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected ? 'font-medium' : 'font-normal'
                                                }`}>
                                                {d.name}
                                            </span>

                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 text-white`}>
                                                    <IoCheckmarkCircleOutline className='h-5 w-5' aria-hidden='true' />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            </>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
