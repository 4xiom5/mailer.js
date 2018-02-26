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

## Send a mail
### Function overview
Same options as `nodemailer.sendMail`. See : https://nodemailer.com/message/
```js
mailer.sendMail(options);
```

### Example
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

## Create a template
### Function overview
```js
mailer.createTemplate(name, options);
```
### Options
```ts
{
        template?: {
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
        /**
         *  The path to the file containing Apple Watch specific HTML version of the message
         *  Same usage as with text and html. If set, watchHtml will be overwritten
         */
         watchHtmlFile?: string;
    },
    /** 
     * Object that is going to be merged into every message object
     * Same as https://nodemailer.com/message/
     */
    defaults?: SendMailOptions,
    /** 
     * Sort of subtemplate
     * Usages below
     */
    envs?: object
}
```
### Examples
#### Simple template
```js
// Create template
mailer.createTemplate("test", {
    template: {
        subject: "Hello {{username}}!",
        text: "Hey {{username}} !",
        html: "<b>Hey {{username}} !</b>"
    },
    defaults: {
        from: "'Fred Foo 👻' <foo@example.com>"
    }
});

// Send an email using the template
mailer.sendMail({
    to: "bar@example.com",
    template: {
        name: "test",
        context: {
            username: "Bar"
        }
    }
});
```

#### Using files
```js
// Create template
mailer.createTemplate("test", {
    template: {
        subject: "Hello {{username}}!",
        textFile: path.join(__dirname, "test.txt"),
        htmlFile: path.join(__dirname, "test.html")
    },
    defaults: {
        from: "'Fred Foo 👻' <foo@example.com>"
    }
});

// Send an email using a template
mailer.sendMail({
    to: "bar@example.com",
    template: {
        name: "test",
        context: {
            username: "Bar"
        }
    }
});
```
#### Using envs
```js
// Use envs
mailer.createTemplate("Envs", {
    envs: {
        fr: {
            bike: "J'ai un magnifique vélo {{color}} !"
        },
        en: {
            bike: "I have a beautiful {{color}} bike!"
        }
    },
    template: {
        subject: "{{bike}}",
        text: "{{bike}}",
        html: "<span style='color: {{color}}'>{{bike}}</span>"
    },
    defaults: {
        from: "'Fred Foo 👻' <foo@example.com>"
    }
});

// Send an email using a template with envs
mailer.sendMail({
    to: "bar@example.com",
    template: {
        name: "Envs",
        env: "en",
        context: {
            color: "red"
        }
    }
});
```
