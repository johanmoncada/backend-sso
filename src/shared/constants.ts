export const jwtConstants = {
  secret:
    process.env.JWT_SECRET ||
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
  expiresIn: process.env.JWT_EXPIRES_IN || '120s',
};

export const notificationConstants = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  mailersendApiKey: process.env.MAILERSEND_API_KEY || '',
  mailersendFrom: process.env.MAILERSEND_FROM || '',
  mailersendFromName: process.env.MAILERSEND_FROM_NAME || 'Your App',
};
