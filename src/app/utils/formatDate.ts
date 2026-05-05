/**
 * Format date to Swahili-friendly format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "4 Mei 2026")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
    'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Format date with time
 * @param dateString - ISO date string
 * @returns Formatted datetime (e.g., "4 Mei 2026, 10:30")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const dateStr = formatDate(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${dateStr}, ${hours}:${minutes}`;
};

/**
 * Get relative time (e.g., "2 saa zilizopita")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Sasa hivi';
  if (diffMins < 60) return `Dakika ${diffMins} zilizopita`;
  if (diffHours < 24) return `Saa ${diffHours} zilizopita`;
  if (diffDays === 1) return 'Jana';
  if (diffDays < 7) return `Siku ${diffDays} zilizopita`;

  return formatDate(dateString);
};
