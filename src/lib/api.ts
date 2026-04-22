export const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  category: string | null;
}

export interface Category {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string | null;
}

export interface Client {
  id: string;
  name: string;
  logo: string | null;
}

export interface TeamMember {
  id: string;
  email: string;
}

function adminHeaders(): HeadersInit {
  const key = sessionStorage.getItem('adminKey') || '';
  return { 'X-Admin-Key': key };
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function addCategory(name: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add category');
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

// Products
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function addProduct(formData: FormData): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: adminHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add product');
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
}

// Services
export async function fetchServices(): Promise<Service[]> {
  const res = await fetch(`${BASE_URL}/api/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function addService(formData: FormData): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/services`, {
    method: 'POST',
    headers: adminHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add service');
  }
}

export async function deleteService(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/services/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete service');
}

export async function updateService(id: string, formData: FormData): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/services/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update service');
  }
}

// Clients
export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${BASE_URL}/api/clients`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

export async function addClient(formData: FormData): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/clients`, {
    method: 'POST',
    headers: adminHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add client');
  }
}

export async function deleteClient(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/clients/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete client');
}

export interface EmailMessage {
  id: string;
  subject: string;
  sender: string;
  date: string;
  body: string;
  html: string | null;
}

// Team
export async function teamLogin(email: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/team/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Invalid credentials');
  }
}

export async function fetchInbox(email: string, password: string): Promise<EmailMessage[]> {
  const res = await fetch(`${BASE_URL}/api/team/inbox`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch inbox');
  }
  return res.json();
}

export async function fetchEmailBody(emailId: string, email: string, password: string): Promise<{ body: string; html: string | null }> {
  const res = await fetch(`${BASE_URL}/api/team/email/${emailId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Failed to fetch email');
  return res.json();
}

export async function sendEmail(data: { email: string; password: string; to: string; subject: string; body: string; attachments?: File[] }): Promise<void> {
  const fd = new FormData();
  fd.append('email', data.email);
  fd.append('password', data.password);
  fd.append('to', data.to);
  fd.append('subject', data.subject);
  fd.append('body', data.body);
  if (data.attachments) {
    data.attachments.forEach((f) => fd.append('attachments', f));
  }
  const res = await fetch(`${BASE_URL}/api/team/send`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to send email');
  }
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const res = await fetch(`${BASE_URL}/api/team`, { headers: adminHeaders() });
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
}

export async function addTeamMember(data: { email: string; portal_password: string; app_password: string }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add member');
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/team/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete member');
}
