import { Outlet } from "react-router-dom";

import AdminSidebar from "../admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      {/* Admin navigation */}
      <AdminSidebar />

      {/* Admin page content */}
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;