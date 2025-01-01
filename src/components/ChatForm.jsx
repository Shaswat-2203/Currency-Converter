import {useRef} from "react";

const ChatForm = ({chatHistory,setChatHistory,generateBotResponse}) => {

    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value="";

        //update chat history with user's message
        setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

        setTimeout(() => {
            //Add thinking stage
            setChatHistory(history => [...history, {role: "model", text: "Thinking..."}])
            //Call the function to generate the bot's reponse
            generateBotResponse([...chatHistory, {role: "user", text: userMessage}]);
        },600);

        //call the function to generate the bot's reponse

    }


    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Message..."
                   className="message-input" required/>
            <button className="material-symbols-outlined">arrow_upward</button>
        </form>
    );
};

export default ChatForm