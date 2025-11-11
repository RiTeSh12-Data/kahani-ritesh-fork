# WhatsApp Message Delivery Troubleshooting

## Common Issues: Messages Not Received Despite API Success

If you see `messageId` in the logs but the recipient doesn't receive the message, here are the most common causes:

### 1. **24-Hour Window Restriction** ⚠️ (Most Common)

**Problem:** WhatsApp Business API only allows you to send messages to users who have messaged you first, within a 24-hour window.

**Solution:**
- The recipient must send a message to your WhatsApp Business number first
- After they message you, you have 24 hours to send them messages
- Outside this window, you can only send approved template messages

**How to test:**
1. Have the recipient send a message to your WhatsApp Business number
2. Then try sending the message again
3. Check if it's delivered

### 2. **Phone Number Format Issues**

**Problem:** Phone number might not be in the correct E.164 format.

**Current format:** The code normalizes to E.164 (e.g., `919723384957` for India)

**Check:**
- Phone number should be digits only, no `+` prefix
- For India: `91` + 10-digit number = 12 digits total
- For US: Country code + 10-digit number

**Verify in logs:**
- Check the `to` field in the logs to see the normalized number
- Ensure it matches the recipient's WhatsApp number

### 3. **WhatsApp Business Account Not Fully Set Up**

**Problem:** Your WhatsApp Business account might not be verified or approved.

**Check:**
1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Navigate to WhatsApp → API Setup
3. Verify:
   - Phone number is verified
   - Business account is approved
   - Access token is permanent (not temporary)

### 4. **Template Messages Not Approved (Production Mode)**

**Problem:** In production mode, the code uses template messages that must be pre-approved by Meta.

**Templates used:**
- `1c1_en` - Free trial confirmation
- `1s1_en` - Storyteller onboarding
- `2s1_en` - Readiness check
- `2s4_en` - Voice note acknowledgment
- `2c1_en` - Album completion

**Solution:**
- Ensure all templates are approved in Meta Business Manager
- Check template status in WhatsApp → Message Templates

### 5. **Development vs Production Mode**

**Current behavior:**
- **Development (`NODE_ENV=development`)**: Uses plain text messages
- **Production (`NODE_ENV=production`)**: Uses template messages

**Issue:** Plain text messages in development might be blocked if the recipient hasn't messaged first.

**Solution for testing:**
1. Set `NODE_ENV=production` and use approved templates, OR
2. Have the recipient message your business number first, then test

### 6. **Enhanced Logging**

The code now logs:
- Full API response (`fullResponse`)
- Message status (`status`)
- Any errors or warnings from WhatsApp API
- Detailed error codes and messages

**Check your logs for:**
- `fullResponse` - Shows complete API response
- `errors` - Any warnings from WhatsApp
- Error codes (see below)

### 7. **Common WhatsApp API Error Codes**

| Code | Meaning | Solution |
|------|---------|----------|
| 131047 | Message failed to send | Recipient hasn't messaged you first |
| 131026 | Invalid phone number | Check phone number format |
| 131031 | Template not found | Template not approved in Meta |
| 131051 | Rate limit exceeded | Wait and retry |
| 100 | Invalid parameter | Check request payload |

### 8. **Testing Steps**

1. **Check phone number format:**
   ```bash
   # In your logs, verify the normalized number
   # Should be: 919723384957 (for India)
   ```

2. **Have recipient message first:**
   - Ask the recipient to send any message to your WhatsApp Business number
   - Then try sending your message again

3. **Check webhook is set up:**
   - Verify webhook URL is configured in Meta Business Manager
   - Use ngrok for local testing: `npm run tunnel`
   - Update webhook URL: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`

4. **Verify credentials:**
   ```bash
   # Check these environment variables are set:
   WHATSAPP_PHONE_NUMBER_ID=...
   WHATSAPP_ACCESS_TOKEN=...
   WHATSAPP_BUSINESS_NUMBER_E164=919723384957
   ```

5. **Check message delivery status:**
   - Look for `status` field in logs
   - Check for any `errors` array in the response

### 9. **Quick Fix: Test with Recipient Messaging First**

The easiest way to test:
1. Have the recipient send a message to your WhatsApp Business number
2. This opens the 24-hour window
3. Then send your message - it should work

### 10. **For Production: Use Approved Templates**

For production, ensure:
- All message templates are approved in Meta Business Manager
- Templates match exactly (name, parameters, language)
- Business account is verified

## Debugging Commands

Check if ngrok is running:
```bash
npm run tunnel
```

Check server logs for detailed WhatsApp API responses:
```bash
# Look for:
# - "WhatsApp text message sent:" with fullResponse
# - "WhatsApp API Error Details:" for specific errors
# - "Failed to send WhatsApp" for failures
```

## Next Steps

1. Check the enhanced logs for `fullResponse` to see what WhatsApp API is returning
2. Verify the recipient has messaged your business number first
3. Check phone number format in logs
4. Verify WhatsApp Business account setup in Meta Business Manager

