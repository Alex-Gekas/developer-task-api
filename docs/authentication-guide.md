## Authentication guide

Before you can authenticate using the Task API, you need to log in. See the [API Reference](getting-started.md) for the steps on creating an account login.

## JWT and why it’s used

**JWT (JSON Web Token)** is a standard for encoding user information in a token. You can think of it like a wristband at an amusement park.

When you enter the park, the attendant takes your payment (login) and gives you a wristband (the token). The wristband proves you were verified. For the rest of the day, you show it to enter different areas of the park.

A JWT works the same way. It is a long string of characters that contains information about your user session. The API issues a JWT when you log in. The token stays valid for seven days.

The token payload is **base64 encoded**, not encrypted. Anyone can decode it and read the contents.

You can view the contents by pasting the token into the **JWT Debugger at [jwt.io](http://jwt.io)**. The debugger shows the payload, including:

- user ID
- email
- issued-at timestamp
- expiration timestamp

Because the payload is readable, it should never contain sensitive data. It stores only identifiers and session information. The payload can also help when troubleshooting authentication problems.

**How to include the token in requests**

Include the token in the Authorization header of every request in this format: `Authorization: Bearer <your_token>`. Most REST clients, including Postman, support this directly.

**Token expiry and invalid tokens**

If the token is invalid, you will receive a `401 InvalidToken` error. If the token is expired, you will receive a `401 TokenExpired` error. In both cases, you can log in again to generate a new one. There is no refresh mechanism in the Task API for expired tokens.

 **Security note:** never store tokens in plain text or expose them in client-side code.  

**Invalid credentials**

For requests that use the wrong email or password, you will receive `401 InvalidCredentials` error.Task API does not indicate which credential was incorrect. If this happens, check both and try again.