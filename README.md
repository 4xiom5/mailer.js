# mailer.js
A powerfull tool for sending emails using templating

# Installation
```
$ npm install --save mustache-mail
```

# Usage
## Connection
```js
import { Mailer } from "mustache-mail";

// Accept the same options as nodemailer.createTransport, https://nodemailer.com/smtp/
const mailer = new Mailer({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'username',
        pass: 'password'
    }
});
```

## Send an email
```js
// Simple mail
mailer.sendMail({
    from: "'Fred Foo 👻' <foo@example.com>",
    to: "bar@example.com, baz@example.com",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>"
});
```

## Create a new template
```js
/**
 * Creates a template
 * @param name Name of the template
 * @param template Fields that are going to be compiled using Mustache template
 * @param defaults Object that is going to be merged into every message object, same as https://nodemailer.com/message/
 */
mailer.createTemplate("MyTemplate", {
    subject: "Hello {{username}}!",
    text: "Hey {{username}} !",
    html: "<b>Hey {{username}} !</b>"
},{
    from: "'Fred Foo' <foo@example.com>"
});
```

### Full options
```js
mailer.createTemplate("FullOptions", {
    // The subject of the e-mail
    subject?: string;
    // The plaintext version of the message
    text?: string | Buffer;
    // The path to the file containing the plaintext version of the message. If set, text will be overwritten
    textFile?: string;
    // The HTML version of the message
    html?: string | Buffer;
    // The path to the file containing the HTML version of the message. If set, html will be overwritten
    htmlFile?: string;
    // Apple Watch specific HTML version of the message, same usage as with text and html
    watchHtml?: string | Buffer;
    // The path to the file containing Apple Watch specific HTML version of the message, same usage as with text and html. If set, watchHtml will be overwritten
    watchHtmlFile?: string;
} ,{
    ...
});
```

## Send an email using a template
```js
mailer.sendMail({
    to: "bar@example.com",
    template: {
        name: "MyTemplate",
        context: {
            username: "Bar"
        }
    }
});
```