import React from 'react';

const Card = ({ children, className, bgColor = 'bg-white' }) => (
    <div className={`w-full border p-3 rounded-lg ${className} ${bgColor}`}>{children}</div>
);

const Header = ({ children, className }) => <div className={`w-full text-lg font-bold ${className}`}>{children}</div>;

const Content = ({ children, className }) => <div className={`w-full my-3 ${className}`}>{children}</div>;

const Footer = ({ children, className }) => <div className={`w-full text-lg font-bold ${className}`}>{children}</div>;

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;

export default Card;
