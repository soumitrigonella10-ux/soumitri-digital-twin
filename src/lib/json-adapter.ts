import fs from "fs"
import path from "path"
import crypto from "crypto"
import type { Adapter, AdapterUser, AdapterSession, VerificationToken, AdapterAccount } from "next-auth/adapters"

const DB_PATH = path.join(process.cwd(), "auth-db.json")

interface DbSchema {
  users: Array<{
    id: string
    name?: string | null
    email: string
    emailVerified: string | null
    image?: string | null
  }>
  accounts: Array<{
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }>
  sessions: Array<{
    id: string
    sessionToken: string
    userId: string
    expires: string
  }>
  verificationTokens: Array<{
    identifier: string
    token: string
    expires: string
  }>
}

function readDb(): DbSchema {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    const empty: DbSchema = { users: [], accounts: [], sessions: [], verificationTokens: [] }
    writeDb(empty)
    return empty
  }
}

function writeDb(db: DbSchema): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8")
}

export function JsonAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const db = readDb()
      const newUser = {
        id: crypto.randomUUID(),
        name: user.name ?? null,
        email: user.email,
        emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
        image: user.image ?? null,
      }
      db.users.push(newUser)
      writeDb(db)
      return {
        ...newUser,
        emailVerified: newUser.emailVerified ? new Date(newUser.emailVerified) : null,
      } as AdapterUser
    },

    async getUser(id) {
      const db = readDb()
      const user = db.users.find((u) => u.id === id)
      if (!user) return null
      return {
        ...user,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      } as AdapterUser
    },

    async getUserByEmail(email) {
      const db = readDb()
      const user = db.users.find((u) => u.email === email)
      if (!user) return null
      return {
        ...user,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      } as AdapterUser
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const db = readDb()
      const account = db.accounts.find(
        (a) => a.provider === provider && a.providerAccountId === providerAccountId
      )
      if (!account) return null
      const user = db.users.find((u) => u.id === account.userId)
      if (!user) return null
      return {
        ...user,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      } as AdapterUser
    },

    async updateUser(user) {
      const db = readDb()
      const idx = db.users.findIndex((u) => u.id === user.id)
      if (idx === -1) throw new Error("User not found")
      db.users[idx] = {
        ...db.users[idx],
        ...user,
        emailVerified: user.emailVerified
          ? user.emailVerified instanceof Date
            ? user.emailVerified.toISOString()
            : user.emailVerified
          : db.users[idx].emailVerified,
      } as DbSchema["users"][0]
      writeDb(db)
      return {
        ...db.users[idx],
        emailVerified: db.users[idx].emailVerified
          ? new Date(db.users[idx].emailVerified!)
          : null,
      } as AdapterUser
    },

    async deleteUser(userId) {
      const db = readDb()
      db.users = db.users.filter((u) => u.id !== userId)
      db.accounts = db.accounts.filter((a) => a.userId !== userId)
      db.sessions = db.sessions.filter((s) => s.userId !== userId)
      writeDb(db)
    },

    async linkAccount(account: AdapterAccount) {
      const db = readDb()
      db.accounts.push({
        id: crypto.randomUUID(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token ?? null,
        access_token: account.access_token ?? null,
        expires_at: account.expires_at ?? null,
        token_type: account.token_type ?? null,
        scope: account.scope ?? null,
        id_token: account.id_token ?? null,
        session_state: (account.session_state as string) ?? null,
      })
      writeDb(db)
      return account
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const db = readDb()
      db.accounts = db.accounts.filter(
        (a) => !(a.provider === provider && a.providerAccountId === providerAccountId)
      )
      writeDb(db)
    },

    async createSession(session) {
      const db = readDb()
      const newSession = {
        id: crypto.randomUUID(),
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires.toISOString(),
      }
      db.sessions.push(newSession)
      writeDb(db)
      return {
        ...newSession,
        expires: new Date(newSession.expires),
      } as AdapterSession
    },

    async getSessionAndUser(sessionToken) {
      const db = readDb()
      const session = db.sessions.find((s) => s.sessionToken === sessionToken)
      if (!session) return null
      const user = db.users.find((u) => u.id === session.userId)
      if (!user) return null
      return {
        session: { ...session, expires: new Date(session.expires) } as AdapterSession,
        user: {
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        } as AdapterUser,
      }
    },

    async updateSession(session) {
      const db = readDb()
      const idx = db.sessions.findIndex((s) => s.sessionToken === session.sessionToken)
      if (idx === -1) return null
      if (session.expires) {
        db.sessions[idx].expires = session.expires.toISOString()
      }
      writeDb(db)
      return {
        ...db.sessions[idx],
        expires: new Date(db.sessions[idx].expires),
      } as AdapterSession
    },

    async deleteSession(sessionToken) {
      const db = readDb()
      db.sessions = db.sessions.filter((s) => s.sessionToken !== sessionToken)
      writeDb(db)
    },

    async createVerificationToken(verificationToken) {
      const db = readDb()
      const token = {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires.toISOString(),
      }
      db.verificationTokens.push(token)
      writeDb(db)
      return {
        ...token,
        expires: new Date(token.expires),
      } as VerificationToken
    },

    async useVerificationToken({ identifier, token }) {
      const db = readDb()
      const idx = db.verificationTokens.findIndex(
        (t) => t.identifier === identifier && t.token === token
      )
      if (idx === -1) return null
      const [removed] = db.verificationTokens.splice(idx, 1)
      writeDb(db)
      return {
        ...removed,
        expires: new Date(removed.expires),
      } as VerificationToken
    },
  }
}
