import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export type Building = {
  id?: number;
  name: string;
  street: string;
  number: string;
  floor?: string | null;
};

export function useBuildings() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => (await api.get<Building[]>('/buildings')).data,
  });

  const create = useMutation({
    mutationFn: async (b: Building) => (await api.post('/buildings', b)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  });

  const update = useMutation({
    mutationFn: async (b: Building) => (await api.put(`/buildings/${b.id}`, b)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  });

  const remove = useMutation({
  mutationFn: async (id: number) => (await api.delete(`/buildings/${id}`)).data,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['buildings'] }),
  retry: false, // 👈 importante para 409/404
});

  return { list, create, update, remove };
}
