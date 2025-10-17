import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Items() {
  const { settings, items, addItem, updateItem, deleteItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    quantity: 0,
    averageCost: 0,
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInventoryValue = items.reduce((sum, item) => sum + item.quantity * item.averageCost, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItem(editingItem, formData);
    } else {
      addItem(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      category: '',
      quantity: 0,
      averageCost: 0,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: typeof items[0]) => {
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      averageCost: item.averageCost,
    });
    setEditingItem(item.id);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">商品/存貨</h1>
          <p className="text-muted-foreground">管理您的商品與庫存</p>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜尋商品名稱或料號..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => { setEditingItem(null); resetForm(); }}>
                  <Plus className="h-4 w-4" />
                  新增商品
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? '編輯商品' : '新增商品'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">料號</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">名稱</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">類別</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">初始數量</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="averageCost">平均成本</Label>
                    <Input
                      id="averageCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.averageCost}
                      onChange={(e) => setFormData({ ...formData, averageCost: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      取消
                    </Button>
                    <Button type="submit">
                      {editingItem ? '更新' : '新增'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>商品清單</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">尚無商品資料</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">料號</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">名稱</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">類別</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">數量</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">平均成本</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">小計</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{item.code}</td>
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.category || '-'}</td>
                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">
                          {settings.currency}{item.averageCost.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {settings.currency}{(item.quantity * item.averageCost).toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary">
                      <td colSpan={5} className="py-3 px-4 text-right font-semibold">庫存總價值：</td>
                      <td className="py-3 px-4 text-right font-bold text-primary text-lg">
                        {settings.currency}{totalInventoryValue.toLocaleString('zh-TW', { minimumFractionDigits: 2 })}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>💡 提示：平均成本會在採購入庫時自動更新</p>
      </div>
    </div>
  );
}
