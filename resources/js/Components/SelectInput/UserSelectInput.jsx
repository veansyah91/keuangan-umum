import { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { IoCheckmarkCircleOutline, IoChevronDownOutline } from 'react-icons/io5';
import { router } from '@inertiajs/react';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';

export default function UserSelectInput({
  resources,
  selected,
  setSelected,
  maxHeight = 'max-h-60',
  placeholder,
  className = 'border-gray-300 border',
}) {    
    const [query, setQuery] = useState('');
    const [data, setData] = useState(resources);

		const prevQuery = usePrevious(query);
    const [debounceValue] = useDebounce(query, 500);

    useEffect(() => {
			if (prevQuery !== undefined) {
				handleReloadUser();
			}
	}, [debounceValue]);

    useEffect(() => {
			setQuery(selected?.name);
    }, [selected]);

		const handleReloadUser = () => {
			router.reload({
				only: ['users'],
				data: {
					user: query,
				},
				onSuccess: ({ props }) => {
					const { users } = props;

					setData(users);
					
				}
			});
		};
    return (
        <Combobox value={selected} onChange={setSelected}>
            <div className='relative mt-1'>
                <div
                    className={`relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border-gray-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ${className}`}>
                    <Combobox.Input
                        className='w-full py-3 pl-3 pr-10 leading-5 text-gray-800 focus:ring-0 border-none'
                        displayValue={(selected) => selected.email}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        type='search'
                    />
                    <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 text-lg'>
                        <IoChevronDownOutline />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave='transition ease-in duration-100'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <Combobox.Options
                        className={`absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${maxHeight} z-10`}>
                        {data.length === 0 && query !== '' ? (
                            <div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
                                Nothing found.
                            </div>
                        ) : (
                            data.map((d) => (
                                <Combobox.Option
                                    key={d.id}
                                    className={({ active }) =>
                                        `relative flex cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                    value={d}>
                                    {({ selected, active }) => (
                                        <>
                                            <div
                                                className={`block truncate ${
                                                    selected ? 'font-medium' : 'font-normal'
                                                }`}>
                                                <div>{d.email}</div>
                                                <div className='text-xs'>{d.name}</div>
                                            </div>
                                            {selected ? (
                                                <div
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active ? 'text-white' : 'text-teal-600'
                                                    }`}>
                                                    <IoCheckmarkCircleOutline className='h-5 w-5' aria-hidden='true' />
                                                </div>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}
