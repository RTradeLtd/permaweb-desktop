import React from 'react'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function Home() {
  return <div>
    <WelcomeMessage>Welcome to Permaweb</WelcomeMessage>
    <CreateProfileMessage>Let's create a profile</CreateProfileMessage>
    <p>You can modify your profile (except your name) later by clicking your profile on the lower left corner.</p>
    <InputContainer>
      <div>
        <AddPhotoIcon fontSize='large' />
      </div>
      <Message>Select a beautiful profile photo!</Message>
      <Button variant="contained" color='primary'>Save</Button>
    </InputContainer>

    <InputContainer>
      <Message> Your name </Message>
      <NameInputContainer><NameInput type="text" /></NameInputContainer>
      <Button variant="contained" color='primary'>Save</Button>
      <InputMessage>
        This makes it easy for people to add you to groups or @message you.
        <br />
        Careful, you won’t be able to change it later.
      </InputMessage>
    </InputContainer>

    <SearchConsent>
      <SearchMessage>Show your profile in search?</SearchMessage>
      <Select value='yes'>
        <MenuItem value={'yes'}>Yes</MenuItem>
        <MenuItem value={'no'}>No</MenuItem>
      </Select>

    </SearchConsent>

    <p>Permaweb users will be able to search for your username. This makes it easy to add you to groups.</p>
  </div>

}

const InputContainer = styled.div`
  display :flex;
  align-items: center;
  width: 50%;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 25px;
`
const InputMessage = styled.p`
  width: 100%
`

const AddPhotoIcon = styled(AddAPhotoIcon)`
  width: 15%
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
const SearchMessage = styled(Message)`
  margin-right: 30px;
`

const NameInputContainer = styled.div`
  width: 48%;
`
const NameInput = styled.input`
  border-style: none;
  background: transparent;
  border-radius: 10px;
  border: 1px solid black;
  line-height: 2em;
  width: 265px;
`
const SearchConsent = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
`

export default Home
