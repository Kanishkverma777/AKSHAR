import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Generic CRUD hook for any API module.
 * @param {Object} apiService — must export { getAll, create, update, remove }
 * @param {Object} fetchParams — optional query params for getAll
 */
export default function useCrud(apiService, fetchParams = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getAll(fetchParams);
      setData(result.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiService, JSON.stringify(fetchParams)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (formData) => {
    try {
      await apiService.create(formData);
      toast.success('Record created successfully');
      await fetchData();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await apiService.update(id, formData);
      toast.success('Record updated successfully');
      await fetchData();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.remove(id);
      toast.success('Record deactivated');
      await fetchData();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
