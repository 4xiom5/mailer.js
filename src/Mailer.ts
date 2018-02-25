/**
 * mustache-mail
 * Copyright (c) 2018 Brice Theurillat
 */

import { MailTemplate, TemplateOptions } from "./MailTemplate";

import * as Bluebird from "bluebird";
import * as nodemailer from "nodemailer";

interface TemplateObject {
    [key: string]: MailTemplate;
}

export interface SendMailOptions extends nodemailer.SendMailOptions {
    template?: {
        name: string,
        env?: string,
        context: any
    }
}

export class Mailer {
    private templates: TemplateObject = {};
    private transporter: nodemailer.Transporter;

    constructor(options: any, defaults?: any) {
        this.transporter = nodemailer.createTransport(options, defaults);
    }

    /**
     * Creates a template
     * @param name Name of the template
     * @param template Fields that are going to be compiled using Mustache template
     * @param defaults Object that is going to be merged into every message object
     */
    public createTemplate(name: string, template: TemplateOptions) {
        this.templates[name] = new MailTemplate(template);
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
                    if (template.isReady()) {
                        this.send({
                            ...template.compute(mailOptions.template.context, mailOptions.template.env),
                            ...mailOptions as nodemailer.SendMailOptions
                        }, resolve, reject);
                    } else {
                        template.once("ready", () => {
                            // Duplicated condition to avoid Typescript errors
                            if (mailOptions.template){
                                this.send({
                                    ...template.compute(mailOptions.template.context, mailOptions.template.env),
                                    ...mailOptions as nodemailer.SendMailOptions
                                }, resolve, reject);
                            }
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