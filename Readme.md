## Authy - NodeJS, TypeScript Authentication Template
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
