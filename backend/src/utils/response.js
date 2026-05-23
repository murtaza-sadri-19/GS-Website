const success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message, detail = null, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message, error: detail });
};

module.exports = { success, error };
