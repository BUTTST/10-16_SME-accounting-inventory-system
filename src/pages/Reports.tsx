import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';

export default function Reports() {
  const { settings, accounts, items } = useData();

  // Trial Balance
  const assetAccounts = accounts.filter(a => a.type === 'asset');
  const liabilityAccounts = accounts.filter(a => a.type === 'liability');
  const equityAccounts = accounts.filter(a => a.type === 'equity');
  const revenueAccounts = accounts.filter(a => a.type === 'revenue');
  const expenseAccounts = accounts.filter(a => a.type === 'expense');

  const debitTotal = [...assetAccounts, ...expenseAccounts].reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const creditTotal = [...liabilityAccounts, ...equityAccounts, ...revenueAccounts].reduce((sum, a) => sum + Math.abs(a.balance), 0);

  // Income Statement
  const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalExpense = expenseAccounts.reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const netIncome = totalRevenue - totalExpense;

  // Balance Sheet
  const totalAssets = assetAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilityAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equityAccounts.reduce((sum, a) => sum + a.balance, 0) + netIncome;

  // Inventory Valuation
  const inventoryValue = items.reduce((sum, item) => sum + item.quantity * item.averageCost, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">報表</h1>
        <p className="text-muted-foreground">檢視各類財務報表</p>
      </div>

      <Tabs defaultValue="trial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trial">試算表</TabsTrigger>
          <TabsTrigger value="income">損益表</TabsTrigger>
          <TabsTrigger value="balance">資產負債表</TabsTrigger>
          <TabsTrigger value="inventory">庫存估價</TabsTrigger>
        </TabsList>

        {/* Trial Balance */}
        <TabsContent value="trial">
          <Card>
            <CardHeader>
              <CardTitle>試算表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="text-left py-3 px-4 font-semibold">科目代碼</th>
                      <th className="text-left py-3 px-4 font-semibold">科目名稱</th>
                      <th className="text-right py-3 px-4 font-semibold">借方</th>
                      <th className="text-right py-3 px-4 font-semibold">貸方</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.code} className="border-b border-border">
                        <td className="py-2 px-4 font-mono text-sm">{account.code}</td>
                        <td className="py-2 px-4">{account.name}</td>
                        <td className="py-2 px-4 text-right">
                          {(account.type === 'asset' || account.type === 'expense') && account.balance !== 0
                            ? `${settings.currency}${Math.abs(account.balance).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}`
                            : '-'}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {(account.type === 'liability' || account.type === 'equity' || account.type === 'revenue') && account.balance !== 0
                            ? `${settings.currency}${Math.abs(account.balance).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}`
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary bg-muted/30">
                      <td colSpan={2} className="py-3 px-4 font-bold">合計</td>
                      <td className="py-3 px-4 text-right font-bold text-primary">
                        {settings.currency}{debitTotal.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary">
                        {settings.currency}{creditTotal.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income Statement */}
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>損益表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-lg">營業收入</h3>
                  {revenueAccounts.map((account) => (
                    <div key={account.code} className="flex justify-between py-2">
                      <span>{account.name}</span>
                      <span className="font-medium">
                        {settings.currency}{account.balance.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t border-border mt-2 font-semibold">
                    <span>收入合計</span>
                    <span className="text-accent">
                      {settings.currency}{totalRevenue.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-lg">營業成本與費用</h3>
                  {expenseAccounts.map((account) => (
                    <div key={account.code} className="flex justify-between py-2">
                      <span>{account.name}</span>
                      <span className="font-medium">
                        {settings.currency}{Math.abs(account.balance).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t border-border mt-2 font-semibold">
                    <span>成本費用合計</span>
                    <span className="text-destructive">
                      {settings.currency}{totalExpense.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-primary pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">本期損益</span>
                    <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {settings.currency}{Math.abs(netIncome).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      <span className="text-sm ml-2">({netIncome >= 0 ? '盈' : '虧'})</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>資產負債表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3 text-lg text-primary">資產</h3>
                  {assetAccounts.map((account) => (
                    <div key={account.code} className="flex justify-between py-2">
                      <span>{account.name}</span>
                      <span className="font-medium">
                        {settings.currency}{account.balance.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t-2 border-primary mt-2 font-bold">
                    <span>資產合計</span>
                    <span className="text-primary">
                      {settings.currency}{totalAssets.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-lg text-primary">負債與權益</h3>
                  <div className="mb-4">
                    <p className="font-medium mb-2">負債</p>
                    {liabilityAccounts.map((account) => (
                      <div key={account.code} className="flex justify-between py-2 pl-4">
                        <span>{account.name}</span>
                        <span className="font-medium">
                          {settings.currency}{account.balance.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium mb-2">權益</p>
                    {equityAccounts.map((account) => (
                      <div key={account.code} className="flex justify-between py-2 pl-4">
                        <span>{account.name}</span>
                        <span className="font-medium">
                          {settings.currency}{account.balance.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 pl-4 border-t border-border">
                      <span>本期損益</span>
                      <span className={`font-medium ${netIncome >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {settings.currency}{Math.abs(netIncome).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-primary mt-2 font-bold">
                    <span>負債與權益合計</span>
                    <span className="text-primary">
                      {settings.currency}{(totalLiabilities + totalEquity).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Valuation */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>庫存估價表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="text-left py-3 px-4 font-semibold">料號</th>
                      <th className="text-left py-3 px-4 font-semibold">名稱</th>
                      <th className="text-right py-3 px-4 font-semibold">數量</th>
                      <th className="text-right py-3 px-4 font-semibold">平均成本</th>
                      <th className="text-right py-3 px-4 font-semibold">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border">
                        <td className="py-2 px-4 font-mono text-sm">{item.code}</td>
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4 text-right">{item.quantity}</td>
                        <td className="py-2 px-4 text-right">
                          {settings.currency}{item.averageCost.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-4 text-right font-medium">
                          {settings.currency}{(item.quantity * item.averageCost).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary bg-muted/30">
                      <td colSpan={4} className="py-3 px-4 font-bold">庫存總價值</td>
                      <td className="py-3 px-4 text-right font-bold text-primary text-lg">
                        {settings.currency}{inventoryValue.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
