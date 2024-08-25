import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaSearch } from 'react-icons/fa'
import styles from './SearchChats.module.css'

interface Chat {
  _id: string
  firstName: string
  lastName: string
  lastMessageContent: string
  lastMessageDate: string
}

const SearchChats: React.FC<{ onSearchResults: (chats: Chat[]) => void }> = ({ onSearchResults }) => {
  const [query, setQuery] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [query])

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let response
        if (debouncedQuery.trim() === '') {
          response = await axios.get('http://localhost:5000/api/chats')
        } else {
          response = await axios.get(`http://localhost:5000/api/chats/search`, {
            params: { query: debouncedQuery },
          })
        }
        onSearchResults(response.data)
      } catch (err) {
        console.error('Failed to search chats', err)
      }
    }

    fetchSearchResults()
  }, [debouncedQuery, onSearchResults])

  return (
    <div className={styles.search}>
      <FaSearch className={styles.icon} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search chats..."
        className={styles.input}
      />
    </div>
  )
}

export default SearchChats
