# Authy - NodeJS, TypeScript Authentication Template
Authy is a simple template for user authentication in NodeJS using modern tooling such as TypeScript while being minimal and effective. Authy is designed with the [KISS principle](https://en.wikipedia.org/wiki/KISS_principle) intentionally keeping the code, requirements, etc. simple so that we don't accidentally introduce vulnerabilities or collect and store too much information about users. Authy is also designed to be a secure default using security techniques.

**Security Features**
- Modern Password Hashing via [argon2](https://github.com/ranisalt/node-argon2)
- Common Password List Lookup
- Rate Limiting
- Deep Email Validation (MX Records, SMTP Lookup, Disposable Check) via [deep-email-validator](https://github.com/mfbx9da4/deep-email-validator)

**Developer Features**
- MongoDB 
- TypeScript 
- Typed Requests on top of Express
- TypeScript Request Body Validation via DTO's

<br />

---

<br />

## REST API
This template is a REST API that can be built on to create systems that require user authentication. As a result the built in endpoints are fairly sparse and only cover what is required for the core template functionality. All endpoints are designed to recieve and respond with JSON data. Since the API is simple, we've included the API documentation here.
```json
POST /v1/user/signup
{
  "email": "some@email.com",
  "password": "somepassword"
}

// Response
{
  "token": "JWT TOKEN"
}
```

```json
POST /v1/user/signin
{
  "email": "some@email.com",
  "password": "somepassword"
}

// Response
{
  "token": "JWT TOKEN"
}
```