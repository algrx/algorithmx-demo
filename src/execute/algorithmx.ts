import * as AlgrX from 'algorithmx'
import { store } from '../index'
import { ensureExecuteId } from './utils'

export type SubscribeFn = (event: AlgrX.ReceiveEvent) => void

export interface AlgrXState {
  readonly client: AlgrX.Client
  readonly canvas: AlgrX.CanvasSelection
  readonly subscriptions: ReadonlyArray<SubscribeFn>
  readonly element: HTMLElement
}

export const initAlgrx = (el: HTMLElement): AlgrXState => {
  const client = AlgrX.client(el)
  const canvas = client.canvas()

  client.subscribe(event => {
    const executeState = store.getState().executeState
    if (executeState.algrxState) {
      const subscriptions = executeState.algrxState.subscriptions
      subscriptions.forEach(fn => fn(event))
    }
  })

  return { element: el, client, canvas, subscriptions: [] }
}

export const createEventHandler = (
    algrxState: AlgrXState,
    executeId: string,
    onUpdate: (algrxState: AlgrXState) => void): AlgrX.EventHandler => ({

  dispatch: ensureExecuteId<AlgrX.EventHandler['dispatch']>(executeId, event => {
    algrxState.client.dispatch(event)
  }),
  subscribe: ensureExecuteId<AlgrX.EventHandler['subscribe']>(executeId, fn => {
    onUpdate({...algrxState, subscriptions: [...algrxState.subscriptions, fn] })
  })
})

export const createCanvasSelection = (eventHandler: AlgrX.EventHandler): AlgrX.CanvasSelection => {
  return AlgrX.canvasSelection('demo', eventHandler)
}

export const resizeCanvas = (algrxState: AlgrXState): AlgrXState => {
  const size = algrxState.element.getBoundingClientRect()
  algrxState.canvas.duration(0).eventQ(null).size([size.width, size.height])
  return algrxState
}

export const clearCanvas = (algrxState: AlgrXState): AlgrXState => {
  const canvas = algrxState.canvas
  canvas.duration(0).eventQ(null).remove().cancelall().startall()
  return resizeCanvas(algrxState)
}
export const resetAlgrx = (algrxState: AlgrXState): AlgrXState => {
  return {...clearCanvas(algrxState), subscriptions: [] }
}

export const pauseCanvas = (algrxState: AlgrXState): AlgrXState => {
  algrxState.canvas.eventQ(null).stopall()
  return algrxState
}
export const resumeCanvas = (algrxState: AlgrXState): AlgrXState => {
  algrxState.canvas.eventQ(null).startall()
  return algrxState
}

export type CanvasSelection = AlgrX.CanvasSelection
export type EventHandler = AlgrX.EventHandler
