import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCode } from '@fortawesome/free-solid-svg-icons'

import { PLang, PLangName, PLangID } from '../state/plang'
import { ClosePopupProps, mapClosePopupToProps } from '../state/popup'
import { PopupConnected } from './popup'
import { RootState } from '../state/root'
import './openproject.scss'

import pyExamplesJson from '../examples/python/examples.json'
import jsExamplesJson from '../examples/javascript/examples.json'

interface ProjectMetadata {
  readonly file: string
  readonly name: string
  readonly author: {
    readonly name: string
    readonly url: string
  }
}
type ProjectStore = {
  readonly [p in PLang]: {
    readonly files: {
      readonly [k: string]: {
        readonly code: string
        readonly metadata: ProjectMetadata
      }
    }
    readonly order: ReadonlyArray<string>
  }
}

const loadExamples = <P extends PLang>(pLang: P, metadata: ReadonlyArray<ProjectMetadata>): ProjectStore[P] => {
  return {
    files: metadata.reduce((result, m) => ({...result,
      [m.file]: {
        code: require(`../examples/${PLangID[pLang]}/${m.file}`).default as string,
        metadata: m
      }
    }), {} as ProjectStore[P]['files']),
    order: metadata.map(m => m.file)
  }
}

export const projectStore: ProjectStore = {
  [PLang.JS]: loadExamples(PLang.JS, jsExamplesJson),
  [PLang.Python]: loadExamples(PLang.Python, pyExamplesJson)
}

export const defaultProjectFiles: { readonly [k in PLang]: string } = {
  [PLang.JS]: 'dfs.js',
  [PLang.Python]: 'dfs.py'
}

export enum ProjectActionType {
  Open = 'project/open'
}
export interface ActionOpenProject extends Action {
  readonly type: ProjectActionType.Open
  readonly pLang: PLang
  readonly file: string
}

interface StateProps {
  readonly curPLang: PLang
}
interface DispatchProps extends ClosePopupProps {
  readonly dispatchOpenProject: (pLang: PLang, file: string) => void
}

const OpenProject: React.FC<StateProps & DispatchProps> = props => {
  return (
    <PopupConnected title={`${PLangName[props.curPLang]} Examples`}>
      <div className='openproject scrollbar-y'>
        <div className='openproject-inner'>
          {projectStore[props.curPLang].order.map(file => {
            const example = projectStore[props.curPLang].files[file]
            return (
              <div key={file} className='openproject-project' onClick={() => {
                props.dispatchOpenProject(props.curPLang, file)
                props.dispatchClosePopup()
              }}>
                <FontAwesomeIcon className='openproject-project-icon' icon={faFileCode}/>
                <div>
                  <div className='openproject-project-title'>
                    {example.metadata.name}
                  </div>
                  <a className='openproject-project-subtitle' href={example.metadata.author.url}
                    target='_blank' onClick={event => { event.stopPropagation() }}>
                  {`By ${example.metadata.author.name}`}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PopupConnected>
  )
}

export const OpenProjectConnected = connect<StateProps, DispatchProps, {}, RootState>(
  root => ({ curPLang: root.pLang }),
  dispatch => ({
    ...mapClosePopupToProps(dispatch),
    dispatchOpenProject: (pLang, file) => dispatch<ActionOpenProject>({ type: ProjectActionType.Open, pLang, file })
  })
)(OpenProject)
