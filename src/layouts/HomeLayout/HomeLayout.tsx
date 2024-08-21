import React from 'react'
import styles from './HomeLayout.module.css'

type Props = {
  children: React.ReactNode
}

const HomeLayout: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export default HomeLayout
