import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import Screen from './screen'
import { CategoryType } from './components/Sidebar'

const HOME = 'Home'

const Layout = ({ store, children, history }) => {
  const openGroup = (to, id) => {
    if (to === HOME) {
      history.push('/')
      return
    }
    history.push(`/g/${id}`)
  }
  const onFileOpen = () => console.log('open file')
  const handleCreateFile = () => console.log('create')
  const handleSaveFile = () => console.log('save')

  return (
    <Screen
      username={store.profile ? store.profile.username : 'Anon'}
      avatarImage={undefined}
      categories={[
        {
          label: HOME,
          type: CategoryType.NOTES,
          id: 'home-id'
        },
        {
          label: 'Trash',
          type: CategoryType.TRASH,
          id: 'thrash-id'
        },
        {
          label: 'Posts',
          type: CategoryType.MYPOSTS,
          id: 'posts-id'
        }
      ]}
      showAddFab={!store.file}
      showSaveFab={!!store.file}
      onOpenGroup={openGroup}
      onCreateGroup={() => {
        console.log('on create group')
      }}
      onFileOpen={onFileOpen}
      onAddFile={handleCreateFile}
      onSaveFile={handleSaveFile}
    >
      {children}
    </Screen>
  )
}

export default inject('store')(observer(withRouter(Layout)))
