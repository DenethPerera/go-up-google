import { ApprovalStatus } from "../types";

export const APPROVAL_STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  approved: { label: "Approved", bgClass: "bg-[#e7f9ee]", textClass: "text-[#16803c]", dotClass: "bg-chart-4" },
  pending: { label: "Pending Review", bgClass: "bg-[#fef3e2]", textClass: "text-[#b45309]", dotClass: "bg-chart-5" },
  rejected: { label: "Rejected", bgClass: "bg-[#fde8e8]", textClass: "text-destructive", dotClass: "bg-destructive" },
};