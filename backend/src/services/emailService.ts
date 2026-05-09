import nodemailer, { Transporter } from 'nodemailer';
import { emailConfig, validateEmailConfig } from '../config/email';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: Transporter | null = null;

  static initialize(): boolean {
    if (!validateEmailConfig()) {
      console.log('📧 Email service disabled - credentials not configured');
      return false;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: emailConfig.auth,
      });

      console.log('✅ Email service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      return false;
    }
  }

  static async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.log('📧 Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log('📧 Email service not available - skipping email');
      return false;
    }

    try {
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  static loadTemplate(templateName: string): string {
    const templatePath = path.join(
      __dirname,
      '../templates/emails',
      `${templateName}.hbs`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templateName}`);
    }

    return fs.readFileSync(templatePath, 'utf-8');
  }

  static compileTemplate(template: string, data: any): string {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(data);
  }

  static async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    data: any
  ): Promise<boolean> {
    try {
      const template = this.loadTemplate(templateName);
      const html = this.compileTemplate(template, data);

      return await this.sendEmail({
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('❌ Failed to send template email:', error);
      return false;
    }
  }
}

Handlebars.registerHelper('formatCurrency', function (amount: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
});

Handlebars.registerHelper('formatDate', function (date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

Handlebars.registerHelper('formatPercentage', function (value: number) {
  return value.toFixed(2) + '%';
});

Handlebars.registerHelper('eq', function (a: any, b: any) {
  return a === b;
});

Handlebars.registerHelper('gt', function (a: number, b: number) {
  return a > b;
});

Handlebars.registerHelper('lt', function (a: number, b: number) {
  return a < b;
});