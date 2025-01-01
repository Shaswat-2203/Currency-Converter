import ChatbotIcon from "./components/ChatbotIcon.jsx";
import ChatForm from "./components/ChatForm.jsx";
import {useEffect, useRef, useState} from "react";
import ChatMessage from "./components/ChatMessage.jsx";

function App() {

    const [chatHistory,setChatHistory] = useState([]);

    const [showChat,setShowChat] = useState(false);

    const chatBodyRef = useRef();

    const generateBotResponse = async (history) => {

        const updateHistory = (text) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text }]);
        }


        history = history.map(({role, text}) => ({role, parts: [{text}]}));

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({contents: history})
        }

        try {
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || "Something went wrong");

            const apiResponseText =data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        //Auto scroll
        chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
    }, [chatHistory]);

  return (
      <>
          <div className={`container ${showChat ? 'show-chatbot': ''}`}>
              <button onClick={() => setShowChat(prev => !prev)} id="chatbot-toggler">
                  <span className="material-symbols-outlined">
                      mode_comment
                  </span>
                  <span className="material-symbols-outlined">
                      close
                  </span>
              </button>
              <div className="chatbot-popup">
                  {/* Chatbot Header */}
                  <div className="chat-header">
                      <div className="header-info">
                          <ChatbotIcon />
                          <h2 className="logo-text"> Chatbot</h2>
                      </div>
                      <button onClick={() => setShowChat(prev => !prev)}
                          className="material-symbols-outlined">keyboard_arrow_down</button>
                  </div>
                  {/* Chatbot Body */}
                  <div ref={chatBodyRef} className="chat-body">
                      <div className="message bot-message">
                          <ChatbotIcon/>
                          <p className="message-text">
                              Hey there <br/> How can I help you today?
                          </p>
                      </div>


                      {chatHistory.map((chat, index) => (
                          <ChatMessage key={index} chat={chat}/>
                      ))}
                  </div>
                  {/* Chatbot Footer */}
                  <div className="chat-footer">
                        <ChatForm chatHistory={chatHistory}  setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
                  </div>
              </div>
          </div>
      </>
  )
}

export default App
