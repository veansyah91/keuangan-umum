import React from 'react'

export default function Container({maxHeight="max-h-[27rem]",className = '', children}) {
  return (
    <div className={`sm:pt-0 pb-6 pt-14 sm:overflow-auto ${maxHeight} ${className}`}>
        {children}
    </div>
  )
}
