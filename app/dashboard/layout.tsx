import SideNav from '@/app/ui/dashboard/sidenav';
import { connection } from 'next/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Dashboard data is live and must not be queried during prerendering.
  await connection();

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
