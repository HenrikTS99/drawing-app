// Export function so dotenv.config will be applied first.
export function getConfig() {
  return {
    port: process.env.PORT || 3001,
    mongoDBURL: process.env.MONGODB_URL,
  };
}
