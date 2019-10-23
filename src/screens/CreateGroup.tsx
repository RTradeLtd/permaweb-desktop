import React from 'react'

interface CreateGroupProps {
  className?: string
}

const CreateGroup: React.FC<CreateGroupProps> = props => {
  return (
    <div className="create-group">
      <h2>Create Group</h2>
    </div>
  )
}

export default CreateGroup
