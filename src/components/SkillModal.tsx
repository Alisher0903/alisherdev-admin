import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X, Trash2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { axiosBase } from '@/api/api'

interface Skill {
  _id?: string
  name: string
  icon: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  description?: string
  category: string
}

interface SkillModalProps {
  isOpen: boolean
  onClose: () => void
  skill?: Skill | null
}

const SkillModal: React.FC<SkillModalProps> = ({ isOpen, onClose, skill }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [iconUrl, setIconUrl] = useState<string>('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Skill>()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (skill) {
      reset(skill)
      setIconUrl(skill.icon)
    } else {
      reset({
        name: '',
        icon: '',
        level: undefined,
        description: '',
        category: ''
      })
      setIconUrl('')
    }
  }, [skill, reset])

  const fetchCategories = async () => {
    try {
      const response = await axiosBase.get('/api/categories')
      setCategories(response.data.map((cat: any) => cat.name))
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const onSubmit = async (data: Skill) => {
    setIsLoading(true)
    
    try {
      const skillData = {
        ...data,
        icon: iconUrl
      }

      if (skill?._id) {
        await axiosBase.put(`/api/skills/${skill._id}`, skillData)
        toast.success('Skill updated successfully')
      } else {
        await axiosBase.post('/api/skills', skillData)
        toast.success('Skill created successfully')
      }
      
      onClose()
    } catch (error) {
      toast.error('Failed to save skill')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIconUpload = (url: string) => {
    setIconUrl(url)
    setValue('icon', url)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {skill ? 'Edit Skill' : 'Add New Skill'}
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
                Skill Name *
              </label>
              <input
                {...register('name', { required: 'Skill name is required' })}
                className="input"
                placeholder="Enter skill name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon *
              </label>
              {iconUrl ? (
                <div className="flex items-center space-x-4 mb-2">
                  <img src={iconUrl} alt="Skill icon" className="w-8 h-8" />
                  <span className="text-sm text-gray-600">{iconUrl}</span>
                  <button
                    type="button"
                    onClick={() => setIconUrl('')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <ImageUpload
                  onUpload={handleIconUpload}
                  accept="image/svg+xml,image/png,image/jpg,image/jpeg"
                  className="max-w-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="input"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                {...register('level')}
                className="input"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                className="textarea"
                rows={3}
                placeholder="Enter skill description"
              />
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
                disabled={isLoading || !iconUrl}
                className="btn-primary px-4 py-2"
              >
                {isLoading ? 'Saving...' : skill ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default SkillModal