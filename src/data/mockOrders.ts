import type { Order } from '@/types/orders';

export const mockOrders: Order[] = [
  {
    id: '61391',
    customerName: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    products: 'Wireless Headphones',
    orderDate: '2024-03-27',
    deliveryDate: '2024-03-24',
    callStatus: 'completed',
    total: '$199'
  },
  {
    id: '61390',
    customerName: 'Mike Chen',
    phone: '+1 (555) 987-6543',
    products: 'Smart Watch Pro, Charging Cable',
    orderDate: '2024-03-27',
    deliveryDate: '2024-03-24',
    callStatus: 'scheduled',
    total: '$449'
  },
  {
    id: '61389',
    customerName: 'Emily Davis',
    phone: '+1 (555) 456-7890',
    products: 'Bluetooth Speaker',
    orderDate: '2024-03-26',
    deliveryDate: '2024-03-23',
    callStatus: 'not_scheduled',
    total: '$89'
  },
  {
    id: '61388',
    customerName: 'David Wilson',
    phone: '+1 (555) 321-0987',
    products: 'Laptop Stand',
    orderDate: '2024-03-24',
    deliveryDate: '2024-03-21',
    callStatus: 'completed',
    total: '$79'
  },
  {
    id: '61387',
    customerName: 'Lisa Thompson',
    phone: '+1 (555) 654-3210',
    products: 'Phone Case, Screen Protector',
    orderDate: '2024-03-24',
    deliveryDate: '2024-03-21',
    callStatus: 'scheduled',
    total: '$34'
  },
  // Adding more mock data for pagination
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `${61360 + i}`,
    customerName: ['Alex Rodriguez', 'Jessica Brown', 'Michael Smith', 'Ashley Garcia', 'Daniel Lee', 'Amanda Martinez', 'Ryan Taylor', 'Nicole Anderson', 'Kevin White', 'Rachel Green'][i % 10],
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    products: ['Wireless Mouse', 'Gaming Keyboard', 'Monitor Stand', 'USB Cable', 'Wireless Charger', 'Phone Holder', 'Desk Lamp', 'Webcam', 'Microphone', 'Tablet Case'][i % 10],
    orderDate: new Date(2024, 2, Math.floor(Math.random() * 25) + 1).toISOString().split('T')[0],
    deliveryDate: new Date(2024, 2, Math.floor(Math.random() * 20) + 1).toISOString().split('T')[0],
    callStatus: (['completed', 'scheduled', 'not_scheduled'] as const)[Math.floor(Math.random() * 3)],
    total: `$${Math.floor(Math.random() * 300) + 20}`
  }))
]; 