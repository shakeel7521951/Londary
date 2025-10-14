# Twilio WhatsApp Setup Guide

## Prerequisites

1. Create a Twilio account at https://www.twilio.com/
2. Get your Account SID and Auth Token from the Twilio Console

## WhatsApp Sandbox Setup

### Step 1: Access WhatsApp Sandbox

1. Go to Twilio Console > Messaging > Try it out > Send a WhatsApp message
2. You'll see your sandbox number (usually +1 415 523 8886)

### Step 2: Join Sandbox (For Testing)

1. Send a WhatsApp message from your phone to the sandbox number
2. Include the code shown in the console (e.g., "join <your-code>")
3. You'll receive a confirmation message

### Step 3: Environment Variables

Add these to your `.env` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

## API Endpoints

### Employee Management

- `POST /api/v1/employees/create` - Create employee (Admin only)
- `GET /api/v1/employees/all` - Get all employees (Admin only)
- `PUT /api/v1/employees/update/:id` - Update employee (Admin only)
- `DELETE /api/v1/employees/delete/:id` - Delete employee (Admin only)

### Order Assignment

- `PUT /api/v1/orders/assign/:id` - Assign order to employee
- `POST /api/v1/employees/assign-order` - Alternative assignment endpoint

## WhatsApp Message Flow

1. **Admin creates employee** with WhatsApp number
2. **Admin assigns order** to employee
3. **WhatsApp message sent** automatically to employee
4. **Employee receives** order details via WhatsApp

## Testing

### Create Employee (Admin)

```bash
POST /api/v1/employees/create
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "whatsappNumber": "+1234567890",
  "department": "laundry"
}
```

### Assign Order

```bash
PUT /api/v1/orders/assign/ORDER_ID
{
  "employeeId": "EMPLOYEE_ID"
}
```

## Production Setup

For production, you need:

1. WhatsApp Business API approval from Twilio
2. Pre-approved message templates
3. Your own phone number (not sandbox)

## Phone Number Format

- Use E.164 format: +[country code][phone number]
- Example: +1234567890 (US), +971501234567 (UAE)
