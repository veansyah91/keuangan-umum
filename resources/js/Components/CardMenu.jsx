import React from 'react'

export default function CardMenu({title, icon, bgColor}) {
  return (
    <div className={`text-center w-52 h-40 flex flex-col space-y-2 rounded-lg text-white hover:cursor-pointer hover:opacity-95 ${bgColor}`}>
        <div className='h-2/3'>
            <div className='p-2 text-[5rem] h-full w-full flex justify-center'>
                {icon}
            </div>
        </div>
        <div className='h-1/3 font-bold'>
          <div className='px-2'>
            {title}
          </div>
        </div>
    </div>
  )
}
