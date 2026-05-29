// Shared API base: same-origin on Render; Vercel frontend uses Render API + images.
window.CHANCE_API_BASE = (function () {
  const { hostname, port } = window.location;

  if (hostname === 'chance-tau.vercel.app') {
    return 'https://chance-bc8t.onrender.com';
  }
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '5000') {
    return 'http://localhost:5000';
  }
  return '';
})();
