"use client"

import { SessionProvider as AuthSessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  return (
    <AuthSessionProvider session={session ?? undefined}>
      {children}
    </AuthSessionProvider>
  )
}