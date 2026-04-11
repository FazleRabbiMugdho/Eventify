<!DOCTYPE html>
<html>
<head>
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: auto;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            color: #4A90E2;
            letter-spacing: 5px;
            margin: 20px 0;
            padding: 10px;
            background-color: #f0f8ff;
            border-radius: 5px;
            display: inline-block;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Hello {{ $userName }},</div>
        <p>Thank you for registering with Eventify! Please use the following 6-digit code to verify your account:</p>
        <div class="otp">{{ $otp }}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
            &copy; {{ date('Y') }} Eventify. All rights reserved.
        </div>
    </div>
</body>
</html>
