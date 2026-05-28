// Shared API base: same-origin on Vercel; localhost:5000 when frontend runs elsewhere locally.
window.CHANCE_API_BASE = (function () {
  const { hostname, port } = window.location;
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '5000') {
    return 'http://localhost:5000';
  }
  return '';
})();
