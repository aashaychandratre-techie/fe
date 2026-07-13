"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Image as ImageIcon, UploadCloud } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function ServicesAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchServices = async () => {
    try {
      setFetching(true);
      const res = await axios.get("http://localhost:8080/api/services");
      setServices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const uploadImage = async () => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:8080/api/upload/service-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  };

  const handleSave = async () => {
    if (!name || !description || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = preview;

      if (file) {
        imageUrl = await uploadImage();
      }

      const serviceData = {
        name,
        description,
        price: Number(price),
        imageUrl,
      };

      if (editId) {
        await axios.put(
          `http://localhost:8080/api/services/${editId}`,
          serviceData
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/services",
          serviceData
        );
      }

      setName("");
      setDescription("");
      setPrice("");
      setFile(null);
      setPreview("");
      setEditId(null);

      fetchServices();
    } catch (error) {
      console.error(error);
      alert("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/services/${id}`
      );
      fetchServices();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (service: Service) => {
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price.toString());
    setEditId(service.id);

    if (service.imageUrl) {
      setPreview(`http://localhost:8080${service.imageUrl}`);
    } else {
      setPreview("");
    }
    setFile(null);
  };

  const handleCancelEdit = () => {
    setName("");
    setDescription("");
    setPrice("");
    setEditId(null);
    setPreview("");
    setFile(null);
  };

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col min-h-0 min-w-0 relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                  Service Management
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage the core services available on the platform
                </p>
              </div>

              <div className="flex items-center bg-white dark:bg-[#111827] rounded-full px-5 py-2.5 shadow-sm border border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                Total Services: &nbsp;<span className="text-emerald-600 dark:text-emerald-400 text-lg">{services.length}</span>
              </div>
            </div>

            {/* FORM */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
              
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Plus size={16} strokeWidth={3} />
                </div>
                {editId ? "Update Existing Service" : "Add New Service"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Deep Home Cleaning"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-full flex flex-col">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      placeholder="Describe the service details and inclusions..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full flex-1 min-h-[120px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:text-white transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 relative z-10">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service Image</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                        if (f) {
                          setPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="w-40 h-28 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-gray-400 group-hover:border-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-all relative overflow-hidden z-10">
                      {preview ? (
                        <>
                          <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <UploadCloud className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={28} className="mb-2 opacity-50 group-hover:text-emerald-500 transition-colors" />
                          <span className="text-xs font-medium group-hover:text-emerald-600 transition-colors">Upload Image</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 sm:flex-none sm:w-48 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? "Processing..." : editId ? "Update Service" : "Save Service"}
                    </button>
                    {editId && (
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="px-6 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto p-1">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 font-semibold rounded-tl-2xl w-24">Image</th>
                      <th className="px-6 py-4 font-semibold">Service Info</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold text-center rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {fetching ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading services...
                          </div>
                        </td>
                      </tr>
                    ) : services.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <ImageIcon size={48} className="mb-4 opacity-20" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No services found</p>
                            <p className="text-sm mt-1">Add a new service to get started</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                          <td className="px-6 py-4">
                            {service.imageUrl ? (
                              <img
                                src={`http://localhost:8080${service.imageUrl}`}
                                alt={service.name}
                                className="w-14 h-14 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">{service.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-sm">
                              {service.description}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg inline-block border border-emerald-100 dark:border-emerald-800/30">
                              ₹{service.price}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(service)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all dark:bg-blue-900/30 dark:text-blue-400"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                onClick={() => handleDelete(service.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all dark:bg-red-900/30 dark:text-red-400"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}