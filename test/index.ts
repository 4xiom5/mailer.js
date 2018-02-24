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
    subject: "Hello {{username}}!",
    text: "Hey {{username}} !",
    html: "<b>Hey {{username}} !</b>"
}, {
    from: "'Fred Foo 👻' <foo@example.com>"
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
    subject: "Hello {{username}}!",
    textFile: path.join(__dirname, "test.txt"),
    htmlFile: path.join(__dirname, "test.html")
}, {
        from: "'Fred Foo 👻' <foo@example.com>"
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