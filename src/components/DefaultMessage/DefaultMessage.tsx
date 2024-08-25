import React from 'react'
import { FaComments } from 'react-icons/fa'
import styles from './DefaultMessage.module.css'

const DefaultMessage: React.FC = () => {
  return (
    <div className={styles.defaultContainer}>
      <FaComments className={styles.icon} />
      <h2 className={styles.heading}>Welcome to the Chat App</h2>
      <p className={styles.text}>Please select a chat from the list to start messaging.</p>
      <p className={styles.text}>Or create a new chat to begin the conversation!</p>
    </div>
  )
}

export default DefaultMessage
