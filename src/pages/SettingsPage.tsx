import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';

export default function SettingsPage() {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">設定</h1>
        <p className="text-muted-foreground">管理系統的全域設定</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>公司資訊</CardTitle>
          <CardDescription>設定您的公司基本資訊</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">公司名稱</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">幣別符號</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="NT$"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">營業稅率 (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                required
              />
              <p className="text-sm text-muted-foreground">
                目前稅率：{formData.taxRate}%
              </p>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              儲存設定
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
