module.exports.registrationTemplate = (data) => {
    const { username, url } = data;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio App Registration</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 4px;
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            background-color: white;
            border: 2px solid black;
            border-color: #28a745;
            color: #28a745;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 16px;
        }
        .button:hover {
            background: #28a745;
            color: white;
        }    
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ${username}</h1>
        </div>
        <div class="content">
            <p>Hello ${username},</p>
            <p>Thank you for registering with us! We are excited to have you on board. Please click the button below to confirm your registration and complete the process:</p>
            <a href=${url} tabindex="1" class="button">Confirm Registration</a>
            <h4>Login URL: ${process.env.WEBAPP_BASEURL}/login</h4>
            <h4>Create your own profile: ${process.env.WEBAPP_BASEURL}/admin</h4>
            <p>If you didn't register for an account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Contact us: portfolioapp18@gmail.com</p>
            <p>Prayagraj, India</p>
        </div>
    </div>
</body>
</html>
`
} 