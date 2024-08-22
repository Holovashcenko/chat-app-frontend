import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from './ChatList.module.css'

interface Chat {
  _id: string
  firstName: string
  lastName: string
}

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats')
        setChats(response.data)
      } catch (err) {
        console.log(err)
        setError('Failed to fetch chats')
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.list}>
      {chats.length === 0 ? (
        <div className={styles.noChats}>No chats available</div>
      ) : (
        chats.map((chat) => (
          <Link key={chat._id} to={`/chat/${chat._id}`} className={styles.item}>
            {chat.firstName} {chat.lastName}
          </Link>
        ))
      )}
    </div>
  )
}

export default ChatList
