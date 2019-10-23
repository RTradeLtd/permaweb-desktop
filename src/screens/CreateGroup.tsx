import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import Store from '../Store'
import { History } from 'history'
import { inject } from 'mobx-react'
import { withRouter } from 'react-router'

interface CreateGroupProps {
  onCreateGroup: (groupName: string, groupDescription: string) => void
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onCreateGroup }) => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')

  const handleGroupNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.currentTarget.value)
    },
    [setGroupName]
  )

  const handleGroupDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setGroupDescription(event.currentTarget.value)
    },
    [setGroupDescription]
  )

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      onCreateGroup(groupName, groupDescription)

      return false
    },
    [onCreateGroup, groupName, groupDescription]
  )

  return (
    <div className="create-group">
      <h2>Create Group</h2>
      <CreateGroupForm onSubmit={handleSubmit}>
        <div>
          <label>Group Name</label>
          <input
            type={'text'}
            placeholder={'Enter a group name'}
            onChange={handleGroupNameChange}
            value={groupName}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows={4}
            placeholder={'Enter a group description'}
            onChange={handleGroupDescriptionChange}
            value={groupDescription}
          />
        </div>

        <div>
          <button type={'submit'}>Create Group</button>
        </div>
      </CreateGroupForm>
    </div>
  )
}

const CreateGroupForm = styled.form`
  display: flex;
  flex-direction: column;
`

const WrappedCreateGroup = ({
  store,
  history
}: {
  store: Store
  history: History
}) => {
  const handleCreateGroup = useCallback(
    async (groupName: string, groupDescription: string) => {
      const group = await store.groupsAdd(groupName, groupDescription)

      history.push(`/g/${group.id}`)
    },
    [store, history]
  )

  return <CreateGroup onCreateGroup={handleCreateGroup}></CreateGroup>
}

// eslint-disable-next-line
export default withRouter(inject('store')(WrappedCreateGroup as any))
