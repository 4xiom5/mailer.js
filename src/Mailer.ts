import { MailTemplate, TemplateOptions } from "./MailTemplate";

import * as Bluebird from "bluebird";
import * as nodemailer from "nodemailer";

interface TemplateObject {
    [key: string]: {
        defaults: nodemailer.SendMailOptions,
        template: MailTemplate
    };
}

export class Mailer {
    private templates: TemplateObject = {};
    private transporter: nodemailer.Transporter;

    constructor(options: any) {
        this.transporter = nodemailer.createTransport(options);
    }

    /**
     * Creates a template
     * @param name Name of the template
     * @param template Template
     */
    public createTemplate(name: string, template: TemplateOptions, defaults: nodemailer.SendMailOptions) {
        this.templates[name] = {
            template: new MailTemplate(template),
            defaults
        };
    }

    /**
     * Sends a mail 
     * @param mailOptions Mail Options
     */
    public sendMail(mailOptions: nodemailer.SendMailOptions): PromiseLike<nodemailer.SentMessageInfo>;

    /**
     * Sends a mail using a template
     * @param mailOptions Mail Options
     * @param templateName Name of the template
     * @param context Context used to compute the template
     */
    public sendMail(mailOptions: nodemailer.SendMailOptions, templateName?: string, context?: any): PromiseLike<nodemailer.SentMessageInfo> {
        return new Bluebird<nodemailer.SentMessageInfo>((resolve: Function, reject: Function) => {
            let options = {
                ...mailOptions
            }; 
            if (templateName) {
                const template = this.templates[templateName];
                if (template === undefined) {
                    reject(new Error("Wrong template name"));
                    return;
                } else {
                    if (template.template.isReady()) {
                        mailOptions = {
                            ...template.defaults,
                            ...template.template.compute(context),
                            ...mailOptions
                        };
                    } else {
                        template.template.once("ready", () => {
                            mailOptions = {
                                ...template.defaults,
                                ...template.template.compute(context),
                                ...mailOptions
                            };
                        });
                    }
                }
            }
            this.transporter.sendMail(mailOptions, (err: Error | null, info: nodemailer.SentMessageInfo) => {
                err ? reject(err) : resolve(info);
            });
        });
    }
}
