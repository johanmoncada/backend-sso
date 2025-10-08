export default {
  secret: process.env.JWT_SECRET || 'defaultSecret',
  signOptions: {
    expiresIn: '120s',
  },
};
