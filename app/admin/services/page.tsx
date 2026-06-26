"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/services");
      setServices(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("all services", services);

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
    const confirmDelete = confirm(
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Service Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage all services from one place
          </p>
        </div>

        <div className="bg-white border rounded-lg px-4 py-2 text-sm font-medium">
          Total Services: {services.length}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">

        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Plus size={18} />
          {editId ? "Update Service" : "Add New Service"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm md:col-span-2"
          />
        </div>

        <div className="mt-4">
          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);

              if (f) {
                setPreview(URL.createObjectURL(f));
              }
            }}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="h-28 w-52 object-cover rounded-lg border mt-3"
            />
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editId
            ? "Update Service"
            : "Save Service"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Image
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Service Name
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Description
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Price
                </th>

                <th className="text-center px-4 py-3 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-500"
                  >
                    No services available
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3">
                      {service.imageUrl ? (
                        <img
                          src={`http://localhost:8080${service.imageUrl}`}
                          alt={service.name}
                          className="h-12 w-12 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-slate-200 rounded-lg" />
                      )}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {service.name}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs">
                      <div className="truncate">
                        {service.description}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-blue-600">
                      ₹{service.price}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => handleEdit(service)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(service.id)
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-100 text-red-600 text-xs hover:bg-red-200"
                        >
                          <Trash2 size={12} />
                          Delete
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
  );
}