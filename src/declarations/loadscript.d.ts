interface LoadScriptOptions {
  readonly attrs: {
    readonly async?: boolean
    readonly onload?: () => void
    readonly onerror?: () => void
  }
}

declare module 'load-script' {
  export default function load (script: string,
    options: LoadScriptOptions,
    callback: (err: boolean, el: HTMLScriptElement) => void): void
}
