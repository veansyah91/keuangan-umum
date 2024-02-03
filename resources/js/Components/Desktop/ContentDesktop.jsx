import React from 'react'

export default function ContentDesktop({children}) {
  return (
    <div className='mt-5 pb-8'>
        <div className='overflow-x-auto h-96'>
            {children}
        </div>
    </div>
  )
}
