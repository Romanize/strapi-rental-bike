module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '91fe6d6511a47e5b624ec158f58ef35b'),
  },
});
