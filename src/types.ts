export interface Item {
  id: number;
  code: string;
  name: string;
  stock: number;
  dateAdded: string;
  timeAdded: string;
}

export type IncomingSource = 'EXPEDITION' | 'RETURN';

export interface IncomingItem {
  id: number;
  itemId: number;
  quantity: number;
  source: IncomingSource;
  expeditionNumber?: string;
  returnReason?: string;
  date: string;
  time: string;
}

export interface OutgoingItem {
  id: number;
  itemId: number;
  quantity: number;
  date: string;
  time: string;
}

export interface ExcelRow {
  'Kode Barang': string;
  'Nama Barang': string;
  'Jumlah': number;
}

export type ReportPeriod = 'WEEKLY' | 'MONTHLY';

export interface SalesReport {
  itemId: number;
  totalSales: number;
  period: string;
}