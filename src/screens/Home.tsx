import React from 'react'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

function Home() {
  return <div>
    <WelcomeMessage>Welcome to Permaweb</WelcomeMessage>
    <CreateProfileMessage>Let's create a profile</CreateProfileMessage>
    <p>You can modify your profile (except your name) later by clicking your profile on the lower left corner.</p>
    <AddPhotoContainer>
      <AddPhotoIcon fontSize='large' />
      <AddPhotoMessage>Select a beautiful profile photo!</AddPhotoMessage>
      <Button variant="contained" color='primary'>Save</Button>
    </AddPhotoContainer>

    <AddPhotoContainer>
      <Message> Your name </Message>
      <NameInput type="text" />
      <Button variant="contained" color='primary'>Save</Button>
    </AddPhotoContainer>

    This makes it easy for people to add you to groups or @message you, Careful, you won’t be able to change it later.
    Show your profile in search?
    Permaweb users will be able to search for your username. This makes it easy to add you to groups.

    <SearchConsent>
      <Message>Show your profile in search?</Message>
      <Select></Select>

    </SearchConsent>
    
    <p>Permaweb users will be able to search for your username. This makes it easy to add you to groups.</p>


  </div>

}

const InputContainer = styled.div`

`

const AddPhotoContainer = styled.div`
  display :flex;
  align-items: center;
  width: 50%;
  margin-bottom: 5px;
`
const AddPhotoIcon = styled(AddAPhotoIcon)`
  margin-right: 5%;
`
const Message = styled.div`
  font-size: 18px;
  line-height: 21px;
`
const CreateProfileMessage = styled(Message)`
  margin-bottom: 15px;
`
const WelcomeMessage = styled(Message)`
  margin-bottom: 30px;
`

const NameContainer = styled.div`
  display: flex;
`

const NameInput = styled.input`
  border-style: none;
  background: transparent;
  border-radius: 10px;
  border: 1px solid black;
`
const SearchConsent = styled.div`
  display: flex;
`

const AddPhotoMessage = styled(Message)`
  margin-right: 5%;
`

export default Home
