import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa'
import styles from './ChatList.module.css'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import NewChatModal from '../NewChatModal/NewChatModal'
import SearchChats from '../SearchChats/SearchChats'

interface Chat {
  _id: string
  firstName: string
  lastName: string
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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats')
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
      await axios.put(`http://localhost:5000/api/chats/${chatId}`, {
        firstName: editFirstName,
        lastName: editLastName,
      })
      const response = await axios.get('http://localhost:5000/api/chats')
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
        await axios.delete(`http://localhost:5000/api/chats/${chatToDelete}`)
        const response = await axios.get('http://localhost:5000/api/chats')
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
      await axios.post('http://localhost:5000/api/chats', { firstName, lastName })
      const response = await axios.get('http://localhost:5000/api/chats')
      setChats(response.data)
    } catch (err) {
      console.error('Failed to create chat:', err)
      setError('Failed to create chat')
    }
    setNewChatModalOpen(false)
  }

  const handleSearchResults = (searchResults: Chat[]) => {
    setChats(searchResults)
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <>
      <SearchChats onSearchResults={handleSearchResults} />
      <div className={styles.list}>
        <button className={styles.newChatButton} onClick={() => setNewChatModalOpen(true)}>
          <FaPlus className={styles.newChatIcon} />
          New Chat
        </button>
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
                <div className={styles.chatInfo}>
                  <Link to={`/chat/${chat._id}`} className={styles.chatLink}>
                    {chat.firstName} {chat.lastName}
                  </Link>
                  <div className={styles.actions}>
                    <FaEdit
                      className={styles.editIcon}
                      onClick={() => {
                        setEditChatId(chat._id)
                        setEditFirstName(chat.firstName)
                        setEditLastName(chat.lastName)
                      }}
                    />
                    <FaTrashAlt className={styles.deleteIcon} onClick={() => handleDeleteChat(chat._id)} />
                  </div>
                </div>
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
    </>
  )
}

export default ChatList
