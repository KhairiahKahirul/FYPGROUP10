import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit {
  notificationForm: FormGroup;
  isLoading = false;
  selectedNotificationType = '';
  
  // Available notification types
  notificationTypes = [
    {
      type: 'payment_confirmed',
      title: 'Payment Confirmed',
      icon: 'checkmark-circle',
      color: 'success',
      description: 'Notify user that their payment has been confirmed'
    },
    {
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      icon: 'close-circle',
      color: 'danger',
      description: 'Notify user that their booking has been cancelled'
    },
    {
      type: 'ferry_delayed',
      title: 'Ferry Delayed',
      icon: 'time',
      color: 'warning',
      description: 'Notify user about ferry delays'
    },
    {
      type: 'schedule_delayed',
      title: 'Schedule Delayed',
      icon: 'calendar',
      color: 'warning',
      description: 'Notify user about schedule changes'
    }
  ];

  // Sample users for notification (in real app, fetch from API)
  users = [
    { id: 1, name: 'Ahmad bin Abdullah', email: 'ahmad@email.com', phone: '+673 1234 5678' },
    { id: 2, name: 'Siti binti Omar', email: 'siti@email.com', phone: '+673 2345 6789' },
    { id: 3, name: 'Mohammad bin Hassan', email: 'mohammad@email.com', phone: '+673 3456 7890' },
    { id: 4, name: 'Fatimah binti Ali', email: 'fatimah@email.com', phone: '+673 4567 8901' }
  ];

  // Recent notifications sent
  recentNotifications: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    this.notificationForm = this.formBuilder.group({
      notificationType: ['', Validators.required],
      recipients: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      sendEmail: [true],
      sendSMS: [false],
      sendPush: [true]
    });
  }

  ngOnInit() {
    this.loadRecentNotifications();
  }

  onNotificationTypeChange() {
    const selectedType = this.notificationTypes.find(type => type.type === this.selectedNotificationType);
    if (selectedType) {
      // Auto-fill subject and message based on type
      this.notificationForm.patchValue({
        subject: selectedType.title,
        message: this.getDefaultMessage(selectedType.type)
      });
    }
  }

  getDefaultMessage(type: string): string {
    switch (type) {
      case 'payment_confirmed':
        return 'Dear passenger, your payment for ferry ticket has been confirmed. Please arrive at the terminal 30 minutes before departure. Safe travels!';
      case 'booking_cancelled':
        return 'Dear passenger, your ferry booking has been cancelled. If you have any questions, please contact our customer service.';
      case 'ferry_delayed':
        return 'Dear passenger, your ferry has been delayed. We apologize for the inconvenience. Please check for updated departure times.';
      case 'schedule_delayed':
        return 'Dear passenger, there has been a schedule change for your ferry. Please check the updated departure time.';
      default:
        return '';
    }
  }

  async sendNotification() {
    if (this.notificationForm.valid) {
      this.isLoading = true;
      
      const formData = this.notificationForm.value;
      
      // Simulate sending notification
      setTimeout(async () => {
        try {
          // In real app, send to API
          const notification = {
            id: Date.now(),
            type: formData.notificationType,
            subject: formData.subject,
            message: formData.message,
            recipients: formData.recipients,
            channels: {
              email: formData.sendEmail,
              sms: formData.sendSMS,
              push: formData.sendPush
            },
            sentAt: new Date(),
            status: 'sent'
          };

          // Add to recent notifications
          this.recentNotifications.unshift(notification);
          
          // Show success message
          await this.showSuccessToast('Notification sent successfully!');
          
          // Reset form
          this.notificationForm.reset();
          this.notificationForm.patchValue({
            sendEmail: true,
            sendSMS: false,
            sendPush: true
          });
          this.selectedNotificationType = '';
          
        } catch (error) {
          await this.showErrorAlert('Failed to send notification. Please try again.');
        } finally {
          this.isLoading = false;
        }
      }, 2000);
    }
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async previewNotification() {
    if (this.notificationForm.valid) {
      const formData = this.notificationForm.value;
      const selectedType = this.notificationTypes.find(type => type.type === formData.notificationType);
      
      const alert = await this.alertController.create({
        header: 'Notification Preview',
        message: `
          <div style="text-align: left;">
            <p><strong>Type:</strong> ${selectedType?.title}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${formData.message}</p>
            <p><strong>Channels:</strong> ${formData.sendEmail ? 'Email ' : ''}${formData.sendSMS ? 'SMS ' : ''}${formData.sendPush ? 'Push Notification' : ''}</p>
          </div>
        `,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Send',
            handler: () => {
              this.sendNotification();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  loadRecentNotifications() {
    // Simulate loading recent notifications
    this.recentNotifications = [
      {
        id: 1,
        type: 'payment_confirmed',
        subject: 'Payment Confirmed',
        message: 'Payment confirmed for ferry ticket',
        recipients: 'Ahmad bin Abdullah',
        channels: { email: true, sms: false, push: true },
        sentAt: new Date(Date.now() - 3600000),
        status: 'sent'
      },
      {
        id: 2,
        type: 'ferry_delayed',
        subject: 'Ferry Delayed',
        message: 'Ferry F001 delayed by 30 minutes',
        recipients: 'Siti binti Omar',
        channels: { email: true, sms: true, push: true },
        sentAt: new Date(Date.now() - 7200000),
        status: 'sent'
      }
    ];
  }

  getNotificationTypeInfo(type: string) {
    return this.notificationTypes.find(t => t.type === type);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
} 