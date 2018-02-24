import * as EventEmitter from "events";
import * as fs from "fs";

import * as handlebars from "handlebars";
import { SendMailOptions } from "nodemailer";

export interface TemplateOptions {
    // The subject of the e-mail
    subject?: string;
    // The plaintext version of the message
    text?: string | Buffer;
    // The path to the file containing the plaintext version of the message. If set, text will be overwritten
    textFile?: string;
    // The HTML version of the message
    html?: string | Buffer;
    // The path to the file containing the HTML version of the message. If set, html will be overwritten
    htmlFile?: string;
    // Apple Watch specific HTML version of the message, same usage as with text and html
    watchHtml?: string | Buffer;
    // The path to the file containing Apple Watch specific HTML version of the message, same usage as with text and html. If set, watchHtml will be overwritten
    watchHtmlFile?: string;
    // Index signature
    [key: string]: string | Buffer | undefined;
}

export interface TemplateCompiledOptions {
    [key: string]: HandlebarsTemplateDelegate;
}

export class MailTemplate extends EventEmitter {
    private static readonly FILE_FIELDS = ["textFile", "htmlFile", "watchHtmlFile"];

    private mailOptions: TemplateCompiledOptions = {};
    private asyncTasksPending = 0;

    /**
     * Create a mail template using the mustache templates language : http://mustache.github.io/
     * @param options Options of the template
     */
    constructor(options: TemplateOptions) {
        super();
        this.emit("loading");
        for (const option in options) {
            // If option is a file, read it
            if (MailTemplate.FILE_FIELDS.indexOf(option) !== -1) {
                this.asyncTasksPending++;
                fs.readFile(options[option] as string, (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        // Slice to remove "File" suffix
                        (this.mailOptions as any)[option.slice(0, -4)] = handlebars.compile(data.toString());
                        // Emit event when all the files are loaded
                        this.asyncTasksPending--;
                        if (this.asyncTasksPending === 0) {
                            this.emit("ready");
                        }
                    }
                });
            } else {
                this.mailOptions[option] = handlebars.compile(options[option]);
            }
        }
        if (this.asyncTasksPending === 0) {
            this.emit("ready");
        }
    }

    /**
     * Compute the template using the given context
     * @param context Context used to compile the template
     */
    public compute(context: any): SendMailOptions {
        const options: TemplateOptions = {};
        for (const option in this.mailOptions) {
            options[option] = this.mailOptions[option](context);
        }
        return options;
    }
}