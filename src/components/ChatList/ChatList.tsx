import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrashAlt, FaPlus, FaUser } from 'react-icons/fa'
import styles from './ChatList.module.css'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import NewChatModal from '../NewChatModal/NewChatModal'
import SearchChats from '../SearchChats/SearchChats'

interface Chat {
  _id: string
  firstName: string
  lastName: string
  lastMessageContent: string
  lastMessageDate: string
}

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [editChatId, setEditChatId] = useState<string | null>(null)
  const [editFirstName, setEditFirstName] = useState<string>('')
  const [editLastName, setEditLastName] = useState<string>('')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [newChatModalOpen, setNewChatModalOpen] = useState<boolean>(false)

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/chats`)
        setChats(response.data)
      } catch (err) {
        console.error('Failed to fetch chats:', err)
        setError('Failed to fetch chats')
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  const handleUpdateChat = async (chatId: string) => {
    try {
      await axios.put(`${apiUrl}/api/chats/${chatId}`, {
        firstName: editFirstName,
        lastName: editLastName,
      })
      const response = await axios.get(`${apiUrl}/api/chats`)
      setChats(response.data)
      setEditChatId(null)
    } catch (err) {
      console.error('Failed to update chat:', err)
      setError('Failed to update chat')
    }
  }

  const handleDeleteChat = (chatId: string) => {
    setModalOpen(true)
    setChatToDelete(chatId)
  }

  const confirmDeleteChat = async () => {
    if (chatToDelete) {
      try {
        await axios.delete(`${apiUrl}/api/chats/${chatToDelete}`)
        const response = await axios.get(`${apiUrl}api/chats`)
        setChats(response.data)
      } catch (err) {
        console.error('Failed to delete chat:', err)
        setError('Failed to delete chat')
      }
      setChatToDelete(null)
    }
    setModalOpen(false)
  }

  const cancelDeleteChat = () => {
    setChatToDelete(null)
    setModalOpen(false)
  }

  const handleCreateChat = async (firstName: string, lastName: string) => {
    try {
      await axios.post(`${apiUrl}/api/chats`, { firstName, lastName })
      const response = await axios.get(`${apiUrl}/api/chats`)
      setChats(response.data)
    } catch (err) {
      console.error('Failed to create chat:', err)
      setError('Failed to create chat')
    }
    setNewChatModalOpen(false)
  }

  const handleSearchResults = useCallback((searchResults: Chat[]) => {
    setChats(searchResults)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div>
      <SearchChats onSearchResults={handleSearchResults} />

      <div className={styles.list}>
        <div className={styles.buttonWrapper}>
          <button className={styles.newChatButton} onClick={() => setNewChatModalOpen(true)}>
            <FaPlus className={styles.newChatIcon} aria-label="New Chat" />
            New Chat
          </button>
        </div>
        {chats.length === 0 ? (
          <div className={styles.noChats}>No chats available</div>
        ) : (
          chats.map((chat) => (
            <div key={chat._id} className={styles.item}>
              {editChatId === chat._id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                  <button className={styles.save} onClick={() => handleUpdateChat(chat._id)}>
                    Save
                  </button>
                  <button className={styles.cancel} onClick={() => setEditChatId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.chatInfo}>
                    <div className={styles.chatDetails}>
                      <FaUser className={styles.userIcon} aria-label="User Icon" />
                      <Link to={`/chat/${chat._id}`} className={styles.chatLink}>
                        {chat.firstName} {chat.lastName}
                      </Link>
                      <div className={styles.chatDate}>
                        {chat.lastMessageDate ? formatDate(chat.lastMessageDate) : ''}
                      </div>
                    </div>
                    <div className={styles.lastMessage}>{chat.lastMessageContent ? chat.lastMessageContent : ''}</div>
                  </div>
                  <div className={styles.actions}>
                    <FaEdit
                      className={styles.editIcon}
                      onClick={() => {
                        setEditChatId(chat._id)
                        setEditFirstName(chat.firstName)
                        setEditLastName(chat.lastName)
                      }}
                      aria-label="Edit chat"
                    />
                    <FaTrashAlt
                      className={styles.deleteIcon}
                      onClick={() => handleDeleteChat(chat._id)}
                      aria-label="Delete chat"
                    />
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <ConfirmModal
          isOpen={modalOpen}
          message="Are you sure? After deleting, you won't be able to get it back."
          onConfirm={confirmDeleteChat}
          onCancel={cancelDeleteChat}
        />
        <NewChatModal
          isOpen={newChatModalOpen}
          onClose={() => setNewChatModalOpen(false)}
          onCreate={handleCreateChat}
        />
      </div>
    </div>
  )
}

export default ChatList
