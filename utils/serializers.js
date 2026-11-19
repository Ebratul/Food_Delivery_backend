// Shapes database records into API responses (never leaks password hashes).
export const avatarUrl = (user) => (user?.avatarId ? `/api/images/${user.avatarId}` : null);

export const publicUser = (user) =>
  user && {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    city: user.city,
    bio: user.bio,
    avatar: avatarUrl(user),
    isActive: user.isActive,
    createdAt: user.createdAt,
  };

export const authorSummary = (user) => user && { id: user.id, name: user.name, avatar: avatarUrl(user) };
