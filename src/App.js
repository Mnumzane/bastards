import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Rules from "./pages/Rules";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import TitleBar from "./components/TitleBar";
import GamePlay from "./pages/GamePlay";
import Winner from "./pages/Winner";
import PlayAgain from "./pages/PlayAgain";
import "./css/styles.css";

const App = () => {
    const [isNavbarOpen, setNavbarOpen] = useState(false);
    const [title, setTitle] = useState("Home");
    return (
        <Router>
            <div className="flex">
                <div className="invisible sm:visible w-0 flex ml-0 mt-0 h-full top-0 left-0 sm:w-1/4">
                    <Navbar onTitleChange={(name) => setTitle(name)} />
                </div>
                {isNavbarOpen && (
                    <div className="sm:hidden">
                        <Navbar onTitleChange={(name) => setTitle(name)} />
                    </div>
                )}
                <TitleBar
                    title={title}
                    onToggleNavbar={() => setNavbarOpen(!isNavbarOpen)}
                />
                <div className="w-full mt-12 sm:w-3/4">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/gameplay" element={<GamePlay />} />
                        <Route exact path="/winner" element={<Winner />} />
                        <Route
                            exact
                            path="/playagain"
                            element={<PlayAgain />}
                        />
                        <Route exact path="/rules" element={<Rules />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
