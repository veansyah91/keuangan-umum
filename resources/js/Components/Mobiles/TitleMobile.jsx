import React from 'react'

export default function TitleMobile({children, className}) {
  return (
    <div className={`sm:hidden fixed mt-12 w-full bg-white border px-3 py-1 flex justify-between shadow-lg ${className}`}>{children}</div>
  )
}
