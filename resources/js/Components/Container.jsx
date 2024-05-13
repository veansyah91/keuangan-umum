import React, { useLayoutEffect } from 'react'

export default function Container({maxHeight="max-h-[27rem]",className = '', children}) {

  useLayoutEffect(() => {
    const screenHeight = window.screen.height;
    document.getElementById("content").style.height = `${screenHeight-304}px`;
  }, []);

  return (
    <div className={`sm:pt-0 pb-6 pt-14 sm:overflow-auto ${className}`} id='content'>
        {children}
    </div>
  )
}
