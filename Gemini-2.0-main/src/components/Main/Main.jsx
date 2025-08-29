import React, { useContext, useState, useEffect } from "react";  
import "./Main.css";  
import { assets } from "../../assets/assets";  
import { Context } from "../../context/context";  

const Main = () => {  
  const {  
    onSent,  
    recentPrompts,  
    showResults,  
    loading,  
    resultData,  
    setInput,  
    input,
    stopGeneration,
    isStopped,
  } = useContext(Context);

  // Check if dark mode is enabled with state
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode"));

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };

    // Check theme on mount
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);  

  const handleSend = () => {  
    onSent(input);  
    setInput("");  
  };  

  const handleKeyPress = (e) => {  
    if (e.key === "Enter" && input) {  
      handleSend();  
    }  
  };  

  return (  
    <div className={`main ${isDarkMode ? 'dark' : 'light'}`}>  
      <div className="nav">  
        <p>Gemini</p>  
        <img src={assets.user_icon} alt="User Icon" />  
      </div>  
      <div className="main-container">  
        {!showResults ? (  
          <>  
            <div className="greet">  
              <p>  
                <span>Hello, Devansh.</span>  
              </p>  
              <p>How can I help you today?</p>  
            </div>  
            <div className="cards">  
              <div className="card">  
                <p>Suggest beautiful places to see on an upcoming road trip</p>  
                <img src={assets.compass_icon} alt="Compass Icon" />  
              </div>  
              <div className="card">  
                <p>Briefly summarize this concept: urban planning</p>  
                <img src={assets.bulb_icon} alt="Bulb Icon" />  
              </div>  
              <div className="card">  
                <p>Brainstorm team bonding activities for our work retreat</p>  
                <img src={assets.message_icon} alt="Message Icon" />  
              </div>  
              <div className="card">  
                <p>Improve the readability of the following code</p>  
                <img src={assets.code_icon} alt="Code Icon" />  
              </div>  
            </div>  
          </>  
        ) : (  
          <div className="result">  
            <div className="result-title">  
              <img src={assets.user_icon} alt="User Icon" />  
              <p>{recentPrompts}</p>  
            </div>  
            <div className="result-data">  
              <img src={assets.gemini_icon} alt="Gemini Icon" />  
              {loading && !resultData ? (
                <div className="loader">  
                  <hr />  
                  <hr />  
                  <hr />  
                </div>  
              ) : (
                <div className="answer-content">
                  <div dangerouslySetInnerHTML={{ __html: resultData }} />
                </div>
              )}
            </div>  
          </div>  
        )}  

        <div className="main-bottom">  
          <div className="search-box">  
            <input  
              onChange={(e) => setInput(e.target.value)}  
              value={input}  
              type="text"  
              placeholder="Enter a prompt here"  
              onKeyDown={handleKeyPress}  
            />  
            <div>  
              {loading ? (
                <button 
                  className="stop-button" 
                  onClick={stopGeneration}
                  title="Stop generation"
                >
                  <div className="stop-icon"></div>
                </button>
              ) : null}
              <img src={assets.gallery_icon} alt="Gallery Icon" />  
              <img src={assets.mic_icon} alt="Mic Icon" />  
              {!loading && input ? (  
                <img  
                  onClick={handleSend}  
                  src={assets.send_icon}  
                  alt="Send Icon"  
                  style={{ cursor: "pointer" }}  
                />  
              ) : null}  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default Main;  