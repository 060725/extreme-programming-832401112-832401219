// Backend base URL.
// - Local development (file:// or localhost): http://localhost:8888
// - Deployed to a cloud server: automatically use the same host with port 8888,
//   e.g. http://<your-server-ip>:8888
// Change this manually if your backend runs on another domain/port.
const API_BASE =
    (location.protocol === 'file:' ||
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1')
        ? 'http://localhost:8888'
        : `http://${location.hostname}:8888`;
