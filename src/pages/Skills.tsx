import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Code } from 'lucide-react'
import SkillModal from '../components/SkillModal'
import { axiosBase } from '@/api/api'

interface Skill {
  _id: string
  name: string
  icon: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  description?: string
  category: string
}

interface SkillCategory {
  _id: string
  name: string
  skills: Skill[]
}

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await axiosBase.get('/api/skills')
      setSkillCategories(response.data)
    } catch (error) {
      toast.error('Failed to fetch skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      await axiosBase.delete(`/api/skills/${id}`)
      fetchSkills()
      toast.success('Skill deleted successfully')
    } catch (error) {
      toast.error('Failed to delete skill')
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingSkill(null)
    fetchSkills()
  }

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-100 text-green-800'
      case 'Advanced':
        return 'bg-blue-100 text-blue-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Beginner':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your skills and technologies
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {skillCategories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.skills.map((skill) => (
                <div
                  key={skill._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 flex items-center justify-center">
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-6 h-6"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            // e.currentTarget.nextElementSibling!.style.display = 'block'
                          }}
                        />
                        <Code className="w-6 h-6 text-gray-400 hidden" />
                      </div>
                      <h3 className="font-medium text-gray-900">{skill.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {skill.level && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  )}
                  {skill.description && (
                    <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skillCategories.length === 0 && (
        <div className="text-center py-12">
          <Code className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No skills</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first skill.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </button>
          </div>
        </div>
      )}

      <SkillModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        skill={editingSkill}
      />
    </div>
  )
}

export default Skills