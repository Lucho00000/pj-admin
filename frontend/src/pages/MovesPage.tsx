import { Card, Empty, List, Select, Tag } from 'antd';
import { useState, useMemo } from 'react';
import { useEmployees } from '../features/employees/useEmployees';
import { useEmployeeMoves } from '../features/employees/useEmployees';
import dayjs from 'dayjs';

export default function MovesPage() {
  const { list: empList } = useEmployees();
  const options = useMemo(() =>
    (empList.data || []).map(e => ({ label: `${e.lastName}, ${e.firstName} (Legajo ${e.legajo})`, value: e.id! })), [empList.data]);

  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const { data, isLoading } = useEmployeeMoves(selectedId || 0);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Historial de traslados</h2>
      <div style={{ maxWidth: 520, marginBottom: 16 }}>
        <Select
          showSearch
          placeholder="Elegí un empleado"
          options={options}
          onChange={(v) => setSelectedId(v)}
          style={{ width: '100%' }}
          filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
        />
      </div>

      {(!selectedId) ? <Empty description="Seleccioná un empleado" /> :
       isLoading ? <p>Cargando...</p> :
       (data && data.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(m) => (
              <List.Item>
                <Card>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{m.departmentName}</div>
                      <div style={{ opacity: 0.7 }}>Edificio: {m.buildingName}</div>
                    </div>
                    <div>
                      <Tag>{dayjs(m.fromTs).format('DD/MM/YYYY HH:mm')} → {m.toTs ? dayjs(m.toTs).format('DD/MM/YYYY HH:mm') : 'actualidad'}</Tag>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
       ) : <Empty description="Sin movimientos registrados" />)}
    </div>
  );
}
