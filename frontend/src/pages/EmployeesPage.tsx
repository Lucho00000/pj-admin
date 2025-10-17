import { Button, Form, Input, Modal, Popconfirm, Select, Table, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useEmployees, type Employee } from '../features/employees/useEmployees';
import { useDepartments } from '../features/departments/useDepartments';
import { useMoveEmployee } from '../features/employees/useEmployees';

export default function EmployeesPage() {
  const { list, create, update, remove, assign } = useEmployees();
  const { list: depList } = useDepartments();
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form] = Form.useForm<Employee>();
  const [assignForm] = Form.useForm<{ departmentId: number }>();
  const move = useMoveEmployee();
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveForm] = Form.useForm<{ toDepartmentId: number }>();

  useEffect(() => { if (editing) form.setFieldsValue(editing); }, [editing]);

  const depOptions = useMemo(() =>
    (depList.data || []).map(d => ({ label: `${d.name} (Edif#${d.buildingId})`, value: d.id! })), [depList.data]);

  const onCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const onEdit = (row: Employee) => { setEditing(row); setOpen(true); };
  const onAssign = (row: Employee) => {
    setSelected(row);
    assignForm.setFieldsValue({ departmentId: row.currentDepartmentId ?? undefined as any });
    setAssignOpen(true);
  };

  const submitEmployee = async () => {
    try {
      const values = await form.validateFields();
      if (editing?.id) await update.mutateAsync({ ...editing, ...values });
      else await create.mutateAsync(values);
      setOpen(false); message.success('Empleado guardado');
    } catch {}
  };

  const submitAssign = async () => {
    try {
      const { departmentId } = await assignForm.validateFields();
      await assign.mutateAsync({ empId: selected!.id!, depId: departmentId });
      setAssignOpen(false); message.success('Asignación realizada');
    } catch {}
  };

  const onDelete = async (id: number) => { await remove.mutateAsync(id); message.success('Empleado eliminado'); };

  const onMove = (row: Employee) => {
    setSelected(row);
    moveForm.resetFields();
    setMoveOpen(true);
  };

  const submitMove = async () => {
    try {
      const { toDepartmentId } = await moveForm.validateFields();
      await move.mutateAsync({ employeeId: selected!.id!, toDepartmentId });
      setMoveOpen(false);
      message.success('Empleado movido');
      // refrescá lista de empleados (dependencias actuales)
      list.refetch();
    } catch {}
    };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ margin: 0 }}>Empleados</h2>
        <Button type="primary" onClick={onCreate}>Nuevo</Button>
      </div>

      <Table
        rowKey="id"
        loading={list.isLoading}
        dataSource={list.data || []}
        columns={[
          { title: 'Legajo', dataIndex: 'legajo' },
          { title: 'Apellido, Nombre', render: (_: any, r: Employee) => `${r.lastName}, ${r.firstName}` },
          { title: 'DNI', dataIndex: 'dni' },
          {
            title: 'Dependencia actual',
            render: (_: any, r: Employee) => {
              const dep = (depList.data || []).find(d => d.id === r.currentDepartmentId);
              return dep ? `${dep.name}` : '—';
            }
          },
          {
            title: 'Acciones',
            render: (_: any, row: Employee) => (
              <>
                <Button size="small" onClick={() => onEdit(row)} style={{ marginRight: 8 }}>Editar</Button>
                <Button size="small" onClick={() => onAssign(row)} style={{ marginRight: 8 }}>Asignar</Button>
                <Popconfirm title="¿Eliminar?" onConfirm={() => onDelete(row.id!)}>
                  <Button size="small" danger>Eliminar</Button>
                </Popconfirm>
                <Button size="small" onClick={() => onMove(row)} style={{ marginRight: 8 }}>Mover</Button>
              </>
            )
          }
        ]}
      />

      {/* Modal crear/editar */}
      <Modal
        open={open}
        title={editing ? 'Editar empleado' : 'Nuevo empleado'}
        onOk={submitEmployee}
        onCancel={() => setOpen(false)}
        confirmLoading={create.isPending || update.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="legajo" label="Legajo" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="firstName" label="Nombre" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="lastName" label="Apellido" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dni" label="DNI" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>

      {/* Modal asignar dependencia */}
      <Modal
        open={assignOpen}
        title={`Asignar dependencia ${selected ? `a ${selected.lastName}, ${selected.firstName}` : ''}`}
        onOk={submitAssign}
        onCancel={() => setAssignOpen(false)}
        confirmLoading={assign.isPending}
        destroyOnClose
      >
        <Form form={assignForm} layout="vertical">
          <Form.Item name="departmentId" label="Dependencia" rules={[{ required: true }]}>
            <Select options={depOptions} loading={depList.isLoading} placeholder="Elegí una dependencia" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={moveOpen}
        title={`Mover empleado ${selected ? `${selected.lastName}, ${selected.firstName}` : ''}`}
        onOk={submitMove}
        onCancel={() => setMoveOpen(false)}
        confirmLoading={move.isPending}
        destroyOnClose
      >
        <Form form={moveForm} layout="vertical">
          <Form.Item name="toDepartmentId" label="Nueva dependencia" rules={[{ required: true }]}>
            <Select options={depOptions} loading={depList.isLoading} placeholder="Elegí destino" />
        </Form.Item>
        </Form>
      </Modal>
    </>


  );


}
