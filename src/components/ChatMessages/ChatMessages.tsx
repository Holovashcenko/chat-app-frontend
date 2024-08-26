import React, { useEffect, useState } from 'react'
import axios from 'axios'
import socket from '../../config/socket'
import styles from './ChatMessages.module.css'
import ChatHeader from '../ChatHeader/ChatHeader'
import { FaPaperPlane, FaTrash } from 'react-icons/fa'
import defaultUserImg from '../../assets/default-user.jpg'
import rightUserImg from '../../assets/me.png'
import Notification from '../Notification/Notification'

type Message = {
  _id: string
  content: string
  owner: string
  createdAt: string
  chatName: string
  chatId: string
}

type Props = {
  chatId: string
}

const ChatMessages: React.FC<Props> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState<string>('')
  const [autoMessage, setAutoMessage] = useState<boolean>(false)
  const [notification, setNotification] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/messages/${chatId}`)
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

    socket.on('newMessage', (message: Message) => {
      console.log('New message received:', message)
      if (message.owner === 'user') {
        setNotification('You have received a new message!')
        setTimeout(() => setNotification(null), 4000)
      }
      if (message.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    })

    return () => {
      socket.off('newMessage')
    }
  }, [chatId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      await axios.post(`${apiUrl}/api/messages`, {
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/messages/${messageId}`)
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId))
    } catch (err) {
      console.log(err)
      setError('Failed to delete message')
    }
  }

  const toggleAutoMessage = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/messages/auto-message/toggle`, {
        enabled: !autoMessage,
      })

      if (response.status === 200) {
        setAutoMessage(!autoMessage)
      }
    } catch (err) {
      console.log(err)
      setError('Failed to update auto message status')
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
              <img
                src={message.owner === 'me' ? rightUserImg : defaultUserImg}
                alt="User"
                className={styles.userImage}
              />
              <div>
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageDate}>
                  {new Date(message.createdAt).toLocaleString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </div>
                {message.owner === 'me' && (
                  <button className={styles.deleteButton} onClick={() => handleDeleteMessage(message._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>
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
      <button onClick={toggleAutoMessage} className={styles.autoMessageButton}>
        {autoMessage ? 'Stop Auto Messages' : 'Start Auto Messages'}
      </button>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  )
}

export default ChatMessages
