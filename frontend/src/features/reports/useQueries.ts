import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export type EmployeeDto = {
  id: number;
  legajo: string;
  firstName: string;
  lastName: string;
  dni: string;
  currentDepartmentId: number | null;
};

export function useEmployeesByDepartment(depId?: number) {
  return useQuery({
    queryKey: ['reports', 'by-department', depId],
    queryFn: async () =>
      (await api.get<EmployeeDto[]>(`/query/departments/${depId}/employees`)).data,
    enabled: !!depId,
  });
}

export function useEmployeesByBuilding(bldId?: number) {
  return useQuery({
    queryKey: ['reports', 'by-building', bldId],
    queryFn: async () =>
      (await api.get<EmployeeDto[]>(`/query/buildings/${bldId}/employees`)).data,
    enabled: !!bldId,
  });
}
