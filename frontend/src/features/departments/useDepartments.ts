import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export type Department = {
  id?: number;
  name: string;
  officeNumber: string;
  buildingId: number;
};

export function useDepartments() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ['departments'],
    queryFn: async () => (await api.get<Department[]>('/departments')).data,
  });

  const create = useMutation({
    mutationFn: async (d: Department) => (await api.post('/departments', d)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });

  const update = useMutation({
    mutationFn: async (d: Department) => (await api.put(`/departments/${d.id}`, d)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/departments/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });

  return { list, create, update, remove };
}
