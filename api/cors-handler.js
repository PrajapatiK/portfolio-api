export default function handler(req, res) {
  const allowedOrigins = [process.env.WEBAPP_BASEURL];
  const origin = req.headers.origin;

  // Check if the request origin is in the allowed origins list
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else {
    res.status(403).json({ message: 'Not allowed by CORS' });
    return;
  }

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Normal API response
  res.status(200).json({ message: 'CORS settings applied successfully!' });
}
