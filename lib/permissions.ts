export type UserRole =
  | "super_admin"
  | "admin"
  | "section_leader"
  | "welfare_leader"
  | "media_team"
  | "member";

export const adminRoles: UserRole[] = [
  "super_admin",
  "admin",
  "section_leader",
  "welfare_leader",
  "media_team",
];

export const fullAdminRoles: UserRole[] = ["super_admin", "admin"];

export const memberManagementRoles: UserRole[] = [
  "super_admin",
  "admin",
  "section_leader",
  "welfare_leader",
];

export const attendanceRoles: UserRole[] = [
  "super_admin",
  "admin",
  "section_leader",
];

export const welfareRoles: UserRole[] = [
  "super_admin",
  "admin",
  "welfare_leader",
];

export const mediaRoles: UserRole[] = [
  "super_admin",
  "admin",
  "media_team",
];

export const announcementRoles: UserRole[] = ["super_admin", "admin"];

export const rehearsalRoles: UserRole[] = ["super_admin", "admin"];

export function canAccessRole(userRole: string | null, allowedRoles: UserRole[]) {
  if (!userRole) return false;

  return allowedRoles.includes(userRole as UserRole);
}