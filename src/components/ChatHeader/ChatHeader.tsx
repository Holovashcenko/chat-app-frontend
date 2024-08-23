import React from 'react'
import styles from './ChatHeader.module.css'

type Props = {
  chatName: string
}
const ChatHeader: React.FC<Props> = ({ chatName }) => {
  return (
    <div className={styles.header}>
      <h1>{chatName}</h1>
    </div>
  )
}

export default ChatHeader
