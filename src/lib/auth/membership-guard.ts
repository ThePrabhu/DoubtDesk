export const ROLE_HIERARCHY = {
  owner: 5,
  admin: 5,
  teacher: 4,
  "co-teacher": 3,
  moderator: 2,
  student: 1,
} as const;

export function hasRole(role: string, required: string) {
  if (!(role in ROLE_HIERARCHY) || !(required in ROLE_HIERARCHY)) {
    return false;
  }

  return (
    ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] >=
    ROLE_HIERARCHY[required as keyof typeof ROLE_HIERARCHY]
  );
}

export function canModerate(role: string) {
  return hasRole(role, "moderator");
}

export function canTeach(role: string) {
  return hasRole(role, "teacher");
}
