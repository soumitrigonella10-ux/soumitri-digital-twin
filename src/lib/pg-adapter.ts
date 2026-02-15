import type { Adapter, AdapterUser, AdapterSession, VerificationToken, AdapterAccount } from "next-auth/adapters"
import type { Pool } from "pg"
import crypto from "crypto"

/**
 * Custom PostgreSQL adapter for NextAuth v4, using pg Pool directly.
 * Replaces @auth/pg-adapter to avoid ESM-only import issues with Next.js 14.
 */
export default function CustomPgAdapter(pool: Pool): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO users (id, name, email, "emailVerified", image)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name, email, "emailVerified", image`,
          [crypto.randomUUID(), user.name ?? null, user.email, user.emailVerified ?? null, user.image ?? null]
        )
        return mapUser(rows[0])
      } catch (error) {
        console.error('[pg-adapter] createUser failed:', error)
        throw error
      }
    },

    async getUser(id) {
      try {
        const { rows } = await pool.query(
          `SELECT id, name, email, "emailVerified", image FROM users WHERE id = $1`,
          [id]
        )
        return rows.length ? mapUser(rows[0]) : null
      } catch (error) {
        console.error('[pg-adapter] getUser failed:', error)
        throw error
      }
    },

    async getUserByEmail(email) {
      try {
        const { rows } = await pool.query(
          `SELECT id, name, email, "emailVerified", image FROM users WHERE email = $1`,
          [email]
        )
        return rows.length ? mapUser(rows[0]) : null
      } catch (error) {
        console.error('[pg-adapter] getUserByEmail failed:', error)
        throw error
      }
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { rows } = await pool.query(
        `SELECT u.id, u.name, u.email, u."emailVerified", u.image
         FROM users u
         JOIN accounts a ON u.id = a."userId"
         WHERE a.provider = $1 AND a."providerAccountId" = $2`,
        [provider, providerAccountId]
      )
      return rows.length ? mapUser(rows[0]) : null
    },

    async updateUser(user) {
      const fields: string[] = []
      const values: unknown[] = []
      let idx = 1

      if (user.name !== undefined) { fields.push(`name = $${idx++}`); values.push(user.name) }
      if (user.email !== undefined) { fields.push(`email = $${idx++}`); values.push(user.email) }
      if (user.emailVerified !== undefined) { fields.push(`"emailVerified" = $${idx++}`); values.push(user.emailVerified) }
      if (user.image !== undefined) { fields.push(`image = $${idx++}`); values.push(user.image) }

      values.push(user.id)
      const { rows } = await pool.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx}
         RETURNING id, name, email, "emailVerified", image`,
        values
      )
      return mapUser(rows[0])
    },

    async deleteUser(userId) {
      await pool.query(`DELETE FROM users WHERE id = $1`, [userId])
    },

    async linkAccount(account: AdapterAccount) {
      await pool.query(
        `INSERT INTO accounts (id, "userId", type, provider, "providerAccountId",
         refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          crypto.randomUUID(),
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token ?? null,
          account.access_token ?? null,
          account.expires_at ?? null,
          account.token_type ?? null,
          account.scope ?? null,
          account.id_token ?? null,
          (account.session_state as string) ?? null,
        ]
      )
      return account as AdapterAccount
    },

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      await pool.query(
        `DELETE FROM accounts WHERE provider = $1 AND "providerAccountId" = $2`,
        [provider, providerAccountId]
      )
    },

    async createSession(session) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO sessions (id, "sessionToken", "userId", expires)
           VALUES ($1, $2, $3, $4)
           RETURNING id, "sessionToken", "userId", expires`,
          [crypto.randomUUID(), session.sessionToken, session.userId, session.expires]
        )
        return mapSession(rows[0])
      } catch (error) {
        console.error('[pg-adapter] createSession failed:', error)
        throw error
      }
    },

    async getSessionAndUser(sessionToken) {
      try {
        const { rows } = await pool.query(
          `SELECT s.id as sid, s."sessionToken", s."userId", s.expires,
                  u.id, u.name, u.email, u."emailVerified", u.image
           FROM sessions s
           JOIN users u ON s."userId" = u.id
           WHERE s."sessionToken" = $1`,
          [sessionToken]
        )
        if (!rows.length) return null
        const row = rows[0]
        return {
          session: {
            sessionToken: row.sessionToken,
            userId: row.userId,
            expires: new Date(row.expires),
          } as AdapterSession,
          user: mapUser(row),
        }
      } catch (error) {
        console.error('[pg-adapter] getSessionAndUser failed:', error)
        throw error
      }
    },

    async updateSession(session) {
      const { rows } = await pool.query(
        `UPDATE sessions SET expires = $1
         WHERE "sessionToken" = $2
         RETURNING id, "sessionToken", "userId", expires`,
        [session.expires, session.sessionToken]
      )
      return rows.length ? mapSession(rows[0]) : null
    },

    async deleteSession(sessionToken) {
      await pool.query(
        `DELETE FROM sessions WHERE "sessionToken" = $1`,
        [sessionToken]
      )
    },

    async createVerificationToken(verificationToken) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO verification_token (identifier, token, expires)
           VALUES ($1, $2, $3)
           RETURNING identifier, token, expires`,
          [verificationToken.identifier, verificationToken.token, verificationToken.expires]
        )
        return mapVerificationToken(rows[0])
      } catch (error) {
        console.error('[pg-adapter] createVerificationToken failed:', error)
        throw error
      }
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const { rows } = await pool.query(
          `DELETE FROM verification_token
           WHERE identifier = $1 AND token = $2
           RETURNING identifier, token, expires`,
          [identifier, token]
        )
        return rows.length ? mapVerificationToken(rows[0]) : null
      } catch (error) {
        console.error('[pg-adapter] useVerificationToken failed:', error)
        throw error
      }
    },
  }
}

function mapUser(row: Record<string, unknown>): AdapterUser {
  return {
    id: row.id as string,
    name: (row.name as string) ?? null,
    email: row.email as string,
    emailVerified: row.emailVerified ? new Date(row.emailVerified as string) : null,
    image: (row.image as string) ?? null,
  }
}

function mapSession(row: Record<string, unknown>): AdapterSession {
  return {
    sessionToken: row.sessionToken as string,
    userId: row.userId as string,
    expires: new Date(row.expires as string),
  }
}

function mapVerificationToken(row: Record<string, unknown>): VerificationToken {
  return {
    identifier: row.identifier as string,
    token: row.token as string,
    expires: new Date(row.expires as string),
  }
}
