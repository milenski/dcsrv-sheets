import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Crown,
  MailPlus,
  MoreHorizontal,
  Shield,
  User as UserIcon,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUsage } from "@/hooks/useUsage";
import { planHasTeam } from "@/lib/plans";
import {
  canAccessBilling,
  canAccessTeam,
  canTransferOwnership,
  type AppRole,
  useRole,
} from "@/hooks/useRole";
import { PermissionRequired } from "@/components/app/PermissionRequired";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

type TeamRole = "owner" | "admin" | "member";
type MemberStatus = "active" | "invited";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
};

const inviteSchema = z.object({
  email: z.string().trim().email().max(255),
  role: z.enum(["admin", "member"]),
});

export default function Team() {
  const navigate = useNavigate();
  const { plan } = useUsage();
  const teamEnabled = useMemo(() => planHasTeam(plan), [plan]);
  const { role: currentUserRole } = useRole();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferToUserId, setTransferToUserId] = useState<string>("");

  const [members, setMembers] = useState<TeamMember[]>([
    { id: "u-owner", name: "You", email: "you@company.com", role: "owner", status: "active" },
    { id: "u-admin", name: "Ava Miller", email: "ava@company.com", role: "admin", status: "active" },
    { id: "u-member", name: "Ben Park", email: "ben@company.com", role: "member", status: "active" },
    { id: "u-invited", name: "Pending", email: "newhire@company.com", role: "member", status: "invited" },
  ]);

  const effectiveRole = useMemo((): TeamRole => {
    if (currentUserRole === "owner") return "owner";
    if (currentUserRole === "admin") return "admin";
    return "member";
  }, [currentUserRole]);

  const canManage = canAccessTeam(currentUserRole);
  const canTransfer = canTransferOwnership(currentUserRole);
  const canSeeBilling = canAccessBilling(currentUserRole);

  if (!teamEnabled) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader
          title="Team collaboration (Standard & Pro)"
          description="Invite teammates, assign roles, and collaborate on templates and document processing."
        />

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Upgrade to unlock Team</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <MailPlus className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Invite colleagues</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Assign Admin and Member roles</span>
              </li>
              <li className="flex items-start gap-2">
                <UserIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Collaborate on templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Crown className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span>Control access</span>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/app/billing")}>Upgrade plan</Button>
              <Button variant="outline" onClick={() => navigate("/pricing")}>View plans</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAccessTeam(currentUserRole)) {
    return (
      <PermissionRequired
        description="Team management is available to Owners and Admins. Members can run extractions and view results, but can’t manage teammates."
        actions={
          <Button asChild variant="outline">
            <Link to="/app">Back to Dashboard</Link>
          </Button>
        }
      />
    );
  }

  const admins = members.filter((m) => m.status === "active" && m.role === "admin");
  const owner = members.find((m) => m.role === "owner");

  const handleInvite = () => {
    const parsed = inviteSchema.safeParse({ email: inviteEmail, role: inviteRole });
    if (!parsed.success) {
      toast.error("Please enter a valid email and role");
      return;
    }

    const exists = members.some((m) => m.email.toLowerCase() === parsed.data.email.toLowerCase());
    if (exists) {
      toast.error("This email is already on your team");
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        name: "Pending",
        email: parsed.data.email,
        role: parsed.data.role,
        status: "invited",
      },
    ]);
    setInviteEmail("");
    setInviteRole("member");
    toast.success("Invite sent");
  };

  const handleChangeRole = (memberId: string, nextRole: TeamRole) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: nextRole } : m)));
    toast.success("Role updated");
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success("Member removed");
  };

  const handleResendInvite = () => toast.success("Invite resent");

  const handleCancelInvite = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success("Invite cancelled");
  };

  const openTransfer = () => {
    setTransferToUserId(admins[0]?.id || "");
    setTransferOpen(true);
  };

  const confirmTransfer = () => {
    if (!transferToUserId) return;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.role === "owner") return { ...m, role: "admin" };
        if (m.id === transferToUserId) return { ...m, role: "owner" };
        return m;
      })
    );
    setTransferOpen(false);
    toast.success("Ownership transferred");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Team"
        description="Invite teammates and collaborate on templates and document processing."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">You are an <span className="capitalize">{effectiveRole}</span></Badge>
            {canTransfer ? (
              <Button variant="outline" onClick={openTransfer}>
                Transfer ownership
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="outline" disabled>
                      Transfer ownership
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>This action is only available to Owners.</TooltipContent>
              </Tooltip>
            )}
            {canSeeBilling ? (
              <Button onClick={() => navigate("/app/billing")} variant="outline">
                Manage billing
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="outline" disabled>
                      Manage billing
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>This action is only available to Owners.</TooltipContent>
              </Tooltip>
            )}
          </div>
        }
      />

      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Invite a teammate</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "admin" | "member")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Owner cannot be invited.</p>
            </div>

            <Button onClick={handleInvite} disabled={!inviteEmail}>
              <MailPlus className="w-4 h-4 mr-2" />
              Send invite
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Name</TableHead>
                    <TableHead className="w-[220px]">Email</TableHead>
                    <TableHead className="w-[180px]">Role</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[60px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => {
                    const isOwnerRow = m.role === "owner";
                    const isInvited = m.status === "invited";
                    const canEditRole = canManage && !isOwnerRow;
                    const canRemove = canManage && !isOwnerRow;

                    return (
                      <TableRow 
                        key={m.id} 
                        className={cn(
                          isInvited && "bg-muted/30",
                          isOwnerRow && "bg-accent/30"
                        )}
                      >
                        <TableCell className="font-medium align-middle">
                          <div className="flex items-center gap-2">
                            {m.name}
                            {isOwnerRow && (
                              <Badge variant="default" className="text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Owner
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={cn("align-middle", isInvited ? "text-muted-foreground/70" : "text-muted-foreground")}>
                          {m.email}
                        </TableCell>
                        <TableCell className="align-middle">
                          {isOwnerRow ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <Shield className="w-4 h-4" />
                                  Owner (locked)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Only the owner can transfer ownership.</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Select
                              value={m.role}
                              onValueChange={(v) => handleChangeRole(m.id, v as TeamRole)}
                              disabled={!canEditRole}
                            >
                              <SelectTrigger className="w-[130px] h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell className="align-middle">
                          <Badge 
                            variant={m.status === "active" ? "secondary" : "outline"}
                            className={cn(isInvited && "text-muted-foreground border-dashed")}
                          >
                            {m.status === "active" ? "Active" : "Invited"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {m.status === "invited" ? (
                                <>
                                  <DropdownMenuItem onClick={handleResendInvite} disabled={!canManage}>
                                    Resend invite
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCancelInvite(m.id)} disabled={!canManage}>
                                    Cancel invite
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  {!isOwnerRow && (
                                    <DropdownMenuItem
                                      onClick={() => handleRemoveMember(m.id)}
                                      disabled={!canRemove}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      Remove member
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}

                              {isOwnerRow && (
                                <>
                                  <DropdownMenuItem disabled className="text-muted-foreground">
                                    Owner role is locked
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer ownership</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Select a new owner from your active admins. You will become an Admin.
              </p>

              <div className="space-y-2">
                <Label>New owner</Label>
                <Select value={transferToUserId} onValueChange={setTransferToUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={admins.length ? "Select an admin" : "No admins available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} ({a.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <p className="font-medium">Current owner</p>
                <p className="text-muted-foreground">{owner ? `${owner.name} (${owner.email})` : "—"}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTransferOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmTransfer} disabled={!transferToUserId || admins.length === 0}>
                Confirm transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
