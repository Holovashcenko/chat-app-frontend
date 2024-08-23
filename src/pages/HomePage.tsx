import React from 'react'
import { ChatList, ChatMessages } from '../components'
import { HomeLayout } from '../layouts'
import { useParams } from 'react-router-dom'

const HomePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()

  return (
    <HomeLayout>
      <ChatList />

      {id && <ChatMessages chatId={id} />}
    </HomeLayout>
  )
}

export default HomePage
