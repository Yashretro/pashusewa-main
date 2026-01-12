export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

export function filterReportsByRadius(reports, userLat, userLon, radiusKm) {
  return reports.filter(report => {
    const distance = calculateDistance(userLat, userLon, report.latitude, report.longitude);
    return distance <= radiusKm;
  });
}

export function sortReportsByDistance(reports, userLat, userLon) {
  return [...reports].sort((a, b) => {
    const distA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
    const distB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
    return distA - distB;
  });
}

export function filterReportsByStatus(reports, status) {
  if (status === 'All') return reports;
  return reports.filter(report => report.status === status);
}

