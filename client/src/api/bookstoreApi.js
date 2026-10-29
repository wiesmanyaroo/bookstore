import { relationResources, resources } from '../config/resources'

async function request(path, options) {
  const response = await fetch(`/api/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }

  return response.status === 204 ? null : response.json()
}

export async function loadResourceData(resourceKey) {
  const resource = resources[resourceKey]
  const [rows, ...relationRows] = await Promise.all([
    request(resource.endpoint),
    ...relationResources.map((key) => request(resources[key].endpoint)),
  ])

  const relations = Object.fromEntries(
    relationResources.map((key, index) => [key, relationRows[index]]),
  )

  return { rows, relations }
}

export async function saveResourceRecord(resource, recordId, values) {
  const payload = {}

  for (const field of resource.fields) {
    const value = values[field.key]
    if (value === '' || value === null || value === undefined) continue
    payload[field.key] = field.kind === 'number' || field.kind === 'select' ? Number(value) : value
  }

  const isEditing = recordId !== null
  if (isEditing) payload.id = recordId

  return request(isEditing ? `${resource.endpoint}/${recordId}` : resource.endpoint, {
    method: isEditing ? 'PUT' : 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteResourceRecord(resource, recordId) {
  return request(`${resource.endpoint}/${recordId}`, { method: 'DELETE' })
}