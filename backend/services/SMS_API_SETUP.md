# SMS API Setup Guide

This project uses a custom SMS API from waghl.com to send SMS messages and media (images) to customers and employees.

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMS API Configuration
SMS_API_KEY=your_api_key_here
SMS_SENDER=your_sender_name_here
```

### How to Get Credentials

1. Sign up or log in to your SMS service provider at https://custom1.waghl.com
2. Get your API key from the dashboard
3. Configure your sender name (this will appear as the sender of SMS messages)
4. Add these credentials to your `.env` file

## API Details

### Text Message Endpoint

- **API Endpoint**: `https://custom1.waghl.com/send-message`
- **Method**: POST
- **Content-Type**: application/json

#### Request Format

```json
{
  "api_key": "your_api_key",
  "sender": "your_sender_name",
  "number": "receiver_phone_number",
  "message": "Your message content"
}
```

### Media Message Endpoint

- **API Endpoint**: `https://custom1.waghl.com/send-media`
- **Method**: POST
- **Content-Type**: application/json

#### Request Format

```json
{
  "api_key": "your_api_key",
  "sender": "your_sender_name",
  "number": "receiver_phone_number",
  "caption": "Image caption text",
  "media_type": "image",
  "url": "https://example.com/image.jpg"
}
```

### Phone Number Format

- The API accepts phone numbers without special characters
- Numbers are automatically formatted by removing `+`, spaces, dashes, and all non-digit characters
- Example: `+1234567890` becomes `1234567890`
- Example: `+974 1234 5678` becomes `97412345678`

## Available Functions

### `sendSMS(to, message)`

Sends an SMS text message to a phone number.

**Parameters:**

- `to` (string): Phone number (with or without + prefix)
- `message` (string): Message content

**Returns:**

```javascript
{
  success: boolean,
  messageId: string,
  status: string
}
```

### `sendMediaSMS(to, caption, imageUrl)`

Sends an SMS with an image attachment.

**Parameters:**

- `to` (string): Phone number (with or without + prefix)
- `caption` (string): Caption for the image
- `imageUrl` (string): Public URL of the image to send

**Returns:**

```javascript
{
  success: boolean,
  messageId: string,
  status: string
}
```

### `generateAndUploadReceiptImage(orderDetails)`

Generates a receipt as an image and uploads it to Cloudinary.

**Parameters:**

- `orderDetails` (object): Order information

**Returns:**

```javascript
{
  success: boolean,
  receiptUrl: string
}
```

### `testTwilioConnection()`

Tests the SMS API configuration.

**Returns:**

```javascript
{
  success: boolean,
  message: string
}
```

### Other Functions

- `sendOrderAssignmentSMS(employeePhone, employeeName, orderDetails)` - Text only
- `sendEmployeeAssignmentSMS(customerPhone, customerName, orderDetails, employeeName, employeeContact)` - Text + Receipt Image
- `sendOrderStatusUpdateSMS(customerPhone, customerName, orderDetails)` - Text only
- `sendWelcomeSMS(customerPhone, customerName)` - Text only

## Usage Examples

### Send a Text Message

```javascript
import { sendSMS } from "./services/smsService.js";

const result = await sendSMS("+1234567890", "Hello from AKOYA Laundry!");

if (result.success) {
  console.log("Message sent successfully:", result.messageId);
} else {
  console.error("Failed to send message:", result.error);
}
```

### Send an Image with Caption

```javascript
import { sendMediaSMS } from "./services/smsService.js";

const result = await sendMediaSMS(
  "+1234567890",
  "Your order receipt",
  "https://res.cloudinary.com/your-cloud/image/upload/receipt.png"
);

if (result.success) {
  console.log("Image sent successfully:", result.messageId);
} else {
  console.error("Failed to send image:", result.error);
}
```

### Send Receipt to Customer (Automatic)

When you call `sendEmployeeAssignmentSMS`, it automatically:

1. Generates a receipt image
2. Uploads it to Cloudinary
3. Sends a text message with order details
4. Sends the receipt as an image with caption

```javascript
import { sendEmployeeAssignmentSMS } from "./services/smsService.js";

const result = await sendEmployeeAssignmentSMS(
  "+1234567890", // Customer phone
  "John Doe", // Customer name
  orderDetails, // Order object
  "Ahmed", // Employee name
  "+1234567891" // Employee contact
);

// Returns both text and image results
if (result.success) {
  console.log("Text message:", result.textMessage);
  console.log("Receipt image:", result.receiptImage);
}
```

## Receipt Image Generation

Receipt images are automatically generated with:

- **Golden theme** (#D4AF37 for branding)
- **Order information** (ID, customer, service, date, status)
- **Payment details** (total amount)
- **Professional layout** optimized for mobile viewing
- **PNG format** uploaded to Cloudinary

## Testing

You can test the SMS service by calling the test endpoint:

```javascript
import { testTwilioConnection } from "./services/smsService.js";

const test = await testTwilioConnection();
console.log(test);
```

## Migration from Twilio

This project was previously using Twilio for SMS/WhatsApp messaging. The SMS service has been updated to use the custom SMS API while maintaining the same function signatures for backward compatibility.

### Changes:

- Removed Twilio SDK dependency
- Updated to use fetch API for HTTP requests
- Changed phone number formatting (removes E.164 strict validation)
- Added media sending capability via `/send-media` endpoint
- Receipt now sent as image instead of PDF link
- Function name `testTwilioConnection()` kept for backward compatibility

## Troubleshooting

### Common Issues

1. **"SMS API credentials not configured"**

   - Ensure `SMS_API_KEY` and `SMS_SENDER` are set in `.env`
   - Restart your server after updating `.env`

2. **"Failed to send SMS"**

   - Verify your API key is valid
   - Check that the sender name is approved by your provider
   - Ensure the phone number is valid

3. **"Failed to send media SMS"**

   - Verify the image URL is publicly accessible
   - Check that the URL returns a valid image (PNG, JPG)
   - Ensure Cloudinary credentials are configured correctly

4. **"Receipt generation failed"**

   - Check Cloudinary credentials in `.env`
   - Ensure temp directory has write permissions
   - Verify pdfkit is installed

5. **Message not received**
   - Verify the recipient's phone number is correct
   - Check if the number is registered/active
   - Contact your SMS provider for delivery status

## Support

For issues with the SMS API, contact your SMS service provider or check their documentation at https://custom1.waghl.com
