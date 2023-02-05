import React from "react";
import { PropTypes } from "prop-types";

const TitleBar = ({ title, onToggleNavbar }) => {
    return (
        <>
            <div className="flex items-center top-0 left-0 fixed z-10 text-2xl text-white w-full h-10 bg-secondary text-center m-0 p-0 justify-center shadow sm:left-1/4 sm:w-3/4">
                {" "}
                {title}{" "}
            </div>
            <div
                className="absolute z-30 h-12 flex left-0 top-0 mt-0 items-center sm:hidden"
                onClick={() => onToggleNavbar()}
            >
                <img src="" alt="hmb" />
            </div>
        </>
    );
};
TitleBar.propTypes = {
    title: PropTypes.string,
    onToggleNavbar: PropTypes.func,
};

export default TitleBar;
