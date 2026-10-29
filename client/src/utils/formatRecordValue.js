export function formatRecordValue(row, key, relations) {
  if (key === 'authorId') return relations.authors.find((item) => item.id === row[key])?.fullName ?? 'Unknown'
  if (key === 'categoryId') return relations.categories.find((item) => item.id === row[key])?.name ?? 'Unknown'
  if (key === 'customerId') return relations.customers.find((item) => item.id === row[key])?.fullName ?? 'Unknown'
  if (key === 'bookId') return relations.books.find((item) => item.id === row[key])?.title ?? 'Unknown'
  if (key === 'orders') return `${row.orders?.length ?? 0} orders`
  if (key === 'price') return `$${Number(row[key]).toFixed(2)}`
  if (key === 'orderDate') return row[key] ? new Date(row[key]).toLocaleDateString() : '—'
  return row[key] ?? '—'
}