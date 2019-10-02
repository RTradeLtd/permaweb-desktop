import React from 'react'
import { observer, inject } from 'mobx-react'
import { Dimmer, Loader } from 'semantic-ui-react'

function StoreStatus({ children, status }) {
  if (status === 'offline') {
    return (
      <Dimmer active={true} inverted={status.isLoading}>
        <Loader size="massive" />
      </Dimmer>
    )
  }

  return children
}

export default inject('store')(
  observer(({ store: { status }, children }) => (
    <StoreStatus status={status} children={children} />
  ))
)
