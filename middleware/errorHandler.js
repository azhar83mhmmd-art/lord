function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Terjadi kesalahan pada server. Coba lagi beberapa saat.'
  });
}

module.exports = errorHandler;
