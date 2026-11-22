/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { getSettingsApi, updateSettingsApi, uploadImageApi } from '../api/endpoints';

export function useSettings() {
  const [settings, setSettings] = useState({
    logo: '',
    background_color: ['#7c3aed', '#6d28d9'], // Purple theme defaults
    color: ['#ffffff'],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSettingsApi();
      const data = res.data?.data?.settings || res.data?.data || res.data;
      setSettings(data);
      return data;
    } catch (requestError) {
      setError(requestError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (payload, isFormData = false) => {
    setSaving(true);
    try {
      const res = await updateSettingsApi(payload, isFormData);
      await fetchSettings();
      return res.data;
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImageApi(formData);
      const fileData = res.data?.data?.file;
      const logoUrl = fileData?.absolute_url || fileData?.url;
      if (!logoUrl) {
        throw new Error('Image upload response did not include a URL');
      }
      await updateSettings({ ...settings, logo: logoUrl });
      return logoUrl;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
    uploadLogo,
  };
}

