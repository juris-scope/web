import React, { useEffect, useState } from 'react';
import { UserRound, Shield, Cog, BarChart3 } from 'lucide-react';
import ProfileHeader from '../components/profile/ProfileHeader';
import TabNavigation from '../components/profile/TabNavigation';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import SecuritySettings from '../components/profile/SecuritySettings';
import PreferencesSettings from '../components/profile/PreferencesSettings';
import UsageStatistics from '../components/profile/UsageStatistics';
import { userApi } from '../utils/api';

export default function ProfilePage() {
  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: UserRound },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Cog },
    { id: 'statistics', label: 'Usage Statistics', icon: BarChart3 },
  ];

  const [active, setActive] = useState('personal');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await userApi.getProfile();
        if (mounted) setUser(res);
      } catch (e) {
        console.error('Profile load failed', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const showToast = (type, message) => {
    if (type !== 'success') return; // suppress error toasts
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {toast && toast.type === 'success' && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg text-white bg-[#10B981]`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB]">
          <ProfileHeader
            loading={loading}
            user={user}
            onAvatarChange={async (file) => {
              try {
                await userApi.uploadAvatar(file);
                const res = await userApi.getProfile();
                setUser(res);
                showToast('success', 'Avatar updated');
              } catch {
                showToast('error', 'Avatar upload failed');
              }
            }}
            onEditProfile={() => setActive('personal')}
          />

          <TabNavigation active={active} onChange={setActive} tabs={tabs} />
        </div>

        <div className="mt-6">
          {active === 'personal' && (
            <PersonalInfoForm
              user={user}
              loading={loading}
              onCancel={() => showToast('success', 'No changes made')}
              onSave={async (data) => {
                try {
                  await userApi.updateProfile(data);
                  const res = await userApi.getProfile();
                  setUser(res);
                  showToast('success', 'Profile updated successfully');
                } catch {
                  showToast('error', 'Failed to update profile');
                }
              }}
            />
          )}

          {active === 'security' && (
            <SecuritySettings
              user={user}
              onPasswordChange={async (payload) => {
                try {
                  await userApi.changePassword(payload);
                  showToast('success', 'Password changed');
                } catch {
                  showToast('error', 'Password change failed');
                }
              }}
              on2faToggle={async (enable) => {
                try {
                  if (enable) await userApi.enable2FA();
                  else await userApi.disable2FA();
                  const res = await userApi.getProfile();
                  setUser(res);
                  showToast('success', enable ? '2FA enabled' : '2FA disabled');
                } catch {
                  showToast('error', '2FA operation failed');
                }
              }}
              onRevokeSession={userApi.revokeSession}
              onSignOutOthers={userApi.signOutOthers}
              onExportData={userApi.exportData}
              onDeleteAccount={userApi.deleteAccount}
            />
          )}

          {active === 'preferences' && (
            <PreferencesSettings
              user={user}
              onSave={async (prefs) => {
                try {
                  await userApi.updatePreferences(prefs);
                  const res = await userApi.getProfile();
                  setUser(res);
                  showToast('success', 'Preferences saved');
                } catch {
                  showToast('error', 'Failed to save preferences');
                }
              }}
            />
          )}

          {active === 'statistics' && (
            <UsageStatistics
              fetchStats={userApi.getStatistics}
            />
          )}
        </div>
      </div>
    </div>
  );
}