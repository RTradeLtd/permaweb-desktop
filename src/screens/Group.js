import React from 'react'
import { observer, inject } from 'mobx-react'
import FolderListing from '../components/FolderListing'
import FileEntry from '../components/FileEntry'

function useGroup(files) {
  const folderListing = Object.keys(files).map(fileId => {
    const latestEntry = files[fileId][0]
    return {
      id: fileId,
      version: 0,
      hash: latestEntry.hash,
      fileKey: latestEntry.key,
      title: latestEntry.stored.name
    }
  })

  return { folderListing }
}

function Group({ files }) {
  const { folderListing } = useGroup(files)

  const handleFileOpen = () => console.log('file open')
  const handleCopyLink = () => console.log('copy link')
  const handleShowHistory = () => console.log('history')
  const handleDeleteFile = () => console.log('delete')

  return (
    <FolderListing>
      {folderListing.map(f => {
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
  observer(({ store: { files } }) => <Group files={files} />)
)
