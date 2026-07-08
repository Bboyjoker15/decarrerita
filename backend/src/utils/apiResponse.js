function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ ok: true, data });
}

function error(res, message, statusCode = 400) {
  return res.status(statusCode).json({ ok: false, error: message });
}

function paginated(res, data, total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    ok: true,
    data,
    total,
    page,
    limit,
    totalPages,
  });
}

module.exports = { success, error, paginated };
