import { Select, Table, Empty } from 'antd';
import { useMemo, useState } from 'react';
import { useBuildings } from '../features/buildings/useBuildings';
import { useDepartments } from '../features/departments/useDepartments';
import { useEmployeesByBuilding } from '../features/reports/useQueries';

export default function EmployeesByBuildingPage() {
  const { list: bldList } = useBuildings();
  const { list: depList } = useDepartments(); // para mostrar nombre de dependencia actual
  const [bldId, setBldId] = useState<number | undefined>(undefined);
  const { data, isLoading } = useEmployeesByBuilding(bldId);

  const bldOptions = useMemo(
    () => (bldList.data || []).map(b => ({
      label: `${b.name} — ${b.street} ${b.number}${b.floor ? `, Piso ${b.floor}` : ''}`,
      value: b.id!
    })),
    [bldList.data]
  );

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Empleados por Edificio</h2>
      <div style={{ maxWidth: 640, marginBottom: 16 }}>
        <Select
          showSearch
          placeholder="Elegí un edificio"
          options={bldOptions}
          onChange={(v) => setBldId(v)}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            (option?.label as string).toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      {!bldId ? (
        <Empty description="Seleccioná un edificio" />
      ) : (
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={data || []}
          columns={[
            { title: 'Legajo', dataIndex: 'legajo' },
            { title: 'Apellido', dataIndex: 'lastName' },
            { title: 'Nombre', dataIndex: 'firstName' },
            { title: 'DNI', dataIndex: 'dni' },
            {
              title: 'Dependencia actual',
              render: (_: any, r: any) => {
                const dep = (depList.data || []).find(d => d.id === r.currentDepartmentId);
                return dep ? dep.name : '—';
              }
            }
          ]}
        />
      )}
    </div>
  );
}
