"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_1 = require("../config/email");
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class EmailService {
    static initialize() {
        if (!(0, email_1.validateEmailConfig)()) {
            console.log('📧 Email service disabled - credentials not configured');
            return false;
        }
        try {
            this.transporter = nodemailer_1.default.createTransport({
                host: email_1.emailConfig.host,
                port: email_1.emailConfig.port,
                secure: email_1.emailConfig.secure,
                auth: email_1.emailConfig.auth,
            });
            console.log('✅ Email service initialized');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to initialize email service:', error);
            return false;
        }
    }
    static async verifyConnection() {
        if (!this.transporter) {
            console.log('📧 Email transporter not initialized');
            return false;
        }
        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
            return true;
        }
        catch (error) {
            console.error('❌ Email server connection failed:', error);
            return false;
        }
    }
    static async sendEmail(options) {
        if (!this.transporter) {
            console.log('📧 Email service not available - skipping email');
            return false;
        }
        try {
            const mailOptions = {
                from: `${email_1.emailConfig.from.name} <${email_1.emailConfig.from.email}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.stripHtml(options.html),
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent: ${info.messageId}`);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to send email:', error);
            return false;
        }
    }
    static stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    static loadTemplate(templateName) {
        const templatePath = path_1.default.join(__dirname, '../templates/emails', `${templateName}.hbs`);
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error(`Email template not found: ${templateName}`);
        }
        return fs_1.default.readFileSync(templatePath, 'utf-8');
    }
    static compileTemplate(template, data) {
        const compiledTemplate = handlebars_1.default.compile(template);
        return compiledTemplate(data);
    }
    static async sendTemplateEmail(to, subject, templateName, data) {
        try {
            const template = this.loadTemplate(templateName);
            const html = this.compileTemplate(template, data);
            return await this.sendEmail({
                to,
                subject,
                html,
            });
        }
        catch (error) {
            console.error('❌ Failed to send template email:', error);
            return false;
        }
    }
}
exports.EmailService = EmailService;
EmailService.transporter = null;
handlebars_1.default.registerHelper('formatCurrency', function (amount) {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
    }).format(amount);
});
handlebars_1.default.registerHelper('formatDate', function (date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
handlebars_1.default.registerHelper('formatPercentage', function (value) {
    return value.toFixed(2) + '%';
});
handlebars_1.default.registerHelper('eq', function (a, b) {
    return a === b;
});
handlebars_1.default.registerHelper('gt', function (a, b) {
    return a > b;
});
handlebars_1.default.registerHelper('lt', function (a, b) {
    return a < b;
});
//# sourceMappingURL=emailService.js.map