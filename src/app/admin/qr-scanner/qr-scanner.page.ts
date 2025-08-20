import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
  standalone: false
})
export class QrScannerPage implements OnInit {
  isScanning = false;
  scannedData: any = null;
  scanHistory: any[] = [];
  
  // Sample boarding pass data structure
  sampleBoardingPasses = [
    {
      qrCode: 'BP001_AHMAD_20250820_0900_MUARA_LABUAN',
      passengerName: 'Ahmad bin Abdullah',
      bookingId: 'BK001',
      departureDate: '2025-08-20',
      departureTime: '09:00 AM',
      route: 'Muara - Labuan',
      seatNumber: 'A12',
      status: 'Confirmed'
    },
    {
      qrCode: 'BP002_SITI_20250820_1400_LABUAN_MUARA',
      passengerName: 'Siti binti Omar',
      bookingId: 'BK002',
      departureDate: '2025-08-20',
      departureTime: '02:00 PM',
      route: 'Labuan - Muara',
      seatNumber: 'B15',
      status: 'Confirmed'
    },
    {
      qrCode: 'BP003_MOHAMMAD_20250821_0800_MUARA_LABUAN',
      passengerName: 'Mohammad bin Hassan',
      bookingId: 'BK003',
      departureDate: '2025-08-21',
      departureTime: '08:00 AM',
      route: 'Muara - Labuan',
      seatNumber: 'C08',
      status: 'Confirmed'
    }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadScanHistory();
  }

  async startScan() {
    try {
      this.isScanning = true;
      
      // Simulate camera permission check
      await this.delay(1000);
      
      // Show scanning interface
      this.isScanning = true;
      
      // Simulate scanning process
      await this.delay(3000);
      
      // For demo purposes, automatically scan a random boarding pass
      const randomPass = this.sampleBoardingPasses[Math.floor(Math.random() * this.sampleBoardingPasses.length)];
      this.handleScannedData(randomPass.qrCode);
      
    } catch (error) {
      console.error('Scanner error:', error);
      await this.showErrorAlert('Failed to start scanner. Please try again.');
      this.isScanning = false;
    }
  }

  async stopScan() {
    this.isScanning = false;
  }

  private handleScannedData(qrContent: string) {
    // Parse QR code content
    const boardingPass = this.parseBoardingPassQR(qrContent);
    
    if (boardingPass) {
      this.scannedData = boardingPass;
      this.addToScanHistory(boardingPass);
      this.showBoardingPassDetails(boardingPass);
    } else {
      this.showInvalidQRAlert(qrContent);
    }
    
    this.stopScan();
  }

  private parseBoardingPassQR(qrContent: string): any {
    // Try to find exact match first
    let boardingPass = this.sampleBoardingPasses.find(bp => bp.qrCode === qrContent);
    
    if (boardingPass) {
      return boardingPass;
    }
    
    // If no exact match, try to parse the QR content format
    // Expected format: BP001_PASSENGERNAME_DATE_TIME_ROUTE
    const parts = qrContent.split('_');
    if (parts.length >= 5 && parts[0].startsWith('BP')) {
      return {
        qrCode: qrContent,
        passengerName: parts[1]?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown',
        bookingId: parts[0] || 'Unknown',
        departureDate: parts[2] || 'Unknown',
        departureTime: parts[3] || 'Unknown',
        route: parts[4] || 'Unknown',
        seatNumber: 'TBD',
        status: 'Scanned',
        isCustom: true
      };
    }
    
    return null;
  }

  private addToScanHistory(boardingPass: any) {
    const scanRecord = {
      ...boardingPass,
      scannedAt: new Date(),
      scanId: Date.now()
    };
    
    this.scanHistory.unshift(scanRecord);
    
    // Keep only last 50 scans
    if (this.scanHistory.length > 50) {
      this.scanHistory = this.scanHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('qrScanHistory', JSON.stringify(this.scanHistory));
  }

  private loadScanHistory() {
    const saved = localStorage.getItem('qrScanHistory');
    if (saved) {
      this.scanHistory = JSON.parse(saved);
    }
  }

  async showBoardingPassDetails(boardingPass: any) {
    const alert = await this.alertController.create({
      header: 'Boarding Pass Scanned',
      message: `
        <div style="text-align: left;">
          <p><strong>Passenger:</strong> ${boardingPass.passengerName}</p>
          <p><strong>Booking ID:</strong> ${boardingPass.bookingId}</p>
          <p><strong>Date:</strong> ${boardingPass.departureDate}</p>
          <p><strong>Time:</strong> ${boardingPass.departureTime}</p>
          <p><strong>Route:</strong> ${boardingPass.route}</p>
          <p><strong>Seat:</strong> ${boardingPass.seatNumber}</p>
          <p><strong>Status:</strong> ${boardingPass.status}</p>
        </div>
      `,
      buttons: [
        {
          text: 'Scan Another',
          handler: () => {
            setTimeout(() => this.startScan(), 500);
          }
        },
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async showInvalidQRAlert(qrContent: string) {
    const alert = await this.alertController.create({
      header: 'Invalid QR Code',
      message: `The scanned QR code "${qrContent}" is not a valid boarding pass. Please try again.`,
      buttons: [
        {
          text: 'Scan Again',
          handler: () => {
            setTimeout(() => this.startScan(), 500);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async clearScanHistory() {
    const alert = await this.alertController.create({
      header: 'Clear Scan History',
      message: 'Are you sure you want to clear all scan history?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear',
          handler: () => {
            this.scanHistory = [];
            localStorage.removeItem('qrScanHistory');
            this.showSuccessToast('Scan history cleared');
          }
        }
      ]
    });
    await alert.present();
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  // For testing purposes - simulate QR scan
  simulateScan() {
    const randomPass = this.sampleBoardingPasses[Math.floor(Math.random() * this.sampleBoardingPasses.length)];
    this.handleScannedData(randomPass.qrCode);
  }

  // Utility function for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Manual QR code input for testing
  async manualQRInput() {
    const alert = await this.alertController.create({
      header: 'Enter QR Code',
      message: 'Enter a QR code content to simulate scanning:',
      inputs: [
        {
          name: 'qrCode',
          type: 'text',
          placeholder: 'e.g., BP001_AHMAD_20250820_0900_MUARA_LABUAN'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Scan',
          handler: (data) => {
            if (data.qrCode && data.qrCode.trim()) {
              this.handleScannedData(data.qrCode.trim());
            }
          }
        }
      ]
    });
    await alert.present();
  }
} 