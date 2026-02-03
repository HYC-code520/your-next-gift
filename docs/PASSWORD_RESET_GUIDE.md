# Password Reset Feature Guide

## Overview
This guide explains how the password reset feature works in the Your Next Gift application.

## User Flow

### 1. Forgot Password
1. User navigates to the login page (`/login`)
2. User clicks on "Forgot password?" link below the password field
3. User is redirected to `/forgot-password`
4. User enters their email address
5. User clicks "Send Reset Link"
6. User receives a success message and an email with a password reset link

### 2. Reset Password
1. User clicks the reset link in their email
2. User is redirected to `/reset-password` with a recovery token in the URL
3. The app automatically establishes a recovery session using the tokens from the URL
4. User enters their new password twice (for confirmation)
5. User clicks "Update Password"
6. Password is updated, recovery session is cleared, and user is redirected to login page

## Technical Implementation

### Components Created

1. **ForgotPassword.jsx** (`/frontend/src/components/ForgotPassword.jsx`)
   - Displays email input form
   - Sends password reset email via Supabase
   - Shows success/error messages

2. **ResetPassword.jsx** (`/frontend/src/components/ResetPassword.jsx`)
   - Extracts access_token and refresh_token from URL hash
   - Establishes recovery session using `supabase.auth.setSession()`
   - Displays new password form with confirmation
   - Updates user password via Supabase
   - Clears recovery session and redirects to login after successful reset

### AuthContext Updates

Added two new functions to `AuthContext.jsx`:

1. **resetPassword(email)**
   - Sends password reset email using `supabase.auth.resetPasswordForEmail()`
   - Includes redirect URL to `/reset-password`

2. **updatePassword(newPassword)**
   - Updates user password using `supabase.auth.updateUser()`
   - Called after user clicks reset link and enters new password

### Routes Added

In `routes.jsx`:
- `/forgot-password` - Forgot password page
- `/reset-password` - Reset password page (accessed via email link)

### Styling

Uses existing `Login.css` styles with additional:
- `.forgot-password-link` - Styles for the "Forgot password?" link on login page

## Supabase Configuration

### Email Templates (Optional Customization)

To customize the password reset email:

1. Go to Supabase Dashboard
2. Navigate to Authentication → Email Templates
3. Select "Reset Password" template
4. Customize the email content and styling
5. The default template includes a link with the recovery token

### Email Settings

Ensure email settings are configured in Supabase:
1. Go to Authentication → Settings
2. Verify SMTP settings or use Supabase's default email service
3. Set the site URL to your production domain (important for redirect URLs)

## Security Features

1. **Token Expiration**: Reset tokens expire after a set time (default: 1 hour)
2. **One-time Use**: Reset tokens can only be used once
3. **Password Validation**: 
   - Minimum 6 characters
   - Passwords must match confirmation
4. **Secure Redirect**: Reset link redirects to your application domain only

## Testing

### Local Testing
1. Make sure your `.env.local` has correct Supabase credentials
2. Test forgot password flow with a valid email
3. Check email inbox for reset link
4. Click link and verify redirect to `/reset-password`
5. Enter new password and confirm it works

### Common Issues

1. **Email not received**
   - Check spam folder
   - Verify email settings in Supabase dashboard
   - Check Supabase logs for email delivery status

2. **Invalid reset link**
   - Token may have expired (default: 1 hour)
   - Token may have already been used
   - Request a new reset link

3. **Redirect URL issues**
   - Verify site URL in Supabase settings matches your domain
   - Check that redirect URL in `resetPassword()` function is correct

4. **"Auth session missing" error**
   - This was fixed by properly handling the recovery tokens from the URL
   - The app now uses `supabase.auth.setSession()` to establish the recovery session
   - Make sure you're using the updated ResetPassword component

## User Experience Improvements

1. **Clear messaging**: Users receive immediate feedback on all actions
2. **Easy access**: "Forgot password?" link prominently displayed on login page
3. **Validation**: Real-time validation of password requirements
4. **Auto-redirect**: After successful reset, users are automatically redirected to login
5. **Back navigation**: Easy navigation back to login page from forgot password page

## Future Enhancements

Potential improvements:
- Add password strength indicator
- Show password requirements before submission
- Add rate limiting for reset requests
- Implement magic link authentication as alternative
- Add 2FA support
