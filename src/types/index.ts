export type Role = 'HR' | 'MANAGER' | 'EMPLOYEE'

export type AppraisalStatus =
  | 'PENDING'
  | 'EMPLOYEE_DRAFT'
  | 'SELF_SUBMITTED'
  | 'MANAGER_DRAFT'
  | 'MANAGER_REVIEWED'
  | 'APPROVED'
  | 'ACKNOWLEDGED'

export type CycleStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED'
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type FeedbackType = 'SELF' | 'PEER' | 'MANAGER'
export type NotificationType =
  | 'CYCLE_STARTED'
  | 'APPRAISAL_DUE'
  | 'SELF_ASSESSMENT_SUBMITTED'
  | 'MANAGER_REVIEW_DONE'
  | 'APPRAISAL_APPROVED'
  | 'FEEDBACK_RECEIVED'
  | 'GENERAL'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface User {
  id: number
  fullName: string
  email: string
  role: Role
  secondaryRole?: Role
  jobTitle: string
  departmentName: string | null
  managerId: number | null
  managerName: string | null
  isActive: boolean
  createdAt: string
}

export interface Department {
  id: number
  name: string
  description: string
}

export interface Appraisal {
  id: number
  cycleName: string
  cycleStartDate: string
  cycleEndDate: string
  cycleStatus: CycleStatus
  employeeId: number
  employeeName: string
  employeeJobTitle: string
  employeeDepartment: string | null
  managerId: number
  managerName: string
  whatWentWell: string | null
  whatToImprove: string | null
  achievements: string | null
  selfRating: number | null
  managerStrengths: string | null
  managerImprovements: string | null
  managerComments: string | null
  managerRating: number | null
  hrComments: string | null
  appraisalStatus: AppraisalStatus
  submittedAt: string | null
  approvedAt: string | null
  createdAt: string
}

export interface Goal {
  id: number
  appraisalId: number
  employeeId: number
  employeeName: string
  title: string
  description: string
  progressPercent: number
  status: GoalStatus
  dueDate: string
  managerRemarks?: string
  employeeRemarks?: string
}

export interface Feedback {
  id: number
  appraisalId: number
  reviewerId: number
  reviewerName: string
  revieweeId: number
  revieweeName: string
  comments: string
  rating: number
  feedbackType: FeedbackType
  createdAt: string
}

export interface Notification {
  id: number
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export interface CreateAppraisalRequest {
  cycleName: string
  cycleStartDate: string
  cycleEndDate: string
  employeeId: number
  managerId: number
}

export interface BulkCycleRequest {
  cycleName: string
  cycleStartDate: string
  cycleEndDate: string
  departmentId?: number
}

export interface SelfAssessmentRequest {
  whatWentWell: string
  whatToImprove: string
  achievements: string
  selfRating: number
}

export interface ManagerReviewRequest {
  managerStrengths: string
  managerImprovements: string
  managerComments: string
  managerRating: number
}

export interface CycleSummaryResponse {
  cycleName: string
  totalAppraisals: number
  pendingCount: number
  completedCount: number
  completionPercentage: number
  averageRating: number
}

export interface DepartmentReportResponse {
  departmentName: string
  totalEmployees: number
  completedAppraisals: number
  averageRating: number
}

export interface RatingDistributionResponse {
  cycleName: string
  ratingCounts: Record<string, number>
}

export interface PendingReportResponse {
  cycleName: string
  pendingEmployeeAction: number
  pendingManagerAction: number
  pendingHrAction: number
  totalPending: number
}

export interface TeamReportResponse {
  managerName: string
  teamSize: number
  completedAppraisals: number
  teamAverageRating: number
}

export interface EmployeeHistoryResponse {
  employeeId: number
  employeeName: string
  historicalAppraisals: Appraisal[]
}
