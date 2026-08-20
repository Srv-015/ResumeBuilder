'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type SettingsSection = 'profile' | 'security' | 'account';

export default function SettingsPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/api/auth`;

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileMessage('');

        const token = getToken();

        if (!token) {
          setProfileMessage('Please log in again.');
          return;
        }

        const response = await fetch(`${API_URL}/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            router.push('/login');
            return;
          }

          throw new Error(data.message || 'Failed to load profile');
        }

        setFullName(data.user.name || '');
        setEmail(data.user.email || '');
      } catch (error) {
        console.error('Load profile error:', error);
        setProfileMessage(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSave = async () => {
    try {
      setProfileSaving(true);
      setProfileMessage('');

      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          router.push('/login');
          return;
        }

        throw new Error(data.message || 'Failed to update profile');
      }

      setFullName(data.user.name || '');
      setEmail(data.user.email || '');

      const storedUser = localStorage.getItem('user');
      const sessionUser = sessionStorage.getItem('user');
      const currentUser = storedUser || sessionUser;

      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        const updatedUser = {
          ...parsedUser,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        };

        if (storedUser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        if (sessionUser) {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      setProfileMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Update profile error:', error);
      setProfileMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordMessage('');

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordMessage('Please fill in all password fields.');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordMessage('New password must be at least 6 characters.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordMessage('New password and confirmation do not match.');
        return;
      }

      if (currentPassword === newPassword) {
        setPasswordMessage('New password must be different from your current password.');
        return;
      }

      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      setPasswordSaving(true);

      const response = await fetch(`${API_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          router.push('/login');
          return;
        }

        throw new Error(data.message || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setPasswordMessage('Password changed successfully.');
    } catch (error) {
      console.error('Change password error:', error);

      setPasswordMessage(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteMessage('');

      if (!deletePassword) {
        setDeleteMessage('Please enter your current password.');
        return;
      }

      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      setDeleteSaving(true);

      const response = await fetch(`${API_URL}/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');

          router.push('/login');
          return;
        }

        throw new Error(data.message || 'Failed to delete account');
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      setDeletePassword('');
      setShowDeletePassword(false);
      setShowDeleteModal(false);

      router.replace('/');
    } catch (error) {
      console.error('Delete account error:', error);

      setDeleteMessage(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2c241c]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#2c241c]/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-2xl font-bold tracking-[0.2em] transition hover:opacity-60"
          >
            CVÉRÉ
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-[0.18em] transition hover:opacity-60"
            >
              Dashboard
            </Link>

            <span className="text-[#806b50]">/</span>

            <span className="text-xs uppercase tracking-[0.18em]">Settings</span>
          </nav>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        {/* Heading */}

        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">Account</p>

          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">Settings</h1>

          <p className="mt-5 text-sm leading-7 text-[#5e5143]">
            Manage your account, security and preferences.
          </p>
        </div>

        {/* =================================================
            SETTINGS LAYOUT
        ================================================= */}

        <div className="mt-14 grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside>
            <div className="border-t border-[#2c241c]/20">
              {/* Profile */}

              <button
                type="button"
                onClick={() => setActiveSection('profile')}
                className={`w-full border-b border-[#2c241c]/15 px-1 py-5 text-left text-xs uppercase tracking-[0.2em] transition ${
                  activeSection === 'profile'
                    ? 'font-medium'
                    : 'text-[#806b50] hover:text-[#2c241c]'
                }`}
              >
                Profile
              </button>

              {/* Security */}

              <button
                type="button"
                onClick={() => setActiveSection('security')}
                className={`w-full border-b border-[#2c241c]/15 px-1 py-5 text-left text-xs uppercase tracking-[0.2em] transition ${
                  activeSection === 'security'
                    ? 'font-medium'
                    : 'text-[#806b50] hover:text-[#2c241c]'
                }`}
              >
                Security
              </button>

              {/* Account */}

              <button
                type="button"
                onClick={() => setActiveSection('account')}
                className={`w-full border-b border-[#2c241c]/15 px-1 py-5 text-left text-xs uppercase tracking-[0.2em] transition ${
                  activeSection === 'account'
                    ? 'font-medium'
                    : 'text-[#806b50] hover:text-[#2c241c]'
                }`}
              >
                Account
              </button>
            </div>
          </aside>

          {/* =================================================
              CONTENT
          ================================================= */}

          <section className="max-w-3xl">
            {/* =================================================
                PROFILE
            ================================================= */}

            {activeSection === 'profile' && (
              <div>
                <div className="border-b border-[#2c241c]/20 pb-7">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">Profile</p>

                  <h2 className="mt-3 font-serif text-3xl">Personal information</h2>

                  <p className="mt-3 text-sm leading-6 text-[#5e5143]">
                    Update the information associated with your CVÉRÉ account.
                  </p>
                </div>

                <div className="space-y-8 pt-8">
                  {/* Name */}

                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-xs uppercase tracking-[0.2em]"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      disabled={profileLoading || profileSaving}
                      className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-60"
                    />
                  </div>

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs uppercase tracking-[0.2em]"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      disabled={profileLoading || profileSaving}
                      className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-60"
                    />
                  </div>

                  {/* Save */}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={profileLoading || profileSaving}
                      className="bg-[#2c241c] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>

                    {profileMessage && (
                      <p className="pt-3 text-xs text-[#806b50]">{profileMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                SECURITY
            ================================================= */}

            {activeSection === 'security' && (
              <div>
                <div className="border-b border-[#2c241c]/20 pb-7">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">Security</p>

                  <h2 className="mt-3 font-serif text-3xl">Change password</h2>

                  <p className="mt-3 text-sm leading-6 text-[#5e5143]">
                    Keep your account secure by using a strong password.
                  </p>
                </div>

                <div className="space-y-8 pt-8">
                  {/* Current Password */}

                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-xs uppercase tracking-[0.2em]"
                    >
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        placeholder="••••••••"
                        disabled={passwordSaving}
                        className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 pr-12 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((value) => !value)}
                        aria-label={
                          showCurrentPassword ? 'Hide current password' : 'Show current password'
                        }
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#806b50] transition hover:text-[#2c241c]"
                      >
                        <FontAwesomeIcon
                          icon={showCurrentPassword ? faEyeSlash : faEye}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* New Password */}

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-xs uppercase tracking-[0.2em]"
                    >
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="••••••••"
                        disabled={passwordSaving}
                        className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 pr-12 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword((value) => !value)}
                        aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#806b50] transition hover:text-[#2c241c]"
                      >
                        <FontAwesomeIcon
                          icon={showNewPassword ? faEyeSlash : faEye}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs uppercase tracking-[0.2em]"
                    >
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="••••••••"
                        disabled={passwordSaving}
                        className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 pr-12 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        aria-label={
                          showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                        }
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#806b50] transition hover:text-[#2c241c]"
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={passwordSaving}
                      className="bg-[#2c241c] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {passwordSaving ? 'Changing...' : 'Change Password'}
                    </button>

                    {passwordMessage && (
                      <p className="pt-3 text-xs text-[#806b50]">{passwordMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                ACCOUNT
            ================================================= */}

            {activeSection === 'account' && (
              <div>
                <div className="border-b border-[#2c241c]/20 pb-7">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#806b50]">Account</p>

                  <h2 className="mt-3 font-serif text-3xl">Account settings</h2>

                  <p className="mt-3 text-sm leading-6 text-[#5e5143]">
                    Manage your account session and account-related actions.
                  </p>
                </div>

                {/* Logout */}

                <div className="border-b border-[#2c241c]/15 py-8">
                  <h3 className="font-serif text-xl">Sign out</h3>

                  <p className="mt-2 text-sm leading-6 text-[#5e5143]">
                    Sign out of your CVÉRÉ account on this device.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      sessionStorage.removeItem('token');
                      sessionStorage.removeItem('user');
                      router.replace('/login');
                    }}
                    className="mt-5 border border-[#2c241c]/40 px-7 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
                  >
                    Log Out
                  </button>
                </div>

                {/* Danger Zone */}

                <div className="pt-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-900/70">Danger Zone</p>

                  <h3 className="mt-3 font-serif text-xl">Delete account</h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#5e5143]">
                    Permanently delete your account and associated resumes. This action cannot be
                    undone.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteMessage('');
                      setDeletePassword('');
                      setShowDeletePassword(false);
                      setShowDeleteModal(true);
                    }}
                    className="mt-5 border border-red-900/30 px-7 py-4 text-xs uppercase tracking-[0.2em] text-red-900 transition hover:bg-red-900 hover:text-[#f4efe4]"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c241c]/50 px-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleteSaving) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="w-full max-w-md border border-[#2c241c]/20 bg-[#f4efe4] p-7 shadow-[0_25px_70px_rgba(44,36,28,0.25)]">
            <p className="text-xs uppercase tracking-[0.25em] text-red-900/70">Danger Zone</p>

            <h2 className="mt-3 font-serif text-3xl">Delete your account?</h2>

            <p className="mt-4 text-sm leading-6 text-[#5e5143]">
              This will permanently delete your account and all resumes associated with it. This
              action cannot be undone.
            </p>

            <div className="mt-7">
              <label
                htmlFor="deleteAccountPassword"
                className="mb-2 block text-xs uppercase tracking-[0.2em]"
              >
                Current Password
              </label>

              <div className="relative">
                <input
                  id="deleteAccountPassword"
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  placeholder="••••••••"
                  disabled={deleteSaving}
                  autoComplete="current-password"
                  className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 pr-12 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowDeletePassword((value) => !value)}
                  aria-label={
                    showDeletePassword ? 'Hide current password' : 'Show current password'
                  }
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[#806b50] transition hover:text-[#2c241c]"
                >
                  <FontAwesomeIcon
                    icon={showDeletePassword ? faEyeSlash : faEye}
                    className="h-4 w-4"
                  />
                </button>
              </div>

              {deleteMessage && <p className="mt-3 text-xs text-red-900">{deleteMessage}</p>}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (deleteSaving) return;

                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteMessage('');
                  setShowDeletePassword(false);
                }}
                disabled={deleteSaving}
                className="border border-[#2c241c]/30 px-5 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteSaving}
                className="bg-red-900 px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#f4efe4] transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteSaving ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
