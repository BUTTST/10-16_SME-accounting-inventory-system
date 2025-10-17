import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Package, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { settings, items, transactions } = useData();
  const navigate = useNavigate();

  // Calculate KPIs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlySales = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'sales' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.total, 0);

  const inventoryValue = items.reduce((sum, item) => sum + item.quantity * item.averageCost, 0);

  const monthlyCOGS = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'sales' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => {
      const cogs = t.lines.reduce((lineSum, line) => {
        const item = items.find(i => i.id === line.itemId);
        return lineSum + (item ? line.quantity * item.averageCost : 0);
      }, 0);
      return sum + cogs;
    }, 0);

  const grossMargin = monthlySales > 0 ? ((monthlySales - monthlyCOGS) / monthlySales * 100) : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">總覽</h1>
          <p className="text-muted-foreground">歡迎回到您的會計系統</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月銷售（含稅）</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {settings.currency}{monthlySales.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">庫存總價值</CardTitle>
            <Package className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {settings.currency}{inventoryValue.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">毛利率（估）</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {grossMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速動作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/sales')} className="gap-2">
              <Plus className="h-4 w-4" />
              開立銷貨
            </Button>
            <Button onClick={() => navigate('/purchases')} variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" />
              建立採購
            </Button>
            <Button onClick={() => navigate('/items')} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              新增商品
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>最近交易</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">尚無交易記錄</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">日期</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">單號</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">類型</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">對象</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">含稅金額</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{transaction.date}</td>
                      <td className="py-3 px-4 font-mono text-sm">{transaction.number}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transaction.type === 'sales' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {transaction.type === 'sales' ? '銷售' : '採購'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{transaction.partnerName}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {settings.currency}{transaction.total.toLocaleString('zh-TW', { minimumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
