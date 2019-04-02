import { Action, Dispatch, AnyAction, Reducer } from 'redux'
import { AppActionType } from '../components/app'

export enum PLang {
  JS = 'javascript',
  Python = 'python'
}
export const PLangName: { readonly [k in PLang]: string } = {
  [PLang.JS]: 'JavaScript',
  [PLang.Python]: 'Python'
}
export const PLangID: { readonly [k in PLang]: string } = {
  [PLang.JS]: 'javascript',
  [PLang.Python]: 'python'
}

export interface ActionChangePLang extends Action {
  readonly type: AppActionType.ChangePLang
  readonly newPLang: PLang
}

export interface ChangePLangProps {
  readonly dispatchChangePLang: (newPLang: PLang) => void
}

export const mapChangePLangToProps = (dispatch: Dispatch<ActionChangePLang>): ChangePLangProps => ({
  dispatchChangePLang: newPLang => dispatch({ type: AppActionType.ChangePLang, newPLang: newPLang })
})

export const pLangReducer: Reducer<PLang, AnyAction> = (state = PLang.JS, action) => {
  if (action.type === AppActionType.ChangePLang) return (action as ActionChangePLang).newPLang
  else return state
}
