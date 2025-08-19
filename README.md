# Brunei Ferry Ticket Booking Admin System

A comprehensive admin dashboard for managing Muara to Labuan ferry ticket bookings built with Ionic Angular.

## Features

### 🚢 Admin Dashboard
- **Overview Statistics**: Total bookings, revenue, pending bookings, and more
- **Quick Navigation**: Easy access to all management sections
- **Recent Bookings**: View latest Muara to Labuan ferry ticket bookings
- **Responsive Design**: Works on desktop and mobile devices

### 🔐 Admin Authentication
- Secure login system
- Session management
- Demo credentials included for testing

### 📋 Booking Management
- View all Muara to Labuan ferry ticket bookings
- Search and filter bookings by status, route, and passenger details
- Update booking status (Confirm, Cancel, Complete)
- Manage payment status

### 👥 User Management
- Customer account management
- View user statistics and booking history
- Update user status (Active, Inactive, Suspended)

### 🚢 Ferry Management
- Manage Muara to Labuan ferry schedules and routes
- Monitor seat availability and occupancy
- Update ferry status (Active, Maintenance, Cancelled)
- Route performance tracking

### 📊 Reports & Analytics
- Revenue analytics and trends (BND currency)
- Route performance metrics for Muara-Labuan routes
- Occupancy statistics
- Booking patterns

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI
- Ionic CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MyFYP
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Accessing the Admin Panel

1. From the home page, click the "Admin" button in the header or the "Access Admin Dashboard" button
2. Use the demo credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You'll be redirected to the admin dashboard

## Demo Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
src/app/
├── admin/                          # Admin module
│   ├── admin.module.ts            # Admin module configuration
│   ├── admin-routing.module.ts    # Admin routing
│   ├── admin-dashboard/           # Main dashboard
│   ├── admin-login/               # Login page
│   ├── booking-management/        # Booking management
│   ├── user-management/           # User management
│   ├── ferry-management/          # Ferry management
│   └── reports/                   # Reports and analytics
├── home/                          # Home page
└── app.module.ts                  # Main app module
```

## Key Technologies

- **Frontend**: Ionic Angular
- **UI Components**: Ionic Framework
- **Styling**: SCSS with CSS Grid and Flexbox
- **State Management**: Angular Services
- **Routing**: Angular Router

## Features in Detail

### Dashboard Overview
- Real-time statistics display
- Interactive navigation cards
- Recent bookings list
- Quick action buttons

### Booking Management
- Advanced search and filtering
- Status management workflow
- Payment tracking
- Passenger information display

### User Management
- Customer profile management
- Activity tracking
- Account status control
- Booking history

### Ferry Management
- Schedule management
- Capacity monitoring
- Route optimization
- Maintenance scheduling

### Reports & Analytics
- Revenue tracking
- Performance metrics
- Trend analysis
- Data visualization

## Responsive Design

The admin system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## Customization

### Adding New Routes
1. Update the routes array in the relevant component
2. Add new route options to the filter dropdowns
3. Update the data models if needed

### Adding New Status Types
1. Update the status arrays in components
2. Add new status colors in the `getStatusColor()` methods
3. Update the UI to handle new statuses

### Styling Changes
- Modify the SCSS files in each component
- Use CSS custom properties for consistent theming
- Follow the existing design patterns

## Future Enhancements

- Real-time notifications
- Email integration
- Advanced analytics dashboard
- Mobile app companion
- API integration with backend services
- Payment gateway integration
- Customer support system

## Support

For questions or issues, please refer to the project documentation or contact the development team.

## License

This project is part of a Final Year Project (FYP) for educational purposes. 