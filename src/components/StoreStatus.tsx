import React, { FunctionComponent } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

export interface StoreStatusProps {
  status: string
}

const StoreStatus: FunctionComponent<StoreStatusProps> = ({
  status,
  children
}) => {
  if (status === 'offline') {
    return (
      <Dimmer active={true} inverted={false}>
        <Loader size="massive" />
      </Dimmer>
    )
  }

  return <div>{children}</div>
}

export default StoreStatus
