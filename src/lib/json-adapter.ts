import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import crypto from "crypto";
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";

const DB_PATH = join(process.cwd(), "auth-db.json");

interface AuthDB {
  users: AdapterUser[];
  accounts: AdapterAccount[];
  sessions: AdapterSession[];
  verificationTokens: VerificationToken[];
}

function readDB(): AuthDB {
  if (!existsSync(DB_PATH)) {
    const initialDB: AuthDB = {
      users: [],
      accounts: [],
      sessions: [],
      verificationTokens: []
    };
    writeDB(initialDB);
    return initialDB;
  }
  
  try {
    const content = readFileSync(DB_PATH, "utf8");
    return JSON.parse(content);
  } catch {
    const initialDB: AuthDB = {
      users: [],
      accounts: [],
      sessions: [],
      verificationTokens: []
    };
    writeDB(initialDB);
    return initialDB;
  }
}

function writeDB(db: AuthDB): void {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function JSONAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const db = readDB();
      const newUser: AdapterUser = {
        ...user,
        id: crypto.randomUUID(),
        email: user.email!,
        emailVerified: user.emailVerified || null,
      };
      db.users.push(newUser);
      writeDB(db);
      return newUser;
    },

    async getUser(id: string) {
      const db = readDB();
      return db.users.find(user => user.id === id) || null;
    },

    async getUserByEmail(email: string) {
      const db = readDB();
      return db.users.find(user => user.email === email) || null;
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      const db = readDB();
      const account = db.accounts.find(
        acc => acc.provider === provider && acc.providerAccountId === providerAccountId
      );
      if (!account) return null;
      return db.users.find(user => user.id === account.userId) || null;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const db = readDB();
      const index = db.users.findIndex(u => u.id === user.id);
      if (index === -1) throw new Error("User not found");
      db.users[index] = { ...db.users[index], ...user };
      writeDB(db);
      return db.users[index];
    },

    async deleteUser(userId: string) {
      const db = readDB();
      const userIndex = db.users.findIndex(user => user.id === userId);
      if (userIndex === -1) return;
      
      db.users.splice(userIndex, 1);
      db.accounts = db.accounts.filter(account => account.userId !== userId);
      db.sessions = db.sessions.filter(session => session.userId !== userId);
      writeDB(db);
    },

    async linkAccount(account: AdapterAccount) {
      const db = readDB();
      db.accounts.push(account);
      writeDB(db);
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      const db = readDB();
      const accountIndex = db.accounts.findIndex(
        acc => acc.provider === provider && acc.providerAccountId === providerAccountId
      );
      if (accountIndex !== -1) {
        db.accounts.splice(accountIndex, 1);
        writeDB(db);
      }
    },

    async createSession(session: AdapterSession) {
      const db = readDB();
      db.sessions.push(session);
      writeDB(db);
      return session;
    },

    async getSessionAndUser(sessionToken: string) {
      const db = readDB();
      const session = db.sessions.find(s => s.sessionToken === sessionToken);
      if (!session) return null;
      
      const user = db.users.find(user => user.id === session.userId);
      if (!user) return null;
      
      return { session, user };
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      const db = readDB();
      const index = db.sessions.findIndex(s => s.sessionToken === session.sessionToken);
      if (index === -1) return null;
      
      db.sessions[index] = { ...db.sessions[index], ...session };
      writeDB(db);
      return db.sessions[index];
    },

    async deleteSession(sessionToken: string) {
      const db = readDB();
      const sessionIndex = db.sessions.findIndex(s => s.sessionToken === sessionToken);
      if (sessionIndex !== -1) {
        db.sessions.splice(sessionIndex, 1);
        writeDB(db);
      }
    },

    async createVerificationToken(token: VerificationToken) {
      const db = readDB();
      db.verificationTokens.push(token);
      writeDB(db);
      return token;
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      const db = readDB();
      const tokenIndex = db.verificationTokens.findIndex(
        t => t.identifier === identifier && t.token === token
      );
      
      if (tokenIndex === -1) return null;
      
      const verificationToken = db.verificationTokens[tokenIndex];
      db.verificationTokens.splice(tokenIndex, 1);
      writeDB(db);
      return verificationToken;
    },
  };
}