import React, { useState } from 'react';
import { PackageCheck, PackageX, Truck, RotateCcw } from 'lucide-react';
import { Item, IncomingItem, IncomingSource } from '../types';

interface Props {
  items: Item[];
  incomingItems: IncomingItem[];
  onAddIncomingItem: (item: Omit<IncomingItem, 'id' | 'date'>) => void;
}

export function IncomingItems({ items, incomingItems, onAddIncomingItem }: Props) {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [source, setSource] = useState<IncomingSource>('EXPEDITION');
  const [expeditionNumber, setExpeditionNumber] = useState('');
  const [returnReason, setReturnReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && quantity) {
      onAddIncomingItem({
        itemId: parseInt(selectedItem, 10),
        quantity: parseInt(quantity, 10),
        source,
        ...(source === 'EXPEDITION' ? { expeditionNumber } : { returnReason }),
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedItem('');
    setQuantity('');
    setExpeditionNumber('');
    setReturnReason('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="item" className="block text-sm font-medium text-gray-700">
                Pilih Barang
              </label>
              <select
                id="item"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Pilih barang...</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Jumlah
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setSource('EXPEDITION')}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border ${
                  source === 'EXPEDITION'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700'
                } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Truck className="w-5 h-5 mr-2" />
                Dari Ekspedisi
              </button>
              <button
                type="button"
                onClick={() => setSource('RETURN')}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border ${
                  source === 'RETURN'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700'
                } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Barang Kembali
              </button>
            </div>

            {source === 'EXPEDITION' ? (
              <div>
                <label htmlFor="expeditionNumber" className="block text-sm font-medium text-gray-700">
                  Nomor Ekspedisi
                </label>
                <input
                  type="text"
                  id="expeditionNumber"
                  value={expeditionNumber}
                  onChange={(e) => setExpeditionNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            ) : (
              <div>
                <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700">
                  Alasan Pengembalian
                </label>
                <textarea
                  id="returnReason"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PackageCheck className="w-4 h-4 mr-2" />
            Tambah Barang Masuk
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incomingItems.map((incomingItem) => {
              const item = items.find((i) => i.id === incomingItem.itemId);
              return (
                <tr key={incomingItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incomingItem.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incomingItem.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      incomingItem.source === 'EXPEDITION' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incomingItem.source === 'EXPEDITION' ? 'Ekspedisi' : 'Pengembalian'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {incomingItem.source === 'EXPEDITION' 
                      ? `No. Ekspedisi: ${incomingItem.expeditionNumber}`
                      : `Alasan: ${incomingItem.returnReason}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}