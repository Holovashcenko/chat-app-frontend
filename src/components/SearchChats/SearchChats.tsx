import styles from './SearchChats.module.css'

const SearchChats: React.FC = () => {
  return (
    <div className={styles.search}>
      <input type="text" placeholder="Search chats..." />
    </div>
  )
}

export default SearchChats
