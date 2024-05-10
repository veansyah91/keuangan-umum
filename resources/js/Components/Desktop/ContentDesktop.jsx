import React, { useEffect, useState } from 'react'

function maxHeight() {
  const screenHeight = window.screen.height;
  const classHeight = `h-[${screenHeight-384}px]`;

  return classHeight;
}

export default function ContentDesktop({children}) {  
  return (
    <div className='mt-5 pb-8'>
        <div className={`overflow-x-auto ${maxHeight()}`}>
            {children}
        </div>
    </div>
  )
}
