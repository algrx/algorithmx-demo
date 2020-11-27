# AlgorithmX Demo

![build](https://github.com/algrx/algorithmx-demo/workflows/build/badge.svg)

Online demo for <a href='https://github.com/algrx/algorithmx'>AlgorithmX</a>.

-   Executes JavaScript ES6 in the browser using <a
    href='https://babeljs.io/docs/en/next/babel-standalone.html'>Babel Standalone</a>,
    with <a href='https://github.com/fkling/JSNetworkX'>JS NetworkX</a> included.
-   Executes Python in the browser using <a
    href='https://github.com/brython-dev/brython'>Brython</a>, with <a
    href='https://github.com/networkx/networkx'>NetworkX</a> (minimal) included.

## Submitting Examples

To submit your own example, create a pull request which adds a file to
`src/examples/[language]`, and appends an entry to
`src/examples/[language]/examples.json`.

## Development

-   Serve the website on port 9000: `npm run dev`
-   Serve the production website on port 9000: `docker-compose up website`
-   Build Brython bundle: `docker-compose up --build build-python`
-   Build everything: `docker-compose up --build build`
