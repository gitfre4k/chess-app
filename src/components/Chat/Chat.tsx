import useChat from "../../hooks/useChat";

import Button from "../Button/Button";
import styles from "../../styles/components/Chat.module.scss";

const Chat: React.FC = () => {
  const { inputValue, endOfMessagesRef, setInputValue, showMessages, submitHandler } = useChat();

  return (
    <div className={styles.chat}>
      <div className={styles.chat__messages}>
        {showMessages()}
        <div ref={endOfMessagesRef}></div>
      </div>
      <form onSubmit={submitHandler}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Aa"
        />
        <Button name="Send" action={() => {}} style="dark" />
      </form>
    </div>
  );
};

export default Chat;
