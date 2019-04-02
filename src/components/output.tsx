import * as React from 'react'
import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faSyncAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'

import { AlgrXState, initAlgrx, resetAlgrx, pauseCanvas, resumeCanvas } from '../execute/algorithmx'
import { loadBrython } from '../execute/python'

import { PaneHeader } from './paneheader'
import { RootState } from '../state/root'
import { store } from '../index'
import { PLang } from '../state/plang'
import { AppActionType } from './app'
import { ExecuteState } from '../execute/state'
import { newExecuteId } from '../execute/utils'
import { execute } from '../execute/execute'
import { ExecuteDispatchProps, mapExecuteDispatchToProps, LogType } from '../execute/state'
import './output.scss'

interface StateProps {
  readonly curPLang: PLang
  readonly getCode: () => string
  readonly executeState: ExecuteState
}

const triggerExecute = (
    algrxState: AlgrXState,
    executeId: string,
    props: StateProps & ExecuteDispatchProps): void => {

  const pLang = props.curPLang
  const code = props.getCode()
  const onOut = (msg: string) => props.dispatchLog(msg, LogType.Normal)
  const onErr = (msg: string) => props.dispatchLog(msg, LogType.Error)

  setTimeout(() => {
    execute({
      algrxState,
      onUpdate: props.dispatchAlgrx,
      executeId, pLang, code, onOut, onErr
    })
  }, 50)
}

const dispatchExecute = (props: StateProps & ExecuteDispatchProps): void => {
  const executeId = newExecuteId()
  props.dispatchExecute(executeId)
  const algrxState = store.getState().executeState.algrxState!

  if (props.curPLang === PLang.Python && !props.executeState.loadedBrython) {
    loadBrython(() => {
      props.dispatchLoadedBrython()
      triggerExecute(algrxState, executeId, props)
    })
  } else triggerExecute(algrxState, executeId, props)
}

const Output: React.FC<StateProps & ExecuteDispatchProps> = props => {
  const loading = props.curPLang === PLang.Python
    && props.executeState.running
    && !props.executeState.loadedBrython
  const hasAlgrx = props.executeState.algrxState !== undefined

  return (
    <div className='output-container'>
      <PaneHeader title='OUTPUT' buttons={[]}/>
      <div className='output' ref={el => {
        if (el && !props.executeState.algrxState) props.dispatchAlgrx(initAlgrx(el))
        return el
      }}>
      </div>
      <div className='output-bar'>
        <div className={`output-btn ${loading ? 'output-btn-loading' : ''}`} onClick={() => {
          if (!loading && hasAlgrx) {
            if (!props.executeState.running) dispatchExecute(props)
            else if (props.executeState.paused) props.dispatchResume()
            else props.dispatchPause()
          }
        }}>
          <FontAwesomeIcon className='output-btn-icon'
            icon={loading ? faSpinner : props.executeState.running && !props.executeState.paused ? faPause : faPlay}
            spin={loading}/>
        </div>
        <div className='output-btn' onClick={event => {
          const target = event.currentTarget
          target.classList.add('output-btn-rotate')
          setTimeout(() => target.classList.remove('output-btn-rotate'), 500)

          if (!loading && hasAlgrx) dispatchExecute(props)
        }}>
          <FontAwesomeIcon className='output-btn-icon' icon={faSyncAlt}/>
        </div>
      </div>
    </div>
  )
}

export const OutputConnected = connect<StateProps, ExecuteDispatchProps, {}, RootState>(
  state => ({
    curPLang: state.pLang,
    getCode: () => {
      const aceState = state.editorState.aceState
      return aceState ? aceState.editor.getValue() : ''
    },
    executeState: state.executeState
  }),
  mapExecuteDispatchToProps
)(Output)
