export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private static transporter;
    static initialize(): boolean;
    static verifyConnection(): Promise<boolean>;
    static sendEmail(options: EmailOptions): Promise<boolean>;
    private static stripHtml;
    static loadTemplate(templateName: string): string;
    static compileTemplate(template: string, data: any): string;
    static sendTemplateEmail(to: string, subject: string, templateName: string, data: any): Promise<boolean>;
}
//# sourceMappingURL=emailService.d.ts.map