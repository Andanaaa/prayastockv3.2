import React, { useState, useMemo } from 'react';
import {
  FileBarChart,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Search,
  Trash2,
} from 'lucide-react';
import { Item, OutgoingItem, ReportPeriod } from '../types';

interface Props {
  items: Item[];
  outgoingItems: OutgoingItem[];
  onDeleteSale: (saleId: number) => void;
}

type StockStatus = 'SUFFICIENT' | 'PREPARE' | 'URGENT';

interface SalesDataItem extends Item {
  totalSales: number;
  status: StockStatus;
}

export function SalesReport({ items, outgoingItems, onDeleteSale }: Props) {
  const [period, setPeriod] = useState<ReportPeriod>('MONTHLY');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'ALL'>('ALL');

  const getStockStatus = (stock: number, totalSales: number): StockStatus => {
    if (stock > totalSales * 2.5) return 'SUFFICIENT';
    if (stock < totalSales * 1.75) return 'URGENT';
    return 'PREPARE';
  };

  const salesData = useMemo(() => {
    return items.map((item) => {
      const relevantSales = outgoingItems.filter((sale) => {
        const saleDate = new Date(sale.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date

        return (
          sale.itemId === item.id &&
          saleDate >= start &&
          saleDate <= end
        );
      });

      const totalSales = relevantSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );
      const status = getStockStatus(item.stock, totalSales);

      return {
        ...item,
        totalSales,
        status,
        sales: relevantSales,
      };
    });
  }, [items, outgoingItems, startDate, endDate]);

  const filteredAndSortedData = useMemo(() => {
    return salesData
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'ALL' || item.status === statusFilter)
      )
      .sort((a, b) => {
        const statusPriority = { URGENT: 0, PREPARE: 1, SUFFICIENT: 2 };
        return statusPriority[a.status] - statusPriority[b.status];
      });
  }, [salesData, searchQuery, statusFilter]);

  const getStatusBadgeStyle = (status: StockStatus) => {
    switch (status) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'PREPARE':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUFFICIENT':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: StockStatus) => {
    switch (status) {
      case 'URGENT':
        return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'PREPARE':
        return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'SUFFICIENT':
        return <CheckCircle className="w-4 h-4 mr-1" />;
    }
  };

  const getStatusText = (status: StockStatus) => {
    switch (status) {
      case 'URGENT':
        return 'Segera Beli';
      case 'PREPARE':
        return 'Persiapan Beli';
      case 'SUFFICIENT':
        return 'Stock Mencukupi';
    }
  };

  const handleDeleteSale = (saleId: number) => {
    if (
      window.confirm('Apakah Anda yakin ingin menghapus data penjualan ini?')
    ) {
      onDeleteSale(saleId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                <FileBarChart className="w-5 h-5 inline-block mr-2" />
                Laporan Penjualan
              </h3>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex space-x-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StockStatus | 'ALL')
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="ALL">Semua Status</option>
              <option value="URGENT">Segera Beli</option>
              <option value="PREPARE">Persiapan Beli</option>
              <option value="SUFFICIENT">Stock Mencukupi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Saat Ini
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Penjualan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detail Penjualan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalSales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    {getStatusText(item.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {item.sales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {sale.date} - {sale.quantity} unit
                        </span>
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus penjualan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}