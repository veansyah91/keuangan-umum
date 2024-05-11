import React, { useLayoutEffect, useState } from 'react'

function maxHeight() {
  const screenHeight = window.screen.height;
<<<<<<< Updated upstream
  const classHeight = `h-[${(screenHeight-384).toString()}px]`;
=======
  const classHeight = `max-h-[${screenHeight-384}px]`;
>>>>>>> Stashed changes

  return classHeight;
}

export default function ContentDesktop({children}) {  
  const [heightScreen, setHeightScreen] = useState('')

  useLayoutEffect(() => {
    const screenHeight = window.screen.height;
    setHeightScreen(`h-[${(screenHeight-384).toString()}px]`)
  }, [])

  return (
    <div className='mt-5 pb-8'>
        <div className={`overflow-x-auto ${heightScreen}`}>
            {children}
        </div>
    </div>
  )
}
