import { version as brythonVersion } from '../../brython/version.json'
import { ExecuteArgs } from './execute'

export const loadBrython = (onLoad: () => void): void => {
  const globalOnLoadId = '__brython_load__'
  /* tslint:disable */
  ;(window as any)[globalOnLoadId] = onLoad
  let el = document.createElement('script')
  el.type = 'text/javascript'
  el.src = `brython.${brythonVersion}.js`
  document.head.append(el)

  el.onload = () => {
  /* tslint:enable */
    brython({ indexedDB: true })
    const loadScript = `
from browser import window
from algorithmx import *
from networkx import *

window['${globalOnLoadId}']()
`
    __BRYTHON__.run_script(loadScript, 'load', 'main')
  }
}

type BrythonOutput = typeof __BRYTHON__['stdout']
const createOutput = (onOut: (msg: string) => void): BrythonOutput => ({
  write: onOut,
  flush: () => {/* */}
})

type WindowErrFn = typeof window.onerror
const originalWindowErrFn = window.onerror

const createWindowErrFn = (originalFn: WindowErrFn): WindowErrFn => {
  return (event, ...args: any[]) => {
    if (originalFn) originalFn(event, ...args)
  }
}

export const executePython = (args: ExecuteArgs): void => {
  const globalClientId = '__algorithmx_client__'
  const globalCodeId = '__algorithmx_code__'
  /* tslint:disable */
  ;(window as any)[globalClientId] = args.client
  ;(window as any)[globalCodeId] = args.code
  __BRYTHON__.stdout = createOutput(args.onOut)
  __BRYTHON__.stderr = createOutput(args.onErr)
  window.addEventListener('error', function (event) {
    const err = event.error
    if (err.args && err.args.__brython__) {
      const errStr = (err.__class__.$infos.__name__ + ':',
        err.args.length > 0 ? err.args[0] : '')
      args.onErr(errStr)
    }
  })
  /* tslint:enable */

  const fullScript = `
from browser import window
from algorithmx import canvas_selection

real_client = window['${globalClientId}']
code = window['${globalCodeId}']

class EventHandler:
    def dispatch(self, event):
        real_client.dispatch(event)

    def subscribe(self, fn):
        real_client.subscribe(fn)

event_handler = EventHandler()
canvas = canvas_selection('demo', event_handler)

exec(code, globals(), {'canvas': canvas})
`
  try {
    __BRYTHON__.run_script(fullScript, 'demo', 'main')
  } catch (err) {
    console.log(err)
  }
}
