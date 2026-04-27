import api from './axios'
import type { ApiResponse, Appraisal, CreateAppraisalRequest, BulkCycleRequest, SelfAssessmentRequest, ManagerReviewRequest } from '../types'

export const createAppraisal = (data: CreateAppraisalRequest) =>
  api.post<ApiResponse<Appraisal>>('/api/appraisals', data).then(r => r.data.data)

export const createBulkCycle = (data: BulkCycleRequest) =>
  api.post<ApiResponse<any>>('/api/appraisals/cycle/bulk-create', data).then(r => r.data.data)

export const getMyAppraisals = (employeeId: number) =>
  api.get<ApiResponse<Appraisal[]>>(`/api/appraisals/my?employeeId=${employeeId}`).then(r => r.data.data)

export const getTeamAppraisals = (managerId: number) =>
  api.get<ApiResponse<Appraisal[]>>(`/api/appraisals/team?managerId=${managerId}`).then(r => r.data.data)

export const getAllAppraisals = () =>
  api.get<ApiResponse<Appraisal[]>>('/api/appraisals/all').then(r => r.data.data)

export const getAppraisalById = (id: number, requesterId: number) =>
  api.get<ApiResponse<Appraisal>>(`/api/appraisals/${id}?requesterId=${requesterId}`).then(r => r.data.data)

export const saveSelfAssessmentDraft = (id: number, employeeId: number, data: SelfAssessmentRequest) =>
  api.put<ApiResponse<Appraisal>>(`/api/appraisals/${id}/self-assessment/draft?employeeId=${employeeId}`, data).then(r => r.data.data)

export const submitSelfAssessment = (id: number, employeeId: number, data: SelfAssessmentRequest) =>
  api.put<ApiResponse<Appraisal>>(`/api/appraisals/${id}/self-assessment/submit?employeeId=${employeeId}`, data).then(r => r.data.data)

export const saveManagerReviewDraft = (id: number, managerId: number, data: ManagerReviewRequest) =>
  api.put<ApiResponse<Appraisal>>(`/api/appraisals/${id}/manager-review/draft?managerId=${managerId}`, data).then(r => r.data.data)

export const submitManagerReview = (id: number, managerId: number, data: ManagerReviewRequest) =>
  api.put<ApiResponse<Appraisal>>(`/api/appraisals/${id}/manager-review/submit?managerId=${managerId}`, data).then(r => r.data.data)

export const approveAppraisal = (id: number, hrComments: string) =>
  api.patch<ApiResponse<Appraisal>>(`/api/appraisals/${id}/approve`, null, { params: { hrComments } }).then(r => r.data.data)

export const acknowledgeAppraisal = (id: number, employeeId: number) =>
  api.patch<ApiResponse<Appraisal>>(`/api/appraisals/${id}/acknowledge?employeeId=${employeeId}`).then(r => r.data.data)
