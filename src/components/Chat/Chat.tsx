import useChat from "../../hooks/useChat";

import styles from "../../styles/components/Chat.module.scss";

const Chat: React.FC = () => {
  const { inputValue, endOfMessagesRef, setInputValue, showMessages, submitHandler } = useChat();

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {showMessages()}
        <div ref={endOfMessagesRef}></div>
      </div>
      <form onSubmit={submitHandler}>
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Chat;
