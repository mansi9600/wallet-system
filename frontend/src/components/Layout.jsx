import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-content">
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
