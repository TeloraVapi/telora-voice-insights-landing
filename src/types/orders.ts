export interface Order {
  id: string;
  customerName: string;
  phone: string;
  products: string;
  orderDate: string;
  deliveryDate: string;
  callStatus: 'completed' | 'scheduled' | 'not_scheduled';
  total: string;
} 