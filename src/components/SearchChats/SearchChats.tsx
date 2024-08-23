import React, { useState } from 'react'
import axios from 'axios'
import styles from './SearchChats.module.css'

type Chat = {
  _id: string
  firstName: string
  lastName: string
}

const SearchChats: React.FC<{ onSearchResults: (chats: Chat[]) => void }> = ({ onSearchResults }) => {
  const [query, setQuery] = useState<string>('')

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chats/search`, {
        params: { query },
      })
      onSearchResults(response.data)
    } catch (err) {
      console.error('Failed to search chats', err)
    }
  }

  return (
    <div className={styles.search}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search chats..."
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchChats
