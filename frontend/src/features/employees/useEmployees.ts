import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export type Employee = {
  id?: number;
  legajo: string;
  firstName: string;
  lastName: string;
  dni: string;
  currentDepartmentId?: number | null;
};

export function useEmployees() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ['employees'],
    queryFn: async () => (await api.get<Employee[]>('/employees')).data,
  });

  const create = useMutation({
    mutationFn: async (e: Employee) => (await api.post('/employees', e)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });

  const update = useMutation({
    mutationFn: async (e: Employee) => (await api.put(`/employees/${e.id}`, e)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/employees/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });

  const assign = useMutation({
    mutationFn: async (params: { empId: number; depId: number }) =>
      (await api.post(`/departments/${params.depId}/employees/${params.empId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });

  return { list, create, update, remove, assign };
}

// ...lo existente arriba
export function useMoveEmployee() {
  return useMutation({
    mutationFn: async (p: { employeeId: number; toDepartmentId: number }) =>
      (await api.post(`/employees/${p.employeeId}/move`, { toDepartmentId: p.toDepartmentId })).data,
  });
}

export type MoveRecord = {
  departmentId: number;
  departmentName: string;
  buildingId: number;
  buildingName: string;
  fromTs: string;
  toTs: string | null;
};
export function useEmployeeMoves(employeeId: number) {
  return useQuery({
    queryKey: ['employee-moves', employeeId],
    queryFn: async () => (await api.get<MoveRecord[]>(`/employees/${employeeId}/moves`)).data,
    enabled: !!employeeId,
  });
}

