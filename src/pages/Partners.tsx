import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Partners() {
  const { partners, addPartner, deletePartner } = useData();
  
  const [customerName, setCustomerName] = useState('');
  const [supplierName, setSupplierName] = useState('');

  const customers = partners.filter(p => p.type === 'customer');
  const suppliers = partners.filter(p => p.type === 'supplier');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim()) {
      addPartner({ name: customerName.trim(), type: 'customer' });
      setCustomerName('');
    }
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (supplierName.trim()) {
      addPartner({ name: supplierName.trim(), type: 'supplier' });
      setSupplierName('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">客戶/供應商</h1>
        <p className="text-muted-foreground">管理交易對象名錄</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customers */}
        <Card>
          <CardHeader>
            <CardTitle>客戶</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddCustomer} className="flex gap-2">
              <Input
                placeholder="輸入客戶名稱"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Button type="submit" className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                新增
              </Button>
            </form>

            <div className="space-y-2">
              {customers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">尚無客戶資料</p>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                  >
                    <span>{customer.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePartner(customer.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle>供應商</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddSupplier} className="flex gap-2">
              <Input
                placeholder="輸入供應商名稱"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
              <Button type="submit" className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                新增
              </Button>
            </form>

            <div className="space-y-2">
              {suppliers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">尚無供應商資料</p>
              ) : (
                suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                  >
                    <span>{supplier.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePartner(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
