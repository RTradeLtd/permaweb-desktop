import React from 'react'
import MaterialAvatar from '@material-ui/core/Avatar'

interface AvatarProps {
  author: string
  className?: string
}

const convertToInitials = (author: string) => {
  const inital = (author || '').trim().length > 1 ? author.trim()[0] : '?'
  return inital.toUpperCase()
}

const Avatar: React.FC<AvatarProps> = ({ author, className }) => {
  const initials = convertToInitials(author)

  return (
    <div className={className}>
      <MaterialAvatar className={'avatar'}>{initials}</MaterialAvatar>
    </div>
  )
}

export default Avatar
