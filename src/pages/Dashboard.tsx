import { useState, useEffect } from 'react'
import { FolderOpen, Code, TrendingUp, Users } from 'lucide-react'
import { axiosBase } from '@/api/api'

interface Stats {
  totalProjects: number
  totalSkills: number
  totalCategories: number
  recentActivity: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalSkills: 0,
    totalCategories: 0,
    recentActivity: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axiosBase.get('/api/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Skills',
      value: stats.totalSkills,
      icon: Code,
      color: 'bg-green-500'
    },
    {
      name: 'Skill Categories',
      value: stats.totalCategories,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Recent Updates',
      value: stats.recentActivity,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your portfolio admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute ${card.color} rounded-md p-3`}>
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {card.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href="/projects"
              className="relative block w-full bg-white p-6 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Manage Projects
                  </h4>
                  <p className="text-sm text-gray-500">
                    Add, edit, or delete portfolio projects
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/skills"
              className="relative block w-full bg-white p-6 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <div className="flex items-center">
                <Code className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Manage Skills
                  </h4>
                  <p className="text-sm text-gray-500">
                    Update your skills and technologies
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard