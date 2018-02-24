/// <reference types="node" />
/// <reference types="handlebars" />
/**
 * mailer.js
 * Copyright (c) 2018 Brice Theurillat
 */
import * as EventEmitter from "events";
import { SendMailOptions } from "nodemailer";
export interface TemplateOptions {
    subject?: string;
    text?: string | Buffer;
    textFile?: string;
    html?: string | Buffer;
    htmlFile?: string;
    watchHtml?: string | Buffer;
    watchHtmlFile?: string;
}
export interface TemplateCompiledOptions {
    [key: string]: HandlebarsTemplateDelegate;
}
export declare class MailTemplate extends EventEmitter {
    private static readonly FILE_FIELDS;
    private mailOptions;
    private asyncTasksPending;
    /**
     * Creates a mail template using the mustache templates language : http://mustache.github.io/
     * @param options Options of the template
     */
    constructor(options: TemplateOptions);
    /**
     * Computes the template using the given context
     * @param context Context used to compile the template
     */
    compute(context: any): SendMailOptions;
    /**
     * Checks if the template is ready to be used
     * @returns True if the template is ready to be used
    */
    isReady(): boolean;
}
