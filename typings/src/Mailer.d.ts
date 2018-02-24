/**
 * mailer.js
 * Copyright (c) 2018 Brice Theurillat
 */
import { TemplateOptions } from "./MailTemplate";
import * as nodemailer from "nodemailer";
export interface SendMailOptions extends nodemailer.SendMailOptions {
    template?: {
        name: string;
        context: any;
    };
}
export declare class Mailer {
    private templates;
    private transporter;
    constructor(options: any);
    /**
     * Creates a template
     * @param name Name of the template
     * @param template Template
     */
    createTemplate(name: string, template: TemplateOptions, defaults: nodemailer.SendMailOptions): void;
    /**
     * Sends a mail
     * @param mailOptions Mail Options
     */
    sendMail(mailOptions: SendMailOptions): PromiseLike<nodemailer.SentMessageInfo>;
    private send(mailOptions, resolve, reject);
}
