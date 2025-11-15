import SideNav from '@/app/ui/dashboard/sidenav';
 
// The layout component receives the nested page content via the 'children' prop
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Side Navigation on the left */}
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}