import { Action, Dispatch, AnyAction, Reducer } from 'redux'

export enum Popup {
  OpenProject = 'open_project'
}

export enum PopupActionType {
  Open = 'popup/open',
  Close = 'popup/close'
}

export interface PopupState {
  readonly isOpen: boolean
  readonly popup?: Popup
}

export interface ActionOpenPopup extends Action {
  readonly type: PopupActionType.Open
  readonly popup: Popup
}
export interface ActionClosePopup extends Action {
  readonly type: PopupActionType.Close
}

export interface OpenPopupProps {
  readonly dispatchOpenPopup: (popup: Popup) => void
}
export interface ClosePopupProps {
  readonly dispatchClosePopup: () => void
}

export const mapOpenPopupToProps = (dispatch: Dispatch<ActionOpenPopup>): OpenPopupProps => ({
  dispatchOpenPopup: popup => dispatch({ type: PopupActionType.Open, popup: popup })
})
export const mapClosePopupToProps = (dispatch: Dispatch<ActionClosePopup>): ClosePopupProps => ({
  dispatchClosePopup: () => dispatch({ type: PopupActionType.Close })
})

export const initPopupState: PopupState = {
  isOpen: false
}
export const popupReducer: Reducer<PopupState, AnyAction | ActionOpenPopup | ActionClosePopup> =
    (state = initPopupState, action) => {
  if (action.type === PopupActionType.Open) return { isOpen: true, popup: (action as ActionOpenPopup).popup }
  else if (action.type === PopupActionType.Close) return { isOpen: false }
  else return state
}
