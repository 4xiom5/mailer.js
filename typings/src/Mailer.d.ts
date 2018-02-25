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
     * @param template Fields that are going to be compiled using Mustache template
     * @param defaults Object that is going to be merged into every message object
     */
    createTemplate(name: string, template: TemplateOptions, defaults: nodemailer.SendMailOptions): void;
    /**
     * Sends a mail
     * @param mailOptions Mail Options
     */
    sendMail(mailOptions: SendMailOptions): PromiseLike<nodemailer.SentMessageInfo>;
    private send(mailOptions, resolve, reject);
}
