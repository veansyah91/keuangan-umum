import React from 'react';
import { IoAddOutline } from 'react-icons/io5';

export default function AddButtonMobile({ handleShowInputModal, label = < IoAddOutline height={20} width={20} /> }) {
    return (
        <div className='md:hidden fixed bottom-2 w-full z-40'>
            <div className='px-5'>
                <button type='button' className={'btn bg-gray-800 text-white w-full'} onClick={handleShowInputModal}>
                    <div className='text-xl font-bold'>{label}</div>
                </button>
            </div>
        </div>
    );
}
