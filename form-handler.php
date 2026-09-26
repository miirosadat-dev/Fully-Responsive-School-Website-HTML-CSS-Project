<?php
// ---------------------------------------------------------------------
// Contact form handler
// Hardened version: validates and sanitizes all input, and strips
// newline characters from any value used inside an email header to
// prevent header injection (e.g. via a crafted "email" or "subject"
// field).
// ---------------------------------------------------------------------

// Strip CR/LF so a malicious value can't inject extra mail headers.
function clean_header_value(string $value): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], "", $value));
}

$name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$visitor_email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Basic required-field validation.
if ($name === '' || $visitor_email === '' || $subject === '' || $message === '') {
    http_response_code(400);
    die('All fields are required.');
}

// Validate email format before it's ever used in a header.
if (!filter_var($visitor_email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die('Please provide a valid email address.');
}

// Reasonable length limits to avoid abuse.
$name    = mb_substr($name, 0, 100);
$subject = mb_substr($subject, 0, 150);
$message = mb_substr($message, 0, 5000);

// Neutralize header injection in every value that ends up in a header.
$name          = clean_header_value($name);
$visitor_email = clean_header_value($visitor_email);
$subject       = clean_header_value($subject);

$email_from = 'contact@miirosadat.com';

$email_subject = 'New Form Submission';

$email_body = "User Name: $name.\n" .
              "User Email: $visitor_email.\n" .
              "Subject: $subject.\n" .
              "User Message: $message.\n";

$to = 'miirosadat0@gmail.com';
$headers  = "From: $email_from\r\n";
$headers .= "Reply-To: $visitor_email\r\n";

mail($to, $email_subject, $email_body, $headers);

header("Location: contact.html");
exit;