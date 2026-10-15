import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { categoryApi, adminApi } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setAdding(true);
      setError('');
      setMsg('');
      const res = await adminApi.createCategory({
        categoryName: name.trim(),
        description: description.trim(),
        active: true,
      });
      setCategories([...categories, res.data]);
      setName('');
      setDescription('');
      setMsg('Category added successfully');
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading rental categories..." />;

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          Rental Room Categories
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Define accommodation types and housing classifications
        </p>
      </div>

      {/* Add Category Form */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} color="var(--primary)" /> Add New Category
        </h3>

        {msg && <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>✓ {msg}</div>}
        {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>✕ {error}</div>}

        <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Luxury Penthouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Short explanation"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm" disabled={adding} style={{ height: '42px' }}>
            {adding ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.categoryName}</td>
                  <td>{c.description || '-'}</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="btn btn-danger-outline btn-sm"
                      title="Delete category"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesPage;
