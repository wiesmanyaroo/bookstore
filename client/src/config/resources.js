export const resources = {
  books: {
    label: 'Books',
    singular: 'Book',
    endpoint: 'books',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'authorId', label: 'Author', kind: 'select', source: 'authors', required: true },
      { key: 'categoryId', label: 'Category', kind: 'select', source: 'categories', required: true },
      { key: 'price', label: 'Price', kind: 'number', step: '0.01', min: '0.01', required: true },
      { key: 'stock', label: 'Stock', kind: 'number', min: '0', required: true },
      { key: 'isbn', label: 'ISBN' },
    ],
    columns: ['title', 'authorId', 'categoryId', 'price', 'stock', 'isbn'],
  },
  authors: {
    label: 'Authors',
    singular: 'Author',
    endpoint: 'authors',
    fields: [
      { key: 'fullName', label: 'Full name', required: true },
      { key: 'biography', label: 'Biography', kind: 'textarea' },
    ],
    columns: ['fullName', 'biography'],
  },
  categories: {
    label: 'Categories',
    singular: 'Category',
    endpoint: 'categories',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'description', label: 'Description', kind: 'textarea' },
    ],
    columns: ['name', 'description'],
  },
  customers: {
    label: 'Customers',
    singular: 'Customer',
    endpoint: 'customers',
    fields: [
      { key: 'fullName', label: 'Full name', required: true },
      { key: 'email', label: 'Email', kind: 'email', required: true },
      { key: 'phone', label: 'Phone' },
    ],
    columns: ['fullName', 'email', 'phone', 'orders'],
  },
  orders: {
    label: 'Orders',
    singular: 'Order',
    endpoint: 'orders',
    fields: [
      { key: 'customerId', label: 'Customer', kind: 'select', source: 'customers', required: true },
      { key: 'bookId', label: 'Book', kind: 'select', source: 'books', required: true },
      { key: 'quantity', label: 'Quantity', kind: 'number', min: '1', required: true },
      { key: 'orderDate', label: 'Order date', kind: 'date', required: true },
    ],
    columns: ['customerId', 'bookId', 'quantity', 'orderDate'],
  },
}

export const relationResources = ['authors', 'categories', 'customers', 'books']

export const emptyRelations = {
  authors: [],
  categories: [],
  customers: [],
  books: [],
}