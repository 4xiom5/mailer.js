import { MailTemplate } from "./MailTemplate";

import { Promise } from "bluebird";
import * as nodemailer from "nodemailer";

interface TemplateObject {
    [key: string]: MailTemplate;
}

export class Mailer {
    private templates: TemplateObject = {};
    private transporter: nodemailer.Transporter;

    constructor(options: any) {
        this.transporter = nodemailer.createTransport(options);
    }

    /**
     * Add a template
     * @param name Name of the template
     * @param template Template
     */
    public addTemplate(name: string, template: MailTemplate) {
        this.templates[name] = template;
    }

    /**
     * Send a mail using a template
     * @param templateName Name of the template
     * @param to Recipient
     * @param context Context used to compute the template
     */
    public sendMail(templateName: string, to: string, context: any): Promise<nodemailer.SentMessageInfo> {
        return new Promise((resolve, reject) => {
            const template = this.templates[templateName];
            if (template === undefined) {
                reject(new Error("Wrong template name"));
            } else {
                const mailOptions = {
                    to,
                    ...template.compute(context)
                };

                this.transporter.sendMail(mailOptions, (err: Error | null, info: nodemailer.SentMessageInfo) => {
                    err ? reject(err) : resolve(info);
                });
            }
        }) as any;
    }
}
