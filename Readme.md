# Authy - NodeJS, TypeScript Authentication Template
Authy is a simple template for user authentication in NodeJS using modern tooling such as TypeScript while being minimal and effective. Authy is designed with the [KISS principle](https://en.wikipedia.org/wiki/KISS_principle) intentionally keeping the code, requirements, etc. simple so that we don't accidentally introduce vulnerabilities or collect and store too much information about users. Authy is also designed to be a secure default using security techniques.

**Security Features**
- Modern Password Hashing via [argon2](https://github.com/ranisalt/node-argon2)
- Common Password List Lookup
- Rate Limiting
- Deep Email Validation (MX Records, SMTP Lookup, Disposable Check) via [deep-email-validator](https://github.com/mfbx9da4/deep-email-validator)
- Email verification with code

**Developer Features**
- MongoDB 
- TypeScript 
- Typed Requests on top of Express
- TypeScript Request Body Validation via DTO's
- Configurable Email Services

---

## Using Authy
1. Click the green ["Use this template" button](https://github.com/Cryptobyte-Team/Authy/generate) above!

**OR**

1. Install [Node, NPM](https://nodejs.dev)
2. Install [Yarn](https://yarnpkg.com)
3. Clone the project
   ```bash
   git clone https://github.com/Cryptobyte-Team/Authy.git
   ```
4. Install Dependencies
   ```bash
   cd Authy && yarn
   ```
5. Configure [`.env`](.env.template)
   ```bash
   # Create env from template
   cp .env.template .env

   # Edit the new .env file with your variables
   ```

---

## Contributing
As an authentication template, the work is never truly complete and requires consistent updates. We welcome any and all contributions from developers who want to add features, fix issues or create new components within the platform. We ask that all contributions follow some simple contribution guidelines so that we can ensure a smooth experience for everyone.

- Use a similar code style as what exists within the project
- Refactor your code to be clean, concise and easy to read
- Test any and all changes manually before submitting a pull request
- Use the feature branch workflow ie. create a branch for your work, work and then create a pull request for us to review
- All tests must pass in order for your pull request to be reviewed
- All pull requests must be approved before being merged

---

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