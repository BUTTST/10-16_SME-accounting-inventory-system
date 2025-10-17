import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ShoppingBag, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Download,
  Upload,
  RotateCcw,
  AlertCircle,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: '總覽', href: '/', icon: LayoutDashboard },
  { name: '商品/存貨', href: '/items', icon: Package },
  { name: '銷售 (開立發票)', href: '/sales', icon: ShoppingCart },
  { name: '進貨 (採購)', href: '/purchases', icon: ShoppingBag },
  { name: '客戶/供應商', href: '/partners', icon: Users },
  { name: '傳票 & 科目', href: '/accounting', icon: FileText },
  { name: '報表', href: '/reports', icon: BarChart3 },
  { name: '設定', href: '/settings', icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          {state === 'expanded' && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">SME</span>
              <span className="text-xs text-sidebar-foreground/70">會計+進銷存</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center justify-center">
          {state === 'expanded' ? (
            <span className="text-xs text-sidebar-foreground/50">v1.0.0</span>
          ) : (
            <div className="h-2 w-2 rounded-full bg-sidebar-primary/50" />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const { exportData, importData, resetData } = useData();
  const { theme, toggleTheme } = useTheme();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    resetData();
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <SidebarInset className="flex flex-1 flex-col">
          {/* Migration Notice Banner */}
          <div className="bg-warning text-warning-foreground px-4 py-3 text-center text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>
                ⚠️ 開發階段通知：目前使用本地儲存（LocalStorage）| 未來將遷移至 <strong>Verico 線上資料庫</strong> | 平台選項：Verico / WordPress
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-bold text-primary">SME 會計+進銷存</h1>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  title={theme === 'light' ? '切換至深色模式' : '切換至淺色模式'}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">匯出</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">匯入</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">重設</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>確認重設資料？</AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作將清除所有資料並恢復預設設定。建議先匯出備份。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset}>確認重設</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
