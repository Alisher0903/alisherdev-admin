import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

interface Category {
  _id?: string
  name: string
  description?: string
  order: number
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category }) => {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Category>()

  useEffect(() => {
    if (category) {
      reset(category)
    } else {
      reset({
        name: '',
        description: '',
        order: 0
      })
    }
  }, [category, reset])

  const onSubmit = async (data: Category) => {
    setIsLoading(true)
    
    try {
      if (category?._id) {
        await axios.put(`/api/categories/${category._id}`, data)
        toast.success('Category updated successfully')
      } else {
        await axios.post('/api/categories', data)
        toast.success('Category created successfully')
      }
      
      onClose()
    } catch (error) {
      toast.error('Failed to save category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {category ? 'Edit Category' : 'Add New Category'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                {...register('name', { required: 'Category name is required' })}
                className="input"
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                className="textarea"
                rows={3}
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                {...register('order', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Order must be 0 or greater' }
                })}
                type="number"
                className="input"
                placeholder="Enter display order"
              />
              {errors.order && (
                <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-4 py-2"
              >
                {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default CategoryModal