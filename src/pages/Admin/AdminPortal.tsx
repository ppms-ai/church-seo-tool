import React, { useState } from 'react';
import { useChurches } from '../../hooks/useChurches';
import { Church, supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function AdminPortal() {
  const { churches, loading, addChurch, updateChurch, deleteChurch } = useChurches();
  const [editing, setEditing] = useState<Church | null>(null);
  const [form, setForm] = useState<Partial<Church>>({ name: '', slug: '', contact_email: '', notion_page_url: '' });

  const handleEdit = (church: Church) => {
    setEditing(church);
    setForm(church);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: '', slug: '', contact_email: '', notion_page_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateChurch(editing.id, form);
        toast.success('Church updated');
      } else {
        await addChurch(form);
        toast.success('Church added');
      }
      handleCancel();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this church?')) return;
    try {
      await deleteChurch(id);
      toast.success('Church deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleResetPassword = async (church: Church) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(church.contact_email);
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error('Failed to send reset email');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Portal</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg space-y-4 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Name"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Slug"
            value={form.slug || ''}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Contact Email"
            type="email"
            value={form.contact_email || ''}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            required
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Notion Page URL"
            value={form.notion_page_url || ''}
            onChange={(e) => setForm({ ...form, notion_page_url: e.target.value })}
          />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editing ? 'Update Church' : 'Add Church'}
          </button>
          {editing && (
            <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-4 rounded-lg border">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {churches.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.contact_email}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-blue-600" onClick={() => handleEdit(c)}>
                      Edit
                    </button>
                    <button className="text-red-600" onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                    <button className="text-gray-600" onClick={() => handleResetPassword(c)}>
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
