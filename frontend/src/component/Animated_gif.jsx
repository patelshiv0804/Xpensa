// import styles from "./Animated_gif.module.css";

// export default function Animated_gif() {
//     return (
//         <div className={styles.chatbot_overlay}>
//             <img src="chatbot.gif" alt="My GIF" />
//         </div>
//     );
// }

// import React, { useState } from "react";
// import { Card, CardContent } from "@shadcn/ui";
// import { Input } from "@shadcn/ui";
// import { Button } from "@shadcn/ui";

// import { Send } from "lucide-react";
// import { motion } from "framer-motion";
// import styles from "./Animated_gif.module.css";

// const XAgentChat = () => {
//     const [isChatOpen, setIsChatOpen] = useState(false);

//     return (
//         <div className={styles.container}>
//             {!isChatOpen ? (
//                 <div className={styles.chatbot_overlay} onClick={() => setIsChatOpen(true)}>
//                     <img src="chatbot.gif" alt="My GIF" className={styles.chatbot_image} />
//                 </div>
//             ) : (
//                 <motion.div
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={styles.chat_container}
//                 >
//                     <h1 className={styles.heading}>How can I help you???</h1>

//                     <Card className={styles.chat_card}>
//                         <CardContent>
//                             <h2 className={styles.chatbot_name}>Xagent</h2>
//                             <div className={styles.input_container}>
//                                 <Input type="text" placeholder="Ask something..." className={styles.input_field} />
//                                 <Button variant="default" className={styles.send_button}>
//                                     <Send size={20} />
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default XAgentChat;


// import React, { useState } from "react";
// import { Send } from "lucide-react";
// import { motion } from "framer-motion";
// import styles from "./Animated_gif.module.css";

// const XAgentChat = () => {
//     const [isChatOpen, setIsChatOpen] = useState(false);

//     return (
//         <div className={styles.container}>
//             {!isChatOpen ? (
//                 <div className={styles.chatbot_overlay} onClick={() => setIsChatOpen(true)}>
//                     <img src="chatbot.gif" alt="My GIF" className={styles.chatbot_image} />
//                 </div>
//             ) : (
//                 <motion.div
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={styles.chat_container}
//                 >
//                     <h1 className={styles.heading}>How can I help you???</h1>

//                     <div className={styles.chat_card}>
//                         <div className={styles.card_content}>
//                             <h2 className={styles.chatbot_name}>Xagent</h2>
//                             <div className={styles.input_container}>
//                                 <input type="text" placeholder="Ask something..." className={styles.input_field} />
//                                 <button className={styles.send_button}>
//                                     <Send size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default XAgentChat;
import React, { useState } from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";
import styles from "../styles/Animated_gif.module.css";

const Animated_gif = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

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
                    className={styles.chat_container}
                >
                    <button className={styles.close_button} onClick={() => setIsChatOpen(false)}>
                        <X size={20} />
                    </button>
                    <div className={styles.chat_header}>
                        <h1 className={styles.heading}>How can I help you???</h1>
                    </div>

                    <div className={styles.chat_card}>
                        <div className={styles.card_content}>
                            <h2 className={styles.chatbot_name}>Xagent</h2>
                            <div className={styles.input_container}>
                                <input type="text" placeholder="Ask something..." className={styles.input_field} />
                                <button className={styles.send_button}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Animated_gif;
