<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4338ca, #6366f1); padding: 40px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 10px; }
        .content { padding: 40px; color: #374151; line-height: 1.6; }
        .greeting { font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #111827; }
        .otp-container { background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #4338ca; margin: 0; }
        .warning { font-size: 13px; color: #6b7280; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        .footer { padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Eventify</div>
            <div style="font-size: 14px; opacity: 0.9;">Password Reset Request</div>
        </div>
        <div class="content">
            <div class="greeting">Hi {{ $userName }},</div>
            <p>We received a request to reset your password for your Eventify account. Use the code below to proceed with the reset:</p>
            
            <div class="otp-container">
                <div class="otp-code">{{ $otp }}</div>
                <p style="font-size: 12px; color: #64748b; margin-top: 15px;">This code is valid for 10 minutes.</p>
            </div>

            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

            <div class="warning">
                <strong>Safety Tip:</strong> Never share this code with anyone. Eventify staff will never ask for your verification code or password.
            </div>
        </div>
        <div class="footer">
            &copy; 2026 Eventify. All rights reserved.
        </div>
    </div>
</body>
</html>
