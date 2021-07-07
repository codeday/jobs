module.exports = {
  serverRuntimeConfig: {
    gqlSecret: process.env.GQL_SECRET,
    appSecret: process.env.APP_SECRET,
    advisorsSecret: process.env.ADVISORS_SECRET,
    advisorsAudience: process.env.ADVISORS_AUDIENCE,
    advisorsAccessRole: process.env.ADVISORS_ACCESS_ROLE,
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN
    }
  },
};
