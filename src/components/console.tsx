import * as React from 'react'
import { connect } from 'react-redux'

import { PaneHeader } from './paneheader'
import { RootState } from '../state/root'
import { ExecuteState, LogType } from '../execute/state'
import './console.scss'

type Log = ExecuteState['log']

interface StateProps {
  readonly log: Log
}

const Console: React.FC<StateProps> = props => {
  return (
    <div className='console-container'>
      <PaneHeader title='CONSOLE' buttons={[]}/>
      <div className='console scrollbar-y scrollbar-x'>
        {props.log.map((line, i) => {
          const textClass = {
            [LogType.Normal]: 'console-text-normal',
            [LogType.Error]: 'console-text-error'
          }[line.type]
          return <pre key={i} className={`console-text ${textClass}`}>{line.text}</pre>
        })}
      </div>
    </div>
  )
}

export const ConsoleConnected = connect<StateProps, {}, {}, RootState>(
  state => ({ log: state.executeState.log })
)(Console)
