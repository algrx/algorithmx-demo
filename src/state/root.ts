import * as redux from 'redux'
import { Reducer, AnyAction, combineReducers } from 'redux'

import { PLang, pLangReducer } from './plang'
import { PopupState, initPopupState, popupReducer } from './popup'
import { EditorState, initEditorState, editorReducer } from '../components/editor'
import { ExecuteState, executeReducer, initExecuteState } from '../execute/state'
import { loadState } from './utils'

export interface RootState {
  readonly pLang: PLang
  readonly popupState: PopupState
  readonly editorState: EditorState
  readonly executeState: ExecuteState
}

export type InitStateFn = (pLang: PLang) => RootState

const initState: InitStateFn = pLang => ({
  pLang,
  popupState: initPopupState,
  editorState: initEditorState,
  executeState: initExecuteState(pLang)
})

const reducer: Reducer<RootState, AnyAction> = combineReducers({
  pLang: pLangReducer,
  popupState: popupReducer,
  editorState: editorReducer,
  executeState: executeReducer
})

export const createStore = () => redux.createStore(reducer, loadState(initState))
