import React from 'react'
import styles from './ChatList.module.css'

const ChatList: React.FC = () => {
  return (
    <div className={styles.list}>
      <div className={styles.item}>Chat 1</div>
      <div className={styles.item}>Chat 2</div>
      <div className={styles.item}>Chat 3</div>
      <div className={styles.item}>Chat 4</div>
    </div>
  )
}

export default ChatList
