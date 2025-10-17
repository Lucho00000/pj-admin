import { Button, Form, Input, Modal, Popconfirm, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useBuildings, type Building } from '../features/buildings/useBuildings';

export default function BuildingsPage() {
  const { list, create, update, remove } = useBuildings();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Building | null>(null);
  const [form] = Form.useForm<Building>();

  // 👇 hooks de AntD para mensajes y modales
  const [msgApi, msgCtx] = message.useMessage();
  const [modalApi, modalCtx] = Modal.useModal();

  useEffect(() => { if (editing) form.setFieldsValue(editing); }, [editing]);

  const onCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const onEdit = (row: Building) => { setEditing(row); setOpen(true); };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing?.id) await update.mutateAsync({ ...editing, ...values });
      else await create.mutateAsync(values);
      setOpen(false);
      msgApi.success('Guardado');
    } catch {
      // validación o request fallida; si querés, podés mostrar algo acá
    }
  };

  const extractErrorMessage = (e: any) => {
    const data = e?.response?.data;
    return (
      data?.message ||
      data?.detail ||
      data?.title ||
      (typeof data === 'string' ? data : null)
    );
  };

  const onDelete = (id: number) => {
    // Usamos mutate con onError local para que sí dispare el handler
    remove.mutate(id, {
      onSuccess: () => {
        msgApi.success('Eliminado');
      },
      onError: (e: any) => {
        const status = e?.response?.status;
        const errMsg = extractErrorMessage(e);
        console.error('DELETE /buildings error:', e);

        if (status === 409) {
          // Modal visible y bloqueante (garantiza que el usuario lo vea)
          modalApi.error({
            title: 'No se puede eliminar el edificio',
            content: errMsg || 'Este edificio tiene dependencias (departments) asociadas.',
            okText: 'Entendido',
          });
        } else if (status === 404) {
          msgApi.warning('El edificio ya no existe.');
        } else {
          modalApi.error({
            title: 'Error al eliminar',
            content: errMsg || 'Ocurrió un error al intentar eliminar el edificio.',
          });
        }
      },
    });
  };

  return (
    <>
      {/* 👇 Estos holders DEBEN estar renderizados */}
      {msgCtx}
      {modalCtx}

      <div className="flex items-center justify-between mb-3">
        <h2 style={{ margin: 0 }}>Edificios</h2>
        <Button type="primary" onClick={onCreate}>Nuevo</Button>
      </div>

      <Table
        rowKey="id"
        loading={list.isLoading}
        dataSource={list.data || []}
        columns={[
          { title: 'Nombre', dataIndex: 'name' },
          { title: 'Calle', dataIndex: 'street' },
          { title: 'Número', dataIndex: 'number' },
          { title: 'Piso', dataIndex: 'floor' },
          {
            title: 'Acciones',
            render: (_: any, row: Building) => (
              <>
                <Button size="small" onClick={() => onEdit(row)} style={{ marginRight: 8 }}>Editar</Button>
                <Popconfirm
                  title="¿Eliminar?"
                  description={`Vas a eliminar "${row.name}". Esta acción no se puede deshacer.`}
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                  onConfirm={() => onDelete(row.id!)}
                >
                  <Button size="small" danger>Eliminar</Button>
                </Popconfirm>
              </>
            )
          }
        ]}
      />

      <Modal
        open={open}
        title={editing ? 'Editar edificio' : 'Nuevo edificio'}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
        confirmLoading={create.isPending || update.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Calle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="number" label="Número" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="floor" label="Piso">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
