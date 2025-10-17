import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const items = [
  { key: '/buildings', label: <Link to="/buildings">Edificios</Link> },
  { key: '/departments', label: <Link to="/departments">Dependencias</Link> },
  { key: '/employees', label: <Link to="/employees">Empleados</Link> },
  { key: '/moves', label: <Link to="/moves">Traslados</Link> },
  { key: '/reports/by-department', label: <Link to="/reports/by-department">Consulta: por Dependencia</Link> },
  { key: '/reports/by-building', label: <Link to="/reports/by-building">Consulta: por Edificio</Link> },
];

// Normaliza la key seleccionada para rutas anidadas
function useSelectedKey() {
  const { pathname } = useLocation();
  if (pathname === '/') return '/';
  const first = '/' + pathname.split('/')[1];
  return first;
}

export default function AppLayout() {
  const selectedKey = useSelectedKey();

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Si el colapso rompe el header, probá sin breakpoint o con collapsedWidth=64 */}
      <Sider width={220} collapsedWidth={64 /* antes: 0 */}
        // breakpoint="lg"   <-- probá comentarlo si te encoge el contenido
      >
        <div style={{ color: '#fff', padding: 16, fontWeight: 700, letterSpacing: 0.5 }}>
          ADMINISTRADOR
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>

      <Layout style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            width: '100%',     // asegura ancho completo
            flexShrink: 0,     // evita que se “aplane” a una columna
          }}
          aria-label="Barra de encabezado"
        >
          <img
            src="/logo.png"
            alt="Poder Judicial de Neuquén - Logo"
            style={{ height: 48, width: 'auto', display: 'block' }}
          />

          {/* Contenedor del título que se expande */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <b style={{ margin: 0, fontSize: 26, color: '#222', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}
            title="PODER JUDICIAL DE NEUQUÉN" >
              PODER JUDICIAL DE NEUQUÉN
            </b>
          </div>
        </Header>

        <Content style={{ margin: 0, padding: 24, background: '#fff', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
