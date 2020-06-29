# ReactMemory

React renderer which **works without DOM** and **does not render anything** anywhere

## Motivation

Since React components encapsulate logic nicely and compose seamlessly, it starts being a pain to write headless (DOM-less) runtimes without it. This renderer allows writing general application logic (Node.js apps, Electron main process) as React components with JSX used for composition.

## Example

```js
function App({ process }) {
  useEffect(() => {
    console.log('App started')
    return () => {
      console.log('App terminated')
    }
  }, [])

  return (
    <>
      <Server port={process.env['PORT']} />
    </>
  )
}

function Server({ port }) {
  useEffect(() => {
    const server = http.createServer()
    server.listen(port)
    console.log(`Server starting on port ${port}`)

    return () => {
      server.close()
      console.log('Server stopped')
    }
  }, [port])

  return null
}

ReactMemory.render(
  <App />,
  ReactMemory.createRoot()
)
```

## What Is Supported

- class and functional components
- fragments
- hooks
- mounting (the full lifecycle)
- rerendering of the root
- multiple root nodes

### What Is NOT Supported

Please report anything you encounter.

## License

MIT
