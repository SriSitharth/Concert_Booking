'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { paymentApi } from '@/lib/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Sample items - replace with actual cart data from state/context
  const [items] = useState<CheckoutItem[]>([
    { id: '1', name: 'Concert Ticket - VIP', price: 199.99, quantity: 1 },
    { id: '2', name: 'Concert Ticket - General', price: 99.99, quantity: 2 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  // Redirect to login if not authenticated
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
          <p className="text-gray-400 mb-6">You must be logged in to proceed with checkout.</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Generate unique order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create payment order
      const paymentResponse = await paymentApi.createOrder(
        token,
        total,
        orderId,
        {
          name: user.name,
          email: user.email,
          phone: user.phone || '9999999999', // Use actual phone if available
        }
      );

      // If payment link is returned, redirect to it
      if (paymentResponse && paymentResponse.paymentLink) {
        window.location.href = paymentResponse.paymentLink;
      } else if (paymentResponse) {
        // Handle alternative payment flow
        router.push(`/payment-status/${paymentResponse.orderId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-800">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-gray-700">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Billing Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">{user.phone || 'Not provided'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-6">Complete Payment</h3>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-white">₹{total.toFixed(2)}</p>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">Payment Method</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input type="radio" name="payment" defaultChecked className="accent-white" />
                    <span className="text-white font-medium">Debit/Credit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input type="radio" name="payment" className="accent-white" />
                    <span className="text-white font-medium">UPI</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input type="radio" name="payment" className="accent-white" />
                    <span className="text-white font-medium">Wallet</span>
                  </label>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
              </button>

              {/* Security Info */}
              <p className="text-xs text-gray-500 text-center">
                Powered by <span className="font-semibold">Cashfree Payments</span>. Your payment is secure.
              </p>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
