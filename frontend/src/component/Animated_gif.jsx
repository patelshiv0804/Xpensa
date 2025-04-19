import React, { useState, useEffect, useRef } from "react";
import { Send, X, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import styles from "../styles/Animated_gif.module.css";
import axios from 'axios';

const Animated_gif = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // Add user message to chat
        const userMessage = inputValue;
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            
            const userId = localStorage.getItem("userId") || "anonymous";

            const response = await axios.post("http://localhost:3000/agent/get", {
                userId: userId,
                userQuery: userMessage
            });

            
            const responseData = response.data.reply;
            let displayMessage;

            try {

                const parsedReply = JSON.parse(responseData);
                displayMessage = parsedReply.reply || "No message content";
            }
            catch (error) {
                displayMessage = responseData;
            }

            setMessages(prev => [...prev, displayMessage]);
        } catch (error) {
            console.error("Error calling agent API:", error);
            setMessages(prev => [...prev, "Sorry, there was an error processing your request."]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={styles.container}>
            {!isChatOpen ? (
                <div className={styles.chatbot_overlay} onClick={() => setIsChatOpen(true)}>
                    <img src="chatbot.gif" alt="My GIF" className={styles.chatbot_image} />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.chat_container} ${isExpanded ? styles.expanded : ""}`}
                >
                    <div className={styles.chat_header}>
                        <h1 className={styles.heading}>How can I help you?</h1>
                        <div className={styles.header_buttons}>
                            <button className={styles.expand_button} onClick={toggleExpand}>
                                {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                            <button className={styles.close_button} onClick={() => setIsChatOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.chat_body} ref={chatContainerRef}>
                        {messages.length === 0 ? (
                            <div className={styles.empty_chat}>
                                <h2 className={styles.chatbot_name}>Xagent</h2>
                            </div>
                        ) : (
                            <div className={styles.messages_container}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.message} ${index % 2 === 0 ? styles.user_message : styles.agent_message
                                            }`}
                                    >
                                        <div className={styles.message_bubble}>
                                            {message}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className={`${styles.message} ${styles.agent_message}`}>
                                        <div className={`${styles.message_bubble} ${styles.loading_bubble}`}>
                                            <span className={styles.loading_dots}></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.chat_footer}>
                        <div className={styles.input_container}>
                            <input
                                type="text"
                                placeholder="Ask something..."
                                className={styles.input_field}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button
                                className={styles.send_button}
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Animated_gif;