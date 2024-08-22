import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './ChatMessages.module.css'
import ChatHeader from '../ChatHeader/ChatHeader'

interface Message {
  _id: string
  content: string
  owner: string
  createdAt: string
}

interface ChatMessagesProps {
  chatId: string
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>('')

  useEffect(() => {
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

    fetchMessages()
  }, [chatId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      const response = await axios.post(`http://localhost:5000/api/messages`, {
        content: newMessage,
        chatId: chatId,
      })
      setMessages([...messages, response.data])
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
    <>
      <ChatHeader />
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
        <form className={styles.form} onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Send
          </button>
        </form>
      </div>
    </>
  )
}

export default ChatMessages
