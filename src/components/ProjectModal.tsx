import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X, Trash2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { axiosBase } from '@/api/api'

interface Project {
  _id?: string
  name: string
  favicon: string
  imageUrl: string[]
  description: string
  sourceCodeHref: string
  liveWebsiteHref?: string
  technologies: string[]
  featured: boolean
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project?: Project | null
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [faviconUrl, setFaviconUrl] = useState<string>('')
  const [technologies, setTechnologies] = useState<string>('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Project>()

  useEffect(() => {
    if (project) {
      reset(project)
      setImageUrls(project.imageUrl)
      setFaviconUrl(project.favicon)
      setTechnologies(project.technologies.join(', '))
    } else {
      reset({
        name: '',
        favicon: '',
        imageUrl: [],
        description: '',
        sourceCodeHref: '',
        liveWebsiteHref: '',
        technologies: [],
        featured: false
      })
      setImageUrls([])
      setFaviconUrl('')
      setTechnologies('')
    }
  }, [project, reset])

  const onSubmit = async (data: Project) => {
    setIsLoading(true)
    
    try {
      const projectData = {
        ...data,
        favicon: faviconUrl,
        imageUrl: imageUrls,
        technologies: technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
      }

      if (project?._id) {
        await axiosBase.put(`/api/projects/${project._id}`, projectData)
        toast.success('Project updated successfully')
      } else {
        await axiosBase.post('/api/projects', projectData)
        toast.success('Project created successfully')
      }
      
      onClose()
    } catch (error) {
      toast.error('Failed to save project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFaviconUpload = (url: string) => {
    setFaviconUrl(url)
    setValue('favicon', url)
  }

  const handleImageUpload = (url: string) => {
    setImageUrls(prev => [...prev, url])
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl my-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {project ? 'Edit Project' : 'Add New Project'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  {...register('name', { required: 'Project name is required' })}
                  className="input"
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma separated) *
                </label>
                <input
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  className="input"
                  placeholder="React, TypeScript, Tailwind CSS"
                />
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon *
              </label>
              {faviconUrl ? (
                <div className="flex items-center space-x-4">
                  <img src={faviconUrl} alt="Favicon" className="w-8 h-8" />
                  <span className="text-sm text-gray-600">{faviconUrl}</span>
                  <button
                    type="button"
                    onClick={() => setFaviconUrl('')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <ImageUpload
                  onUpload={handleFaviconUpload}
                  accept="image/x-icon,image/png,image/svg+xml"
                  className="max-w-sm"
                />
              )}
            </div>

            {/* Project Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Images *
              </label>
              
              {/* Existing Images */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Images */}
              <ImageUpload
                onUpload={handleImageUpload}
                multiple={true}
                className="max-w-md"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="textarea"
                rows={4}
                placeholder="Enter project description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Code URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Code URL *
                </label>
                <input
                  {...register('sourceCodeHref', { required: 'Source code URL is required' })}
                  className="input"
                  placeholder="https://github.com/username/project"
                />
                {errors.sourceCodeHref && (
                  <p className="text-red-500 text-sm mt-1">{errors.sourceCodeHref.message}</p>
                )}
              </div>

              {/* Live Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live Website URL
                </label>
                <input
                  {...register('liveWebsiteHref')}
                  className="input"
                  placeholder="https://project-demo.com"
                />
              </div>
            </div>

            {/* Featured Project */}
            <div className="flex items-center">
              <input
                {...register('featured')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Project
              </label>
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
                disabled={isLoading || !faviconUrl || imageUrls.length === 0}
                className="btn-primary px-4 py-2"
              >
                {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ProjectModal