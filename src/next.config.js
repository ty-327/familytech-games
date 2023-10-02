const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  reactStrictMode: false,
  env: {
    DOMAIN: "https://games.byufamilytech.org",
    SERVICE_ID: process.env.SERVICE_ID,
    EMAIL_TEMPLATE_ID: process.env.EMAIL_TEMPLATE_ID,
    PUBLIC_KEY_EMAIL: process.env.PUBLIC_KEY_EMAIL,
  },
  images: {
    domains: [
      "i.stack.imgur.com",
      "tree-portraits-pgp.familysearchcdn.org",
    ],
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    sw: "/service-worker.js",
  },
});

// The primary use case for environment variables
// is to limit the need to modify and re-release an
// application due to changes in configuration data
// (no need for source code alterations, testing, deployment).
// env variables change infrequently and they are immutable
