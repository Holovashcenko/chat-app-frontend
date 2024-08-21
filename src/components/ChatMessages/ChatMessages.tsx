import React from 'react'
import styles from './ChatMessages.module.css'

const ChatMessages: React.FC = () => {
  return (
    <div className={styles.messages}>
      <div className={styles.message}>Hello!</div>
      <div className={styles.message}>How are you?</div>
    </div>
  )
}

export default ChatMessages
