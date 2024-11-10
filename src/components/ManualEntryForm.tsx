import React, { useState } from 'react';
import { PackageMinus } from 'lucide-react';
import { Item } from '../types';

interface Props {
  items: Item[];
  onSubmit: (item: { itemId: number; quantity: number }) => void;
}

export function ManualEntryForm({ items, onSubmit }: Props) {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && quantity) {
      const item = items.find(i => i.id === parseInt(selectedItem));
      if (item && item.stock >= parseInt(quantity)) {
        onSubmit({
          itemId: parseInt(selectedItem),
          quantity: parseInt(quantity)
        });
        setSelectedItem('');
        setQuantity('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
                {item.code} - {item.name} (Stock: {item.stock})
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
            max={selectedItem ? items.find(i => i.id === parseInt(selectedItem))?.stock : undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PackageMinus className="w-4 h-4 mr-2" />
          Tambah Penjualan
        </button>
      </div>
    </form>
  );
}