import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './ChatMessages.module.css'
import ChatHeader from '../ChatHeader/ChatHeader'
import { FaPaperPlane } from 'react-icons/fa'

type Message = {
  _id: string
  content: string
  owner: string
  createdAt: string
  chatName: string
}

type Props = {
  chatId: string
}

const ChatMessages: React.FC<Props> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>('')

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${chatId}`)
      setMessages(response.data)
    } catch (err) {
      console.log(err)
      setError('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!chatId) {
      setError('Invalid chat ID')
      setLoading(false)
      return
    }

    fetchMessages()
  }, [chatId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      await axios.post(`http://localhost:5000/api/messages`, {
        content: newMessage,
        chatId: chatId,
      })
      await fetchMessages()
      setNewMessage('')
    } catch (err) {
      console.log(err)
      setError('Failed to send message')
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <ChatHeader chatName={messages.length > 0 ? messages[0].chatName : 'Chat'} />
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div>No messages</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`${styles.message} ${
                message.owner === 'me' ? styles['message-right'] : styles['message-left']
              }`}
            >
              {message.content}
            </div>
          ))
        )}
      </div>
      <form className={styles.form} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  )
}

export default ChatMessages
