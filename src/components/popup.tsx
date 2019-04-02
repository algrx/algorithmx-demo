import * as React from 'react'
import { connect } from 'react-redux'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { ClosePopupProps, mapClosePopupToProps } from '../state/popup'
import { PaneHeader } from './paneheader'
import './popup.scss'

interface PopupProps extends ClosePopupProps {
  readonly title: string
}

const Popup: React.FC<PopupProps> = props => {
  return (
    <div className='popup'>
      <div className='popup-window'>
        <PaneHeader title={props.title} buttons={[{ icon: faTimes, onClick: props.dispatchClosePopup }]}/>
        <div className='popup-inner'>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export const PopupConnected = connect(
  () => ({}),
  mapClosePopupToProps
)(Popup)
