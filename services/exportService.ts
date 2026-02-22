import apiClient from './apiClient';

const getExportUrl = (type: 'all' | 'stocks' | 'mutual-funds') =>
  `${apiClient.defaults.baseURL}/Export/${type}`;

export const exportService = {
  /** Trigger download of Excel file for the given export type. */
  downloadExport: async (type: 'all' | 'stocks' | 'mutual-funds'): Promise<void> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const url = getExportUrl(type);
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const disposition = res.headers.get('Content-Disposition');
    const fileName =
      disposition?.match(/filename="?([^";]+)"?/)?.[1] ||
      `InvestmentExport_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  },
};
