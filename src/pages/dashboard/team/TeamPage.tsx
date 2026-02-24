import React, { useEffect, useState } from 'react';
import { teamService } from '@/services/team.service';
import type { TeamMember } from '@/types/team';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Shield, User, RefreshCw } from 'lucide-react';

const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getTeamMembers();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-full">
          <RefreshCw className="size-8" />
        </div>
        <h2 className="text-xl font-semibold">{error}</h2>
        <Button onClick={fetchTeam} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground text-sm">
            Manage your team and their permissions.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="size-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg dark:hover:bg-accent/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="size-12 rounded-full border-2 border-background shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                    {member.role === 'admin' ? (
                      <Shield className="size-3 text-primary fill-primary/10" />
                    ) : (
                      <User className="size-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="size-3" />
                    {member.email}
                  </div>
                </div>
              </div>
              <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                {member.role}
              </Badge>
            </div>
            
            <div className="mt-6 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Edit Role
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
