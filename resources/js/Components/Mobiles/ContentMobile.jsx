import React from 'react'

export default function ContentMobile({children}) {
  return (
    <div className='sm:hidden pb-16 pt-16'>
        <div className='bg-white pt-10 sm:pt-0'>
            {children}
        </div>        
    </div>
  )
}
