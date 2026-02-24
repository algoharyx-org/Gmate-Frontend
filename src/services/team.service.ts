import type { TeamMember } from '../types/team';

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah@gmate.dev',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@gmate.dev',
    role: 'member',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@gmate.dev',
    role: 'member',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const teamService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    await delay(1000); // Simulate network latency
    // Simulate random error (optional, but requested robust logic)
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch team members');
    }
    return [...mockTeam];
  },

  async inviteMember(email: string, role: TeamMember['role']): Promise<TeamMember> {
    await delay(1500);
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    return newMember;
  },
};
