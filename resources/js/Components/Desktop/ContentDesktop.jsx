import React, { useLayoutEffect, useState } from 'react';

export default function ContentDesktop({children}) {  
  const [heightScreen, setHeightScreen] = useState('')

  useLayoutEffect(() => {
    const screenHeight = window.screen.height;
    setHeightScreen(`h-[${(screenHeight-384).toString()}px]`)
  }, []);
  
  return (
    <div className='mt-5 pb-8'>
        <div className={`overflow-x-auto ${heightScreen}`}>
            {children}
        </div>
    </div>
  )
}
