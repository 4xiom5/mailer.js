import Mailer from "../src/index";

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

// Send a simple mail using a template
mailer.sendMail({
    to: "bar@example.com, baz@example.com",
    template: {
        name: "test",
        context: {
            username: "Bar"
        }
    }
});