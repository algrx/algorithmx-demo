import { PLang } from '../state/plang'
import { AlgrXState, CanvasSelection, EventHandler, createEventHandler, createCanvasSelection } from './algorithmx'
import { executeJS } from './javascript'
import { executePython } from './python'
import { ensureExecuteId } from './utils'

export interface InitExecuteArgs {
  readonly algrxState: AlgrXState
  readonly onUpdate: (algrxState: AlgrXState) => void
  readonly executeId: string
  readonly pLang: PLang
  readonly code: string
  readonly onOut: (msg: string) => void
  readonly onErr: (msg: string) => void
}

export interface ExecuteArgs {
  readonly code: string
  readonly canvas: CanvasSelection
  readonly client: EventHandler
  readonly executeId: string
  readonly onOut: (msg: string) => void
  readonly onErr: (msg: string) => void
}

export const execute = (args: InitExecuteArgs): void => {
  const client = createEventHandler(args.algrxState, args.executeId, args.onUpdate)
  const canvas = createCanvasSelection(client)

  const executeArgs: ExecuteArgs = {
    code: args.code,
    canvas,
    client,
    executeId: args.executeId,
    onOut: ensureExecuteId(args.executeId, args.onOut),
    onErr: ensureExecuteId(args.executeId, args.onErr)
  }
  if (args.pLang === PLang.JS) executeJS(executeArgs)
  else if (args.pLang === PLang.Python) executePython(executeArgs)
}

export const getPLangLogInfo = (pLang: PLang): string => {
  if (pLang === PLang.JS) {
    return 'Language: JavaScript ES6\n'
      + 'Available Packages: algorithmx, jsnetworkx'
  }
  if (pLang === PLang.Python) {
    return 'Language: Python 3 (Brython)\n'
      + 'Available Packages: algorithmx, networkx (minimal)'
  }
  return ''
}
