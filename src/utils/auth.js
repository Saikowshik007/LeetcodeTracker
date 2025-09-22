// Admin email addresses (should be set via environment variables)
const adminEmails = process.env.REACT_APP_ADMIN_EMAILS
  ? process.env.REACT_APP_ADMIN_EMAILS.split(',')
  : [];

// Function to check if a user is an admin
export const isAdmin = (email) => {
  return adminEmails.includes(email);
};