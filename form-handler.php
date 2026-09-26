<?php
// Simple contact/newsletter form handler for a showcase site.
// Just the basics: check the required fields aren't empty, send the
// email, and redirect back with a status flag so the page can show a
// thank-you message.

$name          = isset($_POST['name']) ? trim($_POST['name']) : '';
$visitor_email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject       = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message       = isset($_POST['message']) ? trim($_POST['message']) : '';
$redirect      = isset($_POST['redirect']) ? $_POST['redirect'] : 'contact.html';

if ($name === '' || $visitor_email === '' || $subject === '' || $message === '') {
    header("Location: $redirect?status=error");
    exit;
}

$email_from    = 'contact@miirosadat.com';
$email_subject = 'New Form Submission: ' . $subject;
$email_body    = "User Name: $name.\n" .
                  "User Email: $visitor_email.\n" .
                  "Subject: $subject.\n" .
                  "User Message: $message.\n";

$to = 'miirosadat0@gmail.com';
$headers  = "From: $email_from\r\n";
$headers .= "Reply-To: $visitor_email\r\n";

mail($to, $email_subject, $email_body, $headers);

header("Location: $redirect?status=success");
exit;