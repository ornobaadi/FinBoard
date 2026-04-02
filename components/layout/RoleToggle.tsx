"use client"

import { Shield, UserRound } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/store/useAppStore"

export function RoleToggle() {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const roleLabel = role === "admin" ? "Admin" : "Viewer"

  return (
    <Select value={role} onValueChange={(value) => setRole(value as "viewer" | "admin")}>
      <SelectTrigger className="w-[156px] bg-card" aria-label="Select user role">
        <SelectValue placeholder="Role">{roleLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">
          <UserRound className="size-4" /> Viewer
        </SelectItem>
        <SelectItem value="admin">
          <Shield className="size-4" /> Admin
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
