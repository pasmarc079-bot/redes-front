import { useCallback, useEffect, useState } from 'react';
import { FiCopy, FiImage, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import MediaUpload from '@/components/upload/MediaUpload';

interface MediaItem {
  id: string;
  originalUrl: string;
  thumbnailUrl: string | null;
  mediumUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: string;
  createdAt: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || '/api/v1',
});

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch {
      setError('Error al cargar la biblioteca de media.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = useCallback(() => {
    load();
  }, [load]);

  const copyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.originalUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setError('No se pudo copiar la URL.');
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`¿Eliminar "${item.fileName}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/media/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((m) => m.id !== item.id));
    } catch {
      setError('Error al eliminar el archivo.');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-gray-800">Biblioteca de Media</h1>
          <p className="text-sm text-gray-500 mt-1">Sube y gestiona las imágenes del sitio.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <MediaUpload onUpload={handleUpload} />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando media...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-2">
            <FiImage className="text-4xl" />
            <p>No hay archivos aún. Sube tu primera imagen arriba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white"
              >
                <img
                  src={item.thumbnailUrl || item.originalUrl}
                  alt={item.fileName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs text-gray-700 truncate" title={item.fileName}>
                    {item.fileName}
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyUrl(item)}
                    className="p-2 rounded-lg bg-white text-gray-700 hover:text-gold"
                    title="Copiar URL"
                  >
                    <FiCopy />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-lg bg-white text-red-600"
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                {copiedId === item.id && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-green-600 text-white rounded-lg">
                    Copiada
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
