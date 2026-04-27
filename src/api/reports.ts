import api from './axios'
import type { 
  ApiResponse, 
  CycleSummaryResponse, 
  DepartmentReportResponse, 
  RatingDistributionResponse, 
  PendingReportResponse, 
  TeamReportResponse, 
  EmployeeHistoryResponse 
} from '../types'

export const getCycleSummary = (cycleName: string) =>
  api.get<ApiResponse<CycleSummaryResponse>>(`/api/reports/cycle/${cycleName}/summary`).then(r => r.data.data)

export const getDepartmentReport = (cycleName: string) =>
  api.get<ApiResponse<DepartmentReportResponse[]>>(`/api/reports/cycle/${cycleName}/departments`).then(r => r.data.data)

export const getRatingDistribution = (cycleName: string) =>
  api.get<ApiResponse<RatingDistributionResponse>>(`/api/reports/cycle/${cycleName}/ratings`).then(r => r.data.data)

export const getPendingReport = (cycleName: string) =>
  api.get<ApiResponse<PendingReportResponse>>(`/api/reports/cycle/${cycleName}/pending`).then(r => r.data.data)

export const getTeamReport = (managerId: number, cycleName: string) =>
  api.get<ApiResponse<TeamReportResponse>>(`/api/reports/manager/${managerId}/team/${cycleName}`).then(r => r.data.data)

export const getEmployeeHistory = (employeeId: number) =>
  api.get<ApiResponse<EmployeeHistoryResponse>>(`/api/reports/employee/${employeeId}/history`).then(r => r.data.data)
