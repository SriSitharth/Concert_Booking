import { NextRequest, NextResponse } from 'next/server';

// Types for Cashfree webhook payload
interface CustomerDetails {
  customer_phone: string;
  customer_email: string;
  customer_name: string;
  customer_fields?: Array<{ title: string; value: string }>;
}

interface OrderData {
  order_amount: number;
  order_id: string;
  order_status: string;
  transaction_id: number;
  customer_details: CustomerDetails;
  amount_details?: Array<{ title: string; value: number; quantity?: number; selectedoption?: string }>;
}

interface CashfreeWebhookPayload {
  data: {
    form?: { form_id: string; cf_form_id: number; form_url: string; form_currency: string };
    order: OrderData;
  };
  event_time: string;
  type: string;
}

interface WhatsAppTemplateParam {
  type: 'text';
  text: string;
}

interface WhatsAppRequestBody {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: 'body';
      parameters: WhatsAppTemplateParam[];
    }>;
  };
}

// Utility function to format phone number to 91XXXXXXXXXX format
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If already starts with 91, return as is
  if (cleaned.startsWith('91')) {
    return cleaned;
  }
  
  // If 10 digits, prepend 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  // If starts with 0, remove it and prepend 91
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `91${cleaned.slice(1)}`;
  }
  
  // Return as-is if already in correct format or cannot determine
  return cleaned;
}

// Utility function to send WhatsApp message
async function sendWhatsAppMessage(
  customerName: string,
  customerId: string,
  phoneNumber: string
): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  if (!/^\d{12,13}$/.test(formattedPhone)) {
    throw new Error(`Invalid phone number format: ${formattedPhone}`);
  }

  const requestBody: WhatsAppRequestBody = {
    messaging_product: 'whatsapp',
    to: formattedPhone,
    type: 'template',
    template: {
      name: 'ticket_confirmation',
      language: {
        code: 'en',
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: customerName,
            },
            {
              type: 'text',
              text: customerId,
            },
          ],
        },
      ],
    },
  };

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `WhatsApp API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  const messageId = data?.messages?.[0]?.id;
  console.log('WhatsApp message sent successfully:', {
    messageId,
    phone: formattedPhone,
    timestamp: new Date().toISOString(),
  });
}

// Placeholder function for Cashfree webhook signature verification
function verifyCashfreeSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  // TODO: Implement Cashfree signature verification
  // Reference: https://docs.cashfree.com/docs/webhooks
  // Use HMAC-SHA256 to verify the signature
  // This is a placeholder - uncomment and implement when ready:
  
  /*
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('base64');
  return signature === expectedSignature;
  */
  
  console.warn('⚠️  Webhook signature verification not implemented');
  return true; // Remove this in production after implementing verification
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // Log incoming request
    console.log('📨 Cashfree webhook received');

    // Parse request body
    let payload: CashfreeWebhookPayload;
    try {
      payload = await request.json();
    } catch {
      console.error('❌ Failed to parse JSON payload');
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 200 } // Return 200 to prevent Cashfree retries
      );
    }

    // Validate required structure
    if (!payload.data?.order) {
      console.error('❌ Missing data.order in payload');
      return NextResponse.json(
        { success: false, error: 'Invalid payload structure' },
        { status: 200 }
      );
    }

    const order = payload.data.order;
    const customerDetails = order.customer_details;

    // Validate required fields
    const requiredFields = ['order_id', 'order_status', 'customer_details'];
    const missingFields = requiredFields.filter((field) => {
      if (field === 'customer_details') {
        return !customerDetails || !customerDetails.customer_name || !customerDetails.customer_phone;
      }
      return !order[field as keyof OrderData];
    });

    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { success: false, error: `Missing fields: ${missingFields.join(', ')}` },
        { status: 200 }
      );
    }

    // Verify payment status (Cashfree uses "PAID" for successful payments)
    if (order.order_status !== 'PAID') {
      console.log(`⏭️  Payment not successful. Status: ${order.order_status}`);
      return NextResponse.json(
        { success: true, message: 'Payment not successful, no action taken' },
        { status: 200 }
      );
    }

    console.log(`✅ Payment successful for order: ${order.order_id}`);

    // Optional: Verify Cashfree webhook signature (if secret key is provided)
    const cashfreeSecret = process.env.CASHFREE_WEBHOOK_SECRET;
    if (cashfreeSecret) {
      const signature = request.headers.get('x-cashfree-signature');
      const rawBody = await request.text();
      
      if (!signature || !verifyCashfreeSignature(rawBody, signature, cashfreeSecret)) {
        console.error('❌ Webhook signature verification failed');
        return NextResponse.json(
          { success: false, error: 'Signature verification failed' },
          { status: 200 }
        );
      }
    }

    // Extract required data
    const customer_name = customerDetails.customer_name;
    const customer_phone = customerDetails.customer_phone;
    const order_id = order.order_id;

    console.log(`📤 Preparing to send WhatsApp message to ${customer_phone}`);

    // Send WhatsApp message
    try {
      await sendWhatsAppMessage(customer_name, order_id, customer_phone);
      console.log(`✅ WhatsApp message sent successfully for order: ${order_id}`);
    } catch (whatsappError) {
      console.error('❌ WhatsApp API error:', whatsappError);
      // Log the error but still return 200 to Cashfree
      // In production, you might want to implement a retry mechanism
    }

    // Log successful processing
    console.log(`✅ Webhook processed successfully for order: ${order_id}`);

    // Always return 200 to Cashfree to prevent retries
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        order_id: order_id,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log unexpected errors
    console.error('❌ Unexpected error in webhook handler:', error);

    // Return 200 to prevent Cashfree retries
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 200 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
