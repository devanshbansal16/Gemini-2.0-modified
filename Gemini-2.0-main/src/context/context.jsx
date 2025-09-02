import { createContext, useState, useRef } from "react";
import runchat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompts, setRecentPrompts] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isStopped, setIsStopped] = useState(false);
  
  // Use refs to track the current generation process
  const isGeneratingRef = useRef(false);
  const timeoutIdsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach(id => {
      clearTimeout(id);
      console.log("Cleared timeout:", id);
    });
    timeoutIdsRef.current = [];
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
    setIsStopped(false);
    isGeneratingRef.current = false;
    clearAllTimeouts();
  };

  const stopGeneration = () => {
    console.log("Stop button clicked - stopping generation");
    setIsStopped(true);
    isGeneratingRef.current = false;
    setLoading(false);
    clearAllTimeouts();
  };

  const onSent = async (prompt, addToHistory = true) => {
    // Stop any previous generation and clear timeouts
    setIsStopped(false); // Reset stopped state first
    isGeneratingRef.current = false;
    clearAllTimeouts();
    
    // Wait a bit to ensure all timeouts are cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Reset for new question
    setIsStopped(false);
    isGeneratingRef.current = true;
    
    setResultData("");
    setLoading(true);
    setShowResults(true);

    let finalPrompt = prompt !== undefined ? prompt : input;

    if (finalPrompt.trim() === "") {
      setLoading(false);
      isGeneratingRef.current = false;
      return;
    }

    setRecentPrompts(finalPrompt);
    
    // Only add to history if it's a new prompt, not from sidebar
    if (addToHistory) {
      setPrevPrompts((prev) => [...prev, finalPrompt]);
    }

    try {
      const response = await runchat(finalPrompt);

      // Check if we should still continue (not stopped)
      if (!isGeneratingRef.current) {
        console.log("Generation stopped or cancelled");
        setLoading(false);
        isGeneratingRef.current = false;
        return;
      }

      // Check if response is an error message
      if (response.startsWith("Error:")) {
        setResultData(response);
        setLoading(false);
        isGeneratingRef.current = false;
        return;
      }

      // Process the response for better formatting
      let processedResponse = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/\. /g, '.<br>') // Add line breaks after sentences
        .replace(/! /g, '!<br>') // Add line breaks after exclamations
        .replace(/\? /g, '?<br>') // Add line breaks after questions
        .replace(/, /g, ',<br>') // Add line breaks after commas for better readability
        .replace(/; /g, ';<br>'); // Add line breaks after semicolons

      // Split into words while preserving HTML tags
      let newResponseArray = processedResponse.split(/(\s+)/);

      console.log("Full response:", response);
      console.log("Total words to display:", newResponseArray.length);
      console.log("Words array:", newResponseArray);

      // Display words one by one with delay
      for (let i = 0; i < newResponseArray.length; i++) {
        // Check if stopped before displaying each word
        if (!isGeneratingRef.current) {
          console.log("Stopped at word:", i);
          setLoading(false);
          isGeneratingRef.current = false;
          return; // Exit completely
        }
        
        const nextWord = newResponseArray[i];
        
        // Use Promise to wait for the delay
        await new Promise(resolve => {
          const timeoutId = setTimeout(() => {
            if (isGeneratingRef.current) {
              setResultData(prev => prev + nextWord + " ");
              console.log(`Displayed word ${i + 1}: "${nextWord}"`);
            }
            resolve();
          }, 100); // 100ms delay between words
          
          // Store timeout ID for cleanup
          timeoutIdsRef.current.push(timeoutId);
        });
        
        // Check again after the word is displayed
        if (!isGeneratingRef.current) {
          console.log("Stopped after displaying word:", i);
          setLoading(false);
          isGeneratingRef.current = false;
          return; // Exit completely
        }
      }

      // Set loading to false after all words are displayed
      if (isGeneratingRef.current) {
        setLoading(false);
        isGeneratingRef.current = false;
      }
    } catch (error) {
      console.error("Error in onSent:", error);
      setResultData("An unexpected error occurred. Please try again.");
      setLoading(false);
      isGeneratingRef.current = false;
    }

    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompts,
    recentPrompts,
    showResults,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    stopGeneration,
    isStopped,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
