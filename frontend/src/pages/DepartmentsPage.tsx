import { Button, Form, Input, Modal, Popconfirm, Select, Table, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDepartments, type Department } from '../features/departments/useDepartments';
import { useBuildings } from '../features/buildings/useBuildings';

export default function DepartmentsPage() {
  const { list: depList, create, update, remove } = useDepartments();
  const { list: bldList } = useBuildings();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form] = Form.useForm<Department>();

  const buildingOptions = useMemo(() =>
    (bldList.data || []).map(b => ({ label: b.name, value: b.id! })), [bldList.data]);

  useEffect(() => { if (editing) form.setFieldsValue(editing); }, [editing]);

  const onCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const onEdit = (row: Department) => { setEditing(row); setOpen(true); };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing?.id) await update.mutateAsync({ ...editing, ...values });
      else await create.mutateAsync(values);
      setOpen(false);
      message.success('Guardado');
    } catch {}
  };

  const onDelete = async (id: number) => {
    await remove.mutateAsync(id);
    message.success('Eliminado');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ margin: 0 }}>Dependencias</h2>
        <Button type="primary" onClick={onCreate}>Nueva</Button>
      </div>
      <Table
        rowKey="id"
        loading={depList.isLoading}
        dataSource={depList.data || []}
        columns={[
          { title: 'Nombre', dataIndex: 'name' },
          { title: 'Oficina', dataIndex: 'officeNumber' },
          {
            title: 'Edificio',
            render: (_: any, row: Department) => {
              const match = (bldList.data || []).find(b => b.id === row.buildingId);
              return match ? match.name : row.buildingId;
            }
          },
          {
            title: 'Acciones',
            render: (_: any, row: Department) => (
              <>
                <Button size="small" onClick={() => onEdit(row)} style={{ marginRight: 8 }}>Editar</Button>
                <Popconfirm title="¿Eliminar?" onConfirm={() => onDelete(row.id!)}>
                  <Button size="small" danger>Eliminar</Button>
                </Popconfirm>
              </>
            )
          }
        ]}
      />

      <Modal
        open={open}
        title={editing ? 'Editar dependencia' : 'Nueva dependencia'}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
        confirmLoading={create.isPending || update.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="officeNumber" label="N° de oficina" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="buildingId" label="Edificio" rules={[{ required: true }]}>
            <Select
              options={buildingOptions}
              loading={bldList.isLoading}
              placeholder="Seleccioná un edificio"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
