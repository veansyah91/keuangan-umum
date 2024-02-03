import React from 'react'

const CardHeader = ({children, className}) => {
    return (
        <div className={`text-2xl font-semibold border-b-2 pb-2 border-gray-500 ${className}`}>
            <h3>{children}</h3>
        </div>
    )
}

const CardContent = ({children}) => {
    return (
        <div className='mt-10'>
            {children}
        </div>
    )
}

const Card = ({children, className}) => {
    return (
        <div className={`sm:p-6 px-6 py-6 text-gray-800 border sm:w-1/2 sm:mx-2 rounded-lg ${className}`}>
            {children}
        </div>
    )
}

Card.CardHeader = CardHeader;
Card.CardContent = CardContent;

export default Card;
