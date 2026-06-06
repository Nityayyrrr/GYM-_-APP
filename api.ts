// api.ts
const BASE_URL = 'http://10.74.194.148:5000/api';

export async function registerUser(data: {
  name: string;
  phone: string;      // ← was email
  password: string;
  role: string;       // ← 'member' or 'instructor'
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(data: {
  phone: string;      // ← was email
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }
  return res.json();
}

export async function forgotPassword(phone: string) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send OTP');
  }
  return res.json();
}

export async function verifyOTP(phone: string, otp: string) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'OTP verification failed');
  }
  return res.json();
}

export async function resetPassword(phone: string, newPassword: string) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Password reset failed');
  }
  return res.json();
}