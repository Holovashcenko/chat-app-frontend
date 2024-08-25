import React from 'react'
import { ChatList, ChatMessages } from '../components'
import { HomeLayout } from '../layouts'
import { useParams } from 'react-router-dom'
import DefaultMessage from '../components/DefaultMessage/DefaultMessage'

const HomePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()

  return (
    <HomeLayout>
      <ChatList />

      {id ? <ChatMessages chatId={id} /> : <DefaultMessage />}
    </HomeLayout>
  )
}

export default HomePage
