'use client';

import { useAuth } from '@/lib/auth-context';
import { authApi } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, token, isLoading, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || user?.phone || '',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please log in to view your profile.</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getDisplayName = () => user?.fullName || user?.name || 'N/A';
  const getDisplayPhone = () => user?.mobile || user?.phone || 'Not provided';

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      await updateProfile({
        fullName: formData.fullName,
        mobile: formData.mobile,
      });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account details and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Account Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">{getDisplayName()}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="px-4 py-3 bg-gray-800 rounded-lg text-gray-400">
                {user.email}
                <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  name="mobile"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                  {getDisplayPhone()}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user.fullName || user.name || '',
                    email: user.email,
                    mobile: user.mobile || user.phone || '',
                  });
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-gray-900 rounded-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Purchases</h2>
          <p className="text-gray-400 text-sm">Your payment history and tickets will appear here</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
