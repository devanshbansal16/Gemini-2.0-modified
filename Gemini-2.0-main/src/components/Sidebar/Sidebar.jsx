import React, { useState, useContext, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const { onSent, prevPrompts, setRecentPrompts, newChat } =
    useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompts(prompt);
    await onSent(prompt, false); // Don't add to history when loading from sidebar
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
    
    // Change the entire page background and force it
    if (newDarkMode) {
      document.body.style.backgroundColor = "#1e1e1e";
      document.body.style.color = "#ffffff";
      document.documentElement.style.backgroundColor = "#1e1e1e";
      document.documentElement.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#2c3e50";
      document.documentElement.style.backgroundColor = "#ffffff";
      document.documentElement.style.color = "#2c3e50";
    }
    
    localStorage.setItem("darkMode", newDarkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.style.backgroundColor = "#1e1e1e";
      document.body.style.color = "#ffffff";
      document.documentElement.style.backgroundColor = "#1e1e1e";
      document.documentElement.style.color = "#ffffff";
    } else {
      document.body.classList.remove("dark-mode");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#2c3e50";
      document.documentElement.style.backgroundColor = "#ffffff";
      document.documentElement.style.color = "#2c3e50";
    }
  }, [darkMode]);

  return (
    <div className={`sidebar ${darkMode ? "dark" : "light"}`}>
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        <div onClick={newChat} className="new-chat">
          <img src={assets.plus_icon} alt="New Chat Icon" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => (
              <div
                key={index}
                onClick={() => loadPrompt(item)}
                className="recent-entry"
              >
                <img src={assets.message_icon} alt="Message Icon" />
                <p>{item}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry" onClick={toggleTheme}>
          <img src={assets.setting_icon} alt="Toggle Theme Icon" />
          {extended ? <p>{darkMode ? "Light Mode" : "Dark Mode"}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
