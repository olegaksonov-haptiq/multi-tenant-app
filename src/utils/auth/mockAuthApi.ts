import type { LoginCredentials, User } from '../../types/auth';

type AuthResponse = {
  user: User;
  token: string;
};

const mockUsers: User[] = [
  {
    id: '1',
    email: 'tenant-default-user@example.com',
    name: 'Default Tenant Owner',
    roles: ['admin'],
    permissions: ['read', 'write', 'delete'],
    tenantId: 'default',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'tenant-drf-user@example.com',
    name: 'DRF User',
    roles: ['user'],
    permissions: ['read', 'write'],
    tenantId: 'drf',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'tenant-venu-user@example.com',
    name: 'Venu Admin',
    roles: ['admin'],
    permissions: ['read', 'write'],
    tenantId: 'venu',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildToken = (user: User) => `mock-token-${user.tenantId}-${user.id}`;

const matchMockUser = (email: string, tenantId?: string): User | undefined => {
  if (!tenantId) return undefined;

  return mockUsers.find(
    (candidate) =>
      candidate.isActive && candidate.email.toLowerCase() === email.toLowerCase() && candidate.tenantId === tenantId,
  );
};

export const mockAuthApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);

    const tenantId = credentials.tenantId;

    if (!tenantId) {
      throw new Error('Tenant is required');
    }

    const matched = matchMockUser(credentials.email, tenantId);

    if (!credentials.password || credentials.password.length < 4) {
      throw new Error('Invalid credentials');
    }

    if (!matched) {
      throw new Error('Invalid credentials');
    }

    const user: User = {
      ...matched,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      user,
      token: buildToken(user),
    };
  },

  async validate(token: string): Promise<AuthResponse> {
    await delay(400);

    const parts = token.split('-');
    if (parts.length < 4) {
      throw new Error('Invalid token');
    }

    const tenantId = parts[2];
    const userId = parts[3];

    const user = mockUsers.find((candidate) => candidate.id === userId && candidate.tenantId === tenantId);

    if (!user) {
      throw new Error('Invalid token');
    }

    return {
      user,
      token,
    };
  },
};

export type { AuthResponse };
