import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./sidebar";
import Header from "./header";

const Layout = () => {
  const [isShown, setIsShown] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const pushToggle = (toggle) => {
    setIsSideBarOpen(toggle);
  };

  const [windowDimenion, detectW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  useEffect(() => {
    if (windowDimenion.winWidth < 800) {
      setIsSideBarOpen(false);
    } else {
      setIsSideBarOpen(true);
    }
  }, [windowDimenion]);

  return (
    <div className="layout-component">
      <div
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <SideBar
          pushToggle={pushToggle}
          isSideBarOpen={isSideBarOpen}
          isShown={isShown}
        />
      </div>
      <Header
        pushToggle={pushToggle}
        isSideBarOpen={isSideBarOpen}
        isShown={isShown}
      />
      <div className="page-container">
        <section
          id="main-content"
          className={!isSideBarOpen && !isShown ? "sidebar_shift" : ""}
        >
          <div className="main-wrapper">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Layout;
