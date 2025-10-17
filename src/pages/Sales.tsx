import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

export default function Sales() {
  const { settings, items, partners, addTransaction } = useData();
  const navigate = useNavigate();
  
  const customers = partners.filter(p => p.type === 'customer');
  
  const today = new Date().toISOString().split('T')[0];
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear() - 1911; // 民國年
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `S${year}${month}${day}-${seq}`;
  };

  const [formData, setFormData] = useState({
    date: today,
    number: generateInvoiceNumber(),
    partnerId: '',
    partnerName: '',
    paymentMethod: 'cash' as 'cash' | 'credit',
    notes: '',
  });

  const [lines, setLines] = useState<Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
  }>>([]);

  const addLine = () => {
    setLines([...lines, { itemId: '', itemName: '', quantity: 0, unitPrice: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    if (field === 'itemId') {
      const item = items.find(i => i.id === value);
      if (item) {
        newLines[index] = {
          ...newLines[index],
          itemId: value,
          itemName: item.name,
        };
      }
    } else {
      newLines[index] = { ...newLines[index], [field]: value };
    }
    setLines(newLines);
  };

  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.partnerId) {
      alert('請選擇客戶');
      return;
    }
    if (lines.length === 0) {
      alert('請至少新增一筆明細');
      return;
    }
    
    // Check inventory
    const invalidLines = lines.filter(line => {
      const item = items.find(i => i.id === line.itemId);
      return !item || line.quantity > item.quantity;
    });
    
    if (invalidLines.length > 0) {
      alert('部分商品庫存不足，請檢查明細');
      return;
    }

    addTransaction({
      date: formData.date,
      number: formData.number,
      type: 'sales',
      partnerId: formData.partnerId,
      partnerName: formData.partnerName,
      paymentMethod: formData.paymentMethod,
      lines,
      subtotal,
      tax,
      total,
      notes: formData.notes,
    });

    navigate('/');
  };

  const handleClear = () => {
    setFormData({
      date: today,
      number: generateInvoiceNumber(),
      partnerId: '',
      partnerName: '',
      paymentMethod: 'cash',
      notes: '',
    });
    setLines([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">銷售（開立發票）</h1>
        <p className="text-muted-foreground">建立新的銷貨單並產生會計傳票</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>表頭資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">日期</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">單號</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">客戶</Label>
                <Select
                  value={formData.partnerId}
                  onValueChange={(value) => {
                    const customer = customers.find(c => c.id === value);
                    setFormData({ 
                      ...formData, 
                      partnerId: value,
                      partnerName: customer?.name || ''
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇客戶" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">付款方式</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: 'cash' | 'credit') => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">現金</SelectItem>
                    <SelectItem value="credit">賒帳</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>明細</CardTitle>
            <Button type="button" onClick={addLine} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              新增列
            </Button>
          </CardHeader>
          <CardContent>
            {lines.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">請新增明細列</p>
            ) : (
              <div className="space-y-4">
                {lines.map((line, index) => {
                  const item = items.find(i => i.id === line.itemId);
                  const isLowStock = item && line.quantity > item.quantity;
                  const lineSubtotal = line.quantity * line.unitPrice;

                  return (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="grid gap-4 md:grid-cols-5">
                        <div className="md:col-span-2 space-y-2">
                          <Label>商品</Label>
                          <Select
                            value={line.itemId}
                            onValueChange={(value) => updateLine(index, 'itemId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="選擇商品" />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} (庫存: {item.quantity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>數量</Label>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>單價（未稅）</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.unitPrice}
                            onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>小計</Label>
                          <div className="flex items-center gap-2 h-10">
                            <span className="font-medium">
                              {settings.currency}{lineSubtotal.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLine(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {isLowStock && (
                        <div className="flex items-center gap-2 text-warning">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">
                            庫存不足！目前庫存：{item?.quantity}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>結算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">未稅小計</span>
                <span className="font-medium">
                  {settings.currency}{subtotal.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">營業稅 ({settings.taxRate}%)</span>
                <span className="font-medium">
                  {settings.currency}{tax.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-lg border-t border-border pt-2">
                <span className="font-semibold">含稅總額</span>
                <span className="font-bold text-primary">
                  {settings.currency}{total.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">備註</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClear}>
                清空
              </Button>
              <Button type="submit">
                登錄並產生傳票
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
