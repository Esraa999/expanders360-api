import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('Email transporter initialized');
    } else {
      this.logger.warn('Email configuration not found, using mock service');
    }
  }

  async sendMatchNotification(match: any): Promise<void> {
    try {
      const subject = `New Vendor Match Found - ${match.project.name}`;
      const html = `
        <h2>New Vendor Match Generated</h2>
        <p>A new vendor match has been found for your project:</p>
        
        <h3>Project Details:</h3>
        <ul>
          <li><strong>Project:</strong> ${match.project.name}</li>
          <li><strong>Country:</strong> ${match.project.country}</li>
          <li><strong>Budget:</strong> $${match.project.budget}</li>
        </ul>
        
        <h3>Matched Vendor:</h3>
        <ul>
          <li><strong>Vendor:</strong> ${match.vendor.name}</li>
          <li><strong>Rating:</strong> ${match.vendor.rating}/5</li>
          <li><strong>Response SLA:</strong> ${match.vendor.responseSlaHours} hours</li>
          <li><strong>Match Score:</strong> ${match.score}</li>
        </ul>
        
        <p>Contact the vendor at: ${match.vendor.contactEmail || 'Not provided'}</p>
        
        <p>Best regards,<br>Expanders360 Team</p>
      `;

      if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@expanders360.com',
          to: match.project.client?.contactEmail || 'admin@expanders360.com',
          subject,
          html,
        });
        this.logger.log(`Match notification sent for project ${match.project.id}`);
      } else {
        // Mock notification for development
        this.logger.log(`[MOCK EMAIL] ${subject}`);
        this.logger.log(`[MOCK EMAIL] To: ${match.project.client?.contactEmail || 'admin@expanders360.com'}`);
        this.logger.log(`[MOCK EMAIL] Match Score: ${match.score}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send match notification: ${error.message}`);
    }
  }

  async sendSlaWarning(vendor: any, projects: any[]): Promise<void> {
    try {
      const subject = `SLA Warning - Response Time Exceeded`;
      const projectList = projects.map(p => `- ${p.name} (${p.country})`).join('\n');
      
      const html = `
        <h2>SLA Warning Notification</h2>
        <p>The following vendor has exceeded their SLA response time:</p>
        
        <h3>Vendor Details:</h3>
        <ul>
          <li><strong>Vendor:</strong> ${vendor.name}</li>
          <li><strong>SLA:</strong> ${vendor.responseSlaHours} hours</li>
          <li><strong>Contact:</strong> ${vendor.contactEmail}</li>
        </ul>
        
        <h3>Affected Projects:</h3>
        <pre>${projectList}</pre>
        
        <p>Please follow up with the vendor to ensure timely responses.</p>
        
        <p>Best regards,<br>Expanders360 System</p>
      `;

      if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@expanders360.com',
          to: 'admin@expanders360.com',
          subject,
          html,
        });
        this.logger.log(`SLA warning sent for vendor ${vendor.id}`);
      } else {
        this.logger.log(`[MOCK EMAIL] ${subject}`);
        this.logger.log(`[MOCK EMAIL] Vendor: ${vendor.name}`);
        this.logger.log(`[MOCK EMAIL] Projects affected: ${projects.length}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send SLA warning: ${error.message}`);
    }
  }
}