import React from 'react'
import { ChatHeader, ChatList, ChatMessages, SearchChats } from '../components'
import { HomeLayout } from '../layouts'

const HomePage: React.FC = () => {
  return (
    <HomeLayout>
      <SearchChats />
      <ChatList />
      <ChatHeader />
      <ChatMessages />
    </HomeLayout>
  )
}

export default HomePage
