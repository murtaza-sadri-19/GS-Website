const { AsyncLocalStorage } = require('async_hooks');

const requestContext = new AsyncLocalStorage();

function withRequestContext(req, res, next) {
  requestContext.run(
    {
      ipAddress: req.ip || null,
      userAgent: req.get('user-agent') || null,
    },
    next
  );
}

function getRequestContext() {
  return requestContext.getStore();
}

module.exports = { withRequestContext, getRequestContext };
