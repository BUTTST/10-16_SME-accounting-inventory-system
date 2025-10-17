import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

export default function Accounting() {
  const { settings, journalEntries, accounts } = useData();

  const sortedEntries = [...journalEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">傳票 & 科目</h1>
        <p className="text-muted-foreground">檢視會計傳票與科目餘額</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Journal Entries */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>傳票清單</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">尚無傳票記錄</p>
            ) : (
              <div className="space-y-4">
                {sortedEntries.map((entry) => (
                  <div key={entry.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{entry.reference}</p>
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-muted-foreground">科目</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">借方</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">貸方</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.lines.map((line, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-2">
                                <span className="font-mono text-xs text-muted-foreground mr-2">
                                  {line.accountCode}
                                </span>
                                {line.accountName}
                              </td>
                              <td className="text-right py-2">
                                {line.debit > 0 ? (
                                  <span className="font-medium">
                                    {settings.currency}{line.debit.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="text-right py-2">
                                {line.credit > 0 ? (
                                  <span className="font-medium">
                                    {settings.currency}{line.credit.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Balances */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>科目餘額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {accounts.map((account) => (
                <div
                  key={account.code}
                  className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <span className="font-mono text-xs text-muted-foreground mr-2">
                      {account.code}
                    </span>
                    <span className="text-sm">{account.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    account.balance === 0 
                      ? 'text-muted-foreground' 
                      : account.balance > 0 
                      ? 'text-accent' 
                      : 'text-destructive'
                  }`}>
                    {settings.currency}{Math.abs(account.balance).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
