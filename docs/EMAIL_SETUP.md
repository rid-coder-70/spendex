# Email Setup Guide

## Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the prompts to enable it

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter: "SpendGuard"
5. Click "Generate"
6. Copy the 16-character password

### Step 3: Update Environment Variables
Edit your `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password

EMAIL_ENABLED=true
MONTHLY_REPORT_ENABLED=true
```

### Step 4: Test Email Configuration
```bash
npm run dev
```

Check console logs for:
✅ Email service initialized
✅ Email server connection verified

---

## Other Email Providers

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_mailgun_smtp_username
EMAIL_PASSWORD=your_mailgun_smtp_password
```

### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_ses_smtp_username
EMAIL_PASSWORD=your_ses_smtp_password
```

---

## Troubleshooting

### "Authentication failed"
- Verify app password is correct
- Ensure 2-Step Verification is enabled (Gmail)
- Check EMAIL_USER matches the account

### "Connection timeout"
- Check firewall settings
- Verify EMAIL_HOST and EMAIL_PORT
- Try EMAIL_SECURE=true with port 465

### "Email not received"
- Check spam folder
- Verify email address is correct
- Check email service logs in console

### Disable Email for Development
```env
EMAIL_ENABLED=false
MONTHLY_REPORT_ENABLED=false
```

---

## Cron Job Schedules

### Monthly Report Job
- **Schedule:** 1st of every month at 9:00 AM
- **Cron Pattern:** `0 9 1 * *`
- **Purpose:** Send monthly financial reports to all users

### Subscription Detection Job
- **Schedule:** Daily at 2:00 AM
- **Cron Pattern:** `0 2 * * *`
- **Purpose:** Detect new recurring subscriptions

---

## Testing Emails

### Send Test Report
```bash
curl -X POST http://localhost:5000/api/reports/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"month": 1, "year": 2025}'
```

### Trigger Monthly Job Manually
```bash
curl -X POST http://localhost:5000/api/reports/trigger-monthly-job \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"month": 1, "year": 2025}'
```