// Generate placeholder avatar
export const generateAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=6366f1&color=ffffff&bold=true&format=svg`;
};

// Generate QR code placeholder
export const generateQRPlaceholder = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMWEyZSIvPjxwYXRoIGQ9Ik01MCw1MGgzMDB2MzAwSDUweiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';
};

// Mock student photos
export const mockStudentPhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
];

// Hero mockup images
export const heroMockups = {
  qrCard: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  examHall: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
  scanning: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
};
