import React from 'react'

export default function Container({children}) {
  return (
    <div className='min-h-screen bg-gray-100'>
        <div className='max-w-4xl mx-auto sm:px-6 lg:px-8 bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
            {children}
        </div>
    </div>
  )
}
