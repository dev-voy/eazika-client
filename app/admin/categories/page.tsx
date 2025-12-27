"use client";

import React, { useState, useEffect } from "react";
import { AdminService } from "@/services/adminService";
import { Plus, Tag, Loader2, Save, X, Edit } from "lucide-react";
import { toast } from "sonner";

interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editCat, setEditCat] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await AdminService.getAllCategories();
      setCategories(data);
    } catch (e) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;

    setIsSubmitting(true);
    try {
      await AdminService.createCategory(newCat.name, newCat.description);
      toast.success("Category created!");
      setNewCat({ name: "", description: "" });
      fetchCategories(); 
    } catch (e) {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setEditCat({ name: cat.name, description: cat.description || "" });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editCat.name) return;

    setIsUpdating(true);
    try {
      await AdminService.updateCategory(editingCategory.id, editCat.name, editCat.description);
      toast.success("Category updated!");
      setIsEditModalOpen(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (e) {
      toast.error("Failed to update category");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Product Categories
        </h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((s) => !s)}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          {showCreateForm ? (
            <>
              <X size={18} /> Close Form
            </>
          ) : (
            <>
              <Plus size={18} /> Add Category
            </>
          )}
        </button>
      </div>

      {/* Create Form (toggled) */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">
            Add New Category
          </h3>
          <form
            onSubmit={handleCreate}
            className="flex flex-col md:flex-row gap-4 items-start"
          >
            <div className="flex-1 w-full">
              <input
                placeholder="Category Name (e.g., Dairy)"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1 w-full">
              <input
                placeholder="Description (Optional)"
                value={newCat.description}
                onChange={(e) =>
                  setNewCat({ ...newCat, description: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !newCat.name}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Plus size={18} />
              )}
              Add
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-10 flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full flex items-center justify-center">
                <Tag size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {cat.name}
                </h4>
                {cat.description && (
                  <p className="text-xs text-gray-500">{cat.description}</p>
                )}
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
                >
                  <Edit size={14} /> Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No categories found.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Category</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  value={editCat.name}
                  onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input
                  value={editCat.description}
                  onChange={(e) => setEditCat({ ...editCat, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editCat.name}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
