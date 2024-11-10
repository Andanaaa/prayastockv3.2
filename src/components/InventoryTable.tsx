import React, { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { Item } from '../types';

interface Props {
  items: Item[];
  onDeleteItem: (id: number) => void;
  onEditItem: (id: number, newName: string) => void;
}

export function InventoryTable({ items, onDeleteItem, onEditItem }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSave = (id: number) => {
    onEditItem(id, editName);
    setEditingId(null);
    setEditName('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    autoFocus
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dateAdded}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.timeAdded}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex space-x-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSave(item.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Simpan"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                        title="Batal"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}