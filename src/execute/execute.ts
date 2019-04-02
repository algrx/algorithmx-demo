import { PLang } from '../state/plang'
import { AlgrXState, CanvasSelection, EventHandler, createEventHandler, createCanvasSelection } from './algorithmx'
import { executePython } from './python'
import { ensureExecuteId } from './utils'
/// <reference path="../declarations/babelstandalone.d.ts"/>
import * as Babel from '@babel/standalone'
/// <reference path="../declarations/jsnetworkx.d.ts"/>
import * as jsnx from 'jsnetworkx'

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

export const executeJS = (args: ExecuteArgs): void => {
  const newConsole = {
    ...console,
    log: (msg: unknown) => args.onOut(String(msg)),
    error: (msg: unknown) => args.onErr(String(msg))
  }
  try {
    const compiled = Babel.transform(args.code, { presets: ['es2015'] }).code
    const execFn = new Function('canvas', 'console', 'jsnx', compiled)
    execFn(args.canvas, newConsole, jsnx)
  } catch (err) {
    args.onErr(String(err))
  }
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
