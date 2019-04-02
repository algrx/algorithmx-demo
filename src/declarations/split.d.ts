interface SplitProps {
  readonly sizes?: [number, number]
  readonly direction?: 'horizontal' | 'vertical'
  readonly gutterSize?: number
}

declare module 'react-split' {
  const Split: React.FC<React.HTMLAttributes<unknown> | SplitProps>
  export default Split
}
