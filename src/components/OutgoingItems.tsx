import React, { useState, useRef } from 'react';
import { PackageMinus, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { read, utils } from 'xlsx';
import { Item, OutgoingItem, ExcelRow } from '../types';
import { ManualEntryForm } from './ManualEntryForm';

interface Props {
  items: Item[];
  outgoingItems: OutgoingItem[];
  onAddOutgoingItems: (items: Omit<OutgoingItem, 'id' | 'date'>[]) => void;
}

export function OutgoingItems({ items, outgoingItems, onAddOutgoingItems }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [entryMethod, setEntryMethod] = useState<'manual' | 'excel'>('manual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<ExcelRow>(worksheet);

      if (jsonData.length === 0) {
        throw new Error('File Excel kosong');
      }

      const outgoingItems = jsonData.map(row => {
        const item = items.find(item => item.code === row['Kode Barang']);
        if (!item) {
          throw new Error(`Kode barang "${row['Kode Barang']}" tidak ditemukan`);
        }
        if (item.stock < row['Jumlah']) {
          throw new Error(`Stock tidak cukup untuk barang "${item.name}"`);
        }
        return {
          itemId: item.id,
          quantity: row['Jumlah']
        };
      });

      onAddOutgoingItems(outgoingItems);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setEntryMethod('manual')}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border ${
                entryMethod === 'manual'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-700'
              } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <PackageMinus className="w-4 h-4 mr-2" />
              Input Manual
            </button>
            <button
              onClick={() => setEntryMethod('excel')}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border ${
                entryMethod === 'excel'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-700'
              } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Upload Excel
            </button>
          </div>

          {entryMethod === 'manual' ? (
            <ManualEntryForm
              items={items}
              onSubmit={(item) => onAddOutgoingItems([item])}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Import Data Barang Keluar</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload file Excel dengan format: Kode Barang, Jumlah
                  </p>
                </div>
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Upload Excel
                </label>
              </div>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                className="sr-only"
              />
            </>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {outgoingItems.map((outgoingItem) => {
              const item = items.find((i) => i.id === outgoingItem.itemId);
              return (
                <tr key={outgoingItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{outgoingItem.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{outgoingItem.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}