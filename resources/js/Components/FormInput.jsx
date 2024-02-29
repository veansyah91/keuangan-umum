import React from 'react'

export default function FormInput({onSubmit, children, id = 'form-input', ...props}) {
    return (
        <form onSubmit={onSubmit} {...props} id={id}>
            <div className='sm:pt-0 pb-16 pt-12'>
                <div className='bg-white py-2 px-2 sm:pt-0'>
                    {children}
                </div>        
            </div>
        </form>
      )
}
