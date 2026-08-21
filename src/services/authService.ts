export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  authProvider: 'google' | 'email' | 'wallet';
  createdAt: number;
  walletAddress?: string;
  role: 'user' | 'creator' | 'validator';
  googleIdToken?: string;
  emailVerified?: boolean;
}

export interface GoogleJwtPayload {
  iss?: string;
  sub: string;
  email: string;
  email_verified?: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat?: number;
  exp?: number;
}

const AUTH_STORAGE_KEY = 'shadow_auth_user_session';
const GOOGLE_CLIENT_ID_KEY = 'shadow_google_client_id';

// Decode standard Google Identity Services JWT credential
export function decodeGoogleJwt(token: string): GoogleJwtPayload {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse Google JWT credential', err);
    throw new Error('Invalid Google credential token');
  }
}

export const authService = {
  getGoogleClientId(): string {
    const fromStorage = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
    const fromEnv = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (fromEnv && fromEnv.trim()) return fromEnv.trim();
    // Default demo client ID or fallback
    return '';
  },

  setGoogleClientId(clientId: string): void {
    if (clientId && clientId.trim()) {
      localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
    } else {
      localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
    }
  },

  getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored auth session', e);
    }
    return null;
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
  },

  clearUser(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  },

  // Process Real Google Identity Token (from Google One Tap or Google Sign In Button)
  loginWithGoogleCredential(credentialToken: string): UserProfile {
    const payload = decodeGoogleJwt(credentialToken);
    
    const user: UserProfile = {
      id: 'usr_g_' + payload.sub,
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      avatar: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(payload.email)}&backgroundColor=7e22ce,3b82f6`,
      authProvider: 'google',
      createdAt: Date.now(),
      role: 'creator',
      googleIdToken: credentialToken,
      emailVerified: payload.email_verified ?? true,
    };

    this.saveUser(user);
    return user;
  },

  // Direct interactive Google OAuth popup / Token Client
  async loginWithGoogleOAuthToken(accessToken: string): Promise<UserProfile> {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google user profile: ${res.statusText}`);
    }

    const info = await res.json();
    const user: UserProfile = {
      id: 'usr_g_' + (info.sub || Math.random().toString(36).substring(2, 9)),
      name: info.name || info.email.split('@')[0],
      email: info.email,
      avatar: info.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(info.email)}&backgroundColor=7e22ce,3b82f6`,
      authProvider: 'google',
      createdAt: Date.now(),
      role: 'creator',
      emailVerified: info.email_verified ?? true,
    };

    this.saveUser(user);
    return user;
  },

  // Fallback simulator for rapid testing or customized account
  async loginWithGoogleSimulated(email?: string, name?: string): Promise<UserProfile> {
    const userEmail = email || 'pbendre542@gmail.com';
    const userName = name || 'Google Verified User';
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}&backgroundColor=7e22ce,3b82f6`;

    const user: UserProfile = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 11),
      name: userName,
      email: userEmail,
      avatar,
      authProvider: 'google',
      createdAt: Date.now(),
      role: 'creator',
      emailVerified: true,
    };

    this.saveUser(user);
    return user;
  },

  async loginWithEmail(email: string, name: string): Promise<UserProfile> {
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}&backgroundColor=a855f7`;
    const user: UserProfile = {
      id: 'usr_e_' + Math.random().toString(36).substring(2, 11),
      name: name || email.split('@')[0],
      email,
      avatar,
      authProvider: 'email',
      createdAt: Date.now(),
      role: 'user',
      emailVerified: false,
    };

    this.saveUser(user);
    return user;
  },

  async loginWithWallet(address: string): Promise<UserProfile> {
    const shortAddr = address.substring(0, 4) + '...' + address.substring(address.length - 4);
    const user: UserProfile = {
      id: 'usr_w_' + address.substring(0, 10),
      name: `Solana (${shortAddr})`,
      email: `${address.substring(0, 6)}@solana.shadow`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=9333ea`,
      authProvider: 'wallet',
      walletAddress: address,
      createdAt: Date.now(),
      role: 'validator',
    };

    this.saveUser(user);
    return user;
  },
};
