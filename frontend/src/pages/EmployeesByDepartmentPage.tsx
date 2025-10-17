import { Select, Table, Empty } from 'antd';
import { useMemo, useState } from 'react';
import { useDepartments } from '../features/departments/useDepartments';
import { useEmployeesByDepartment } from '../features/reports/useQueries';

export default function EmployeesByDepartmentPage() {
  const { list: depList } = useDepartments();
  const [depId, setDepId] = useState<number | undefined>(undefined);
  const { data, isLoading } = useEmployeesByDepartment(depId);

  const depOptions = useMemo(
    () => (depList.data || []).map(d => ({ label: `${d.name} (Of. ${d.officeNumber})`, value: d.id! })),
    [depList.data]
  );

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Empleados por Dependencia</h2>
      <div style={{ maxWidth: 520, marginBottom: 16 }}>
        <Select
          showSearch
          placeholder="Elegí una dependencia"
          options={depOptions}
          onChange={(v) => setDepId(v)}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            (option?.label as string).toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      {!depId ? (
        <Empty description="Seleccioná una dependencia" />
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
          ]}
        />
      )}
    </div>
  );
}
