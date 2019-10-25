import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import Store from '../Store'
import { History } from 'history'
import { inject } from 'mobx-react'
import { withRouter } from 'react-router'

interface CreateGroupProps {
  onCreateGroup: (groupName: string) => void
}

export const CreateGroup: React.FC<CreateGroupProps> = ({ onCreateGroup }) => {
  const [groupName, setGroupName] = useState('')

  const handleGroupNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.currentTarget.value)
    },
    [setGroupName]
  )

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      onCreateGroup(groupName)

      return false
    },
    [onCreateGroup, groupName]
  )

  return (
    <CreateGroupContainer>
      <MainColumn>
        <Title>Create Group</Title>
        <CreateGroupForm onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Group Name</FormLabel>
            <input
              required
              type={'text'}
              placeholder={'Enter a group name'}
              onChange={handleGroupNameChange}
              maxLength={120}
              value={groupName}
            />
          </FormControl>

          <ButtonRow>
            <SubmitButton type={'submit'}>Create Group</SubmitButton>
          </ButtonRow>
        </CreateGroupForm>
      </MainColumn>
    </CreateGroupContainer>
  )
}

const CreateGroupContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 50px auto 50px;
  grid-template-areas: '. main .';
`

const MainColumn = styled.div`
  grid-area: main;
  justify-self: start;
  width: 406px;
`

const Title = styled.h2`
  color: #696a77;
`

const CreateGroupForm = styled.form`
  display: flex;
  flex-direction: column;
`

const FormControl = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;

  input {
    width: 300px;
  }

  textarea {
    width: 300px;
  }
`

const FormLabel = styled.label`
  display: inline-block;
  vertical-align: top;
  width: 100px;
  color: #696a77;
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 406px;
`

const SubmitButton = styled.button`
  background: #4267b2;
  font-size: 14px;
  padding: 6px 10px 6px 10px;
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background: #375695;
    color: lightgray;
  }
`

const WrappedCreateGroup = ({
  store,
  history
}: {
  store: Store
  history: History
}) => {
  const handleCreateGroup = useCallback(
    async (groupName: string) => {
      const group = await store.groupsAdd(groupName)

      history.push(`/g/${group.id}`)
    },
    [store, history]
  )

  return <CreateGroup onCreateGroup={handleCreateGroup}></CreateGroup>
}

// eslint-disable-next-line
export default withRouter(inject('store')(WrappedCreateGroup as any))
