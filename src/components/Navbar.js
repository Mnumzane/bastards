import React from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import logo from "../logo.svg";

const Navbar = ({ onTitleChange }) => {
    const navigate = useNavigate();
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Rules", path: "/rules" },
    ];

    return (
        <div className="hover-parent group pointer-events-none w-1/2 flex flex-col items-center ml-0 mt-0 h-full fixed z-20 top-0 left-0 bg-primary transition-all overflow-x-hidden pt-5 sm:w-1/4 ">
            {/* {TODO: deal with hover transforms} */}
            {navItems.map((item) => (
                <div
                    className="group-hover:opacity-40 flex flex-row flex-wrap justify-between items-center"
                    key={item.name}
                >
                    <div>
                        <img className="w-7 h-7" src={logo} alt="nav" />
                    </div>
                    <div className="block sm:hidden md:block">
                        <button
                            className="text-white bg-primary border-none text-lg"
                            key={item.path}
                            onClick={() => {
                                onTitleChange(item.name);
                                navigate(item.path);
                            }}
                        >
                            {item.name}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
Navbar.propTypes = {
    onTitleChange: PropTypes.func,
};

export default Navbar;
