const setup = (router, routes) => {
  routes.forEach(route => {
    Object.entries(route).forEach(([endpoint, endpointDef]) => {
      const {
        method,
        fn
      } = endpointDef
      const {middlewares = []} = endpointDef

      router[method](endpoint.replace(/[$]*/g, ''), ...middlewares, fn)
    })
  })

  return router
}

export default setup
