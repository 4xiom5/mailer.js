/**
 * mailer.js
 * Copyright (c) 2018 Brice Theurillat
 */

import { MailTemplate, TemplateOptions } from "./MailTemplate";

import * as Bluebird from "bluebird";
import * as nodemailer from "nodemailer";

interface TemplateObject {
    [key: string]: {
        defaults: nodemailer.SendMailOptions,
        template: MailTemplate
    };
}

export interface SendMailOptions extends nodemailer.SendMailOptions {
    template?: {
        name: string,
        context: any
    }
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
    public sendMail(mailOptions: SendMailOptions): PromiseLike<nodemailer.SentMessageInfo> {
        return new Bluebird<nodemailer.SentMessageInfo>((resolve: Function, reject: Function) => {
            if (mailOptions.template) {
                const template = this.templates[mailOptions.template.name];
                if (template === undefined) {
                    reject(new Error("Wrong template name"));
                    return;
                } else {
                    if (template.template.isReady()) {
                        this.send({
                            ...template.defaults,
                            ...template.template.compute((mailOptions.template as any).context),
                            ...mailOptions as nodemailer.SendMailOptions
                        }, resolve, reject);
                    } else {
                        template.template.once("ready", () => {
                            this.send({
                                ...template.defaults,
                                ...template.template.compute((mailOptions.template as any).context),
                                ...mailOptions as nodemailer.SendMailOptions
                            }, resolve, reject);
                        });
                    }
                }
            } else {
                this.send(mailOptions, resolve, reject);
            }
        });
    }

    private send(mailOptions: nodemailer.SendMailOptions, resolve: Function, reject: Function): void {
        this.transporter.sendMail(mailOptions, (err: Error | null, info: nodemailer.SentMessageInfo) => {
            err ? reject(err) : resolve(info);
        });
    }
}