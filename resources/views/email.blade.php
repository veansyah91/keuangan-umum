<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        /* Reset default styles */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 20px;
        }
        .main-message {
          text-align: justify;
        }
        .footer-message {
          gap: 5px;
        }
        .footer-message > p {
          text-align: justify;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .header, .content, .footer {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f3f5;">
        <tr>
            <td align="center">
                <div class="container">
                    <!-- Header -->
                    <div class="header">
                        <img src={{ env('APP_URL') . '/img/logo.png' }} alt="Logo Keuangan Umum" width="80">
                        <h2>{{ $subject }}</h2>
                    </div>

                    <!-- Content -->
                    <div class="content">                        
                        <div class="main-message">{{ $main_message }}</div>

                        @if(isset($action_url))
                        <p>
                            <a href="{{ $action_url }}" class="button">{{ $action_text }}</a>
                        </p>
                        @endif

                        <div class="footer-message">
                          @if(isset($action_url))
                            {{ $footer_message }}
                          @endif

                          <p>Keuangan Umum</p>
                        </div>                        
                        
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <p>&copy; {{ date('Y') }} Keuangan Umum. Semua hak dilindungi.</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>