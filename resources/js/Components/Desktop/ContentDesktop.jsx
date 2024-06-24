import React, { useLayoutEffect, useState } from 'react';

export default function ContentDesktop({ children }) {
    useLayoutEffect(() => {
        const screenHeight = window.screen.height;
        document.getElementById('content').style.height = `${screenHeight - 374}px`;
    }, []);

    return (
        <div className='mt-5 pb-8'>
            <div className={`overflow-x-auto`} id='content'>
                {children}
            </div>
        </div>
    );
}
