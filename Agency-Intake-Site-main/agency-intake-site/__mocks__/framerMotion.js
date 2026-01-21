module.exports = {
  motion: new Proxy(
    {},
    {
      get: () => (props) => {
        const { children, ...rest } = props || {}
        return Array.isArray(children) ? children : children || null
      }
    }
  )
}


