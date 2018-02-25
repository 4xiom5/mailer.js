import { Mailer } from "../src/index";

import * as path from "path";

const mailer = new Mailer({
    host: "localhost",
    port: 1025,
    tls: {
        rejectUnauthorized: false
    }
});

// Send a simple mail
mailer.sendMail({
    from: "'Fred Foo 👻' <foo@example.com>",
    to: "bar@example.com, baz@example.com",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>"
});

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

// Create template
mailer.createTemplate("test2", {
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
        name: "test2",
        context: {
            username: "Bar"
        }
    }
});

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