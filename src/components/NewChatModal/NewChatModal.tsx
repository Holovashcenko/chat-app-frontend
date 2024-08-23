import React, { useState } from 'react'
import styles from './NewChatModal.module.css'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (firstName: string, lastName: string) => void
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Both first name and last name are required.')
      return
    }
    onCreate(firstName, lastName)
    setFirstName('')
    setLastName('')
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Create New Chat</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <div className={styles.buttons}>
          <button onClick={handleCreate} className={styles.create}>
            Create
          </button>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewChatModal
