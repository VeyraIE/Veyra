export function authErrorMessage(error: unknown) {
  const issue = error as { code?: string; message?: string; name?: string }
  if (issue?.code === 'over_email_send_rate_limit') return 'The account service has reached its email limit. Please wait before trying again; contact hello@veyra.ie if this continues.'
  if (issue?.code === 'signup_disabled') return 'New account registration is disabled by the account service. Please contact hello@veyra.ie.'
  if (issue?.code === 'provider_disabled' || issue?.code === 'oauth_provider_not_supported') return 'This sign-in method has not been enabled. Please use email instead.'
  if (issue?.code === 'email_not_confirmed') return 'Please verify your email using the link in your inbox before signing in.'
  if (issue?.code === 'invalid_credentials') return 'The email or password is incorrect.'
  if (/fetch|network|abort|timeout|timed out/i.test((issue?.name ?? '') + ' ' + (issue?.message ?? ''))) return 'We could not reach the account service. Please check your inbox before retrying signup, or contact hello@veyra.ie.'
  return issue?.message?.slice(0, 300) || 'We could not complete this request. Please try again.'
}
