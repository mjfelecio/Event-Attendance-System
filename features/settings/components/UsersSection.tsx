"use client";

import { useMemo, useState } from "react";

import DataTable from "@/globals/components/shared/dataTable/DataTable";
import {
  DataTableEmptyState,
  DataTableErrorState,
} from "@/globals/components/shared/dataTable/DataTableStates";
import StatusBadge from "@/globals/components/shared/StatusBadge";
import { type as typeToken } from "@/globals/constants/designTokens";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import { useConfirm } from "@/globals/contexts/ConfirmModalContext";
import {
  ManagedUser,
  TemporaryPasswordResult,
  useResetUserPassword,
  useUsers,
} from "@/globals/hooks/useAdmin";
import { getUserColumns } from "../constants/usersTable";
import TempPasswordDialog from "./TempPasswordDialog";

/**
 * The full user directory. Read-only apart from issuing a temporary password —
 * approving and rejecting pending organizers stays on the dashboard.
 */
const UsersSection = () => {
  const { data: users, isLoading, isError } = useUsers();
  const { mutateAsync: resetPassword } = useResetUserPassword();
  const confirm = useConfirm();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [issued, setIssued] = useState<TemporaryPasswordResult | null>(null);

  const rows = useMemo(() => users ?? [], [users]);
  const activeCount = rows.filter((user) => user.status === "ACTIVE").length;

  const handleResetPassword = async (user: ManagedUser) => {
    const confirmed = await confirm({
      title: `Reset ${user.name}'s password?`,
      description:
        "Their current password stops working immediately. You will be shown a temporary password to give them, once.",
    });
    if (!confirmed) return;

    setProcessingId(user.id);
    try {
      setIssued(await resetPassword(user.id));
      toastSuccess("Password reset", `${user.name} needs the new password.`);
    } catch (error) {
      toastDanger(
        "Couldn't reset password",
        error instanceof Error ? error.message : undefined,
      );
    } finally {
      setProcessingId(null);
    }
  };

  const columns = useMemo(
    () => getUserColumns({ onResetPassword: handleResetPassword, processingId }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processingId],
  );

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className={typeToken.sectionTitle}>Users</h2>
          <p className={typeToken.muted}>
            Everyone with an account. Approvals and rejections happen on the
            dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge>Total: {rows.length}</StatusBadge>
          <StatusBadge tone="success">Active: {activeCount}</StatusBadge>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        isError={isError}
        getRowId={(row) => row.id}
        showToolbar
        errorState={
          <DataTableErrorState
            title="Couldn't load users"
            description="Please retry."
          />
        }
        emptyState={<DataTableEmptyState title="No users yet" />}
      />

      <TempPasswordDialog result={issued} onClose={() => setIssued(null)} />
    </section>
  );
};

export default UsersSection;
