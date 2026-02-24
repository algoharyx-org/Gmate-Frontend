export type TeamRole = 'admin' | 'member';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
}
