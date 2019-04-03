interface BrythonOutput {
  readonly write: (msg: string) => void
  readonly flush: () => void
}

interface Brython {
  readonly run_script: (src: string, name?: string, execNamespace?: string) => void
  readonly $getattr: (obj: {}, name: string) => unknown
  stdout: BrythonOutput
  stderr: BrythonOutput
}

interface BrythonOptions {
  readonly indexedDB?: boolean
  readonly debug?: number
}

declare const __BRYTHON__: Brython
declare const brython: (options?: BrythonOptions) => void
