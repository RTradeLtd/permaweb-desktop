import React from 'react'
import { observer, inject } from 'mobx-react'
import FolderListing from '../components/FolderListing'
import FileEntry from '../components/FileEntry'
import MOCK_FILES from '../mocks/files'

function useGroup(id) {
  // fetch group using id
  // fetch files contents and map to list
  const list = MOCK_FILES.filter(({ groupId }) => groupId === id)

  return { list }
}

function Group({ id }) {
  const { list } = useGroup(id)

  const handleFileOpen = () => console.log('file open')
  const handleCopyLink = () => console.log('copy link')
  const handleShowHistory = () => console.log('history')
  const handleDeleteFile = () => console.log('delete')

  return (
    <FolderListing>
      {list.map(f => {
        return (
          <FileEntry
            key={f.id}
            {...f}
            onClick={handleFileOpen}
            onCopyLink={handleCopyLink}
            onShowHistory={handleShowHistory}
            onDelete={handleDeleteFile}
          />
        )
      })}
    </FolderListing>
  )
}

export default inject('store')(
  observer(({ store, match: { params: { groupId } } }) => (
    <Group id={groupId} />
  ))
)
