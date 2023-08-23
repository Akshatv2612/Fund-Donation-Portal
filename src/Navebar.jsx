// import logo from '../../images/logo2.png';
import React from 'react';

const Navbar = () => {

    const NavbarItem = ({title}) => {
        return (
            <a href={`#${title}`}>
            <li className="mx-4 nav-element py-2 px-7 mx-2  cursor-pointer font-semibold text-xl hover:bg-blue-400 rounded-md" >
                {title}
            </li>
            </a>
        );
    }

    return (
        
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="head mx-10 text-3xl font-bold text-blue-400">IIT GUWAHATI</div>
            <div>
            <ul className="text-white md:flex hidden list-noneflex-row justify-between items-center flex-initial">
                {["About Us", "Donate","Transactions", "Contact Us"].map((item) => (
                    <NavbarItem title={item}/>
                ))}
            </ul>
            </div>
        </nav>
    );
}

export default Navbar;