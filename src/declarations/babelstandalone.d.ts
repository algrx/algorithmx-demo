declare module '@babel/standalone' {
    export function transform(code: string, data?: object): { readonly code: string };
}
