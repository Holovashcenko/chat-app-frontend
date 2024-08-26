import React from 'react'
import styles from './Notification.module.css'

type Props = {
  message: string
  onClose: () => void
}

const Notification: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div className={styles.notification}>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        &times;
      </button>
    </div>
  )
}

export default Notification
