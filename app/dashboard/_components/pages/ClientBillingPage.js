import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';

export default function ClientBillingPage() {
  const invoices = [
    { id: 'INV-2026-001', date: '2026-03-01', amount: 2499, status: 'paid' },
    { id: 'INV-2026-002', date: '2026-02-01', amount: 2499, status: 'paid' },
    { id: 'INV-2026-003', date: '2026-01-01', amount: 2499, status: 'due' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">Billing</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">Invoices and subscription details</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Current plan and next invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Plan</span>
                <Badge className="bg-emerald-100 text-emerald-800">Professional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next Invoice</span>
                <span className="font-medium dark:text-gray-300">$2,499 on 2026-04-01</span>  
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Your recent billing history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.id}</TableCell>
                      <TableCell>{inv.date}</TableCell>
                      <TableCell>${inv.amount}</TableCell>
                      <TableCell>
                        <Badge className={inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
