import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { User, Lock, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface ProfileData {
  username: string
  email: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const Profile = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProfileData>()

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email
      })
    }
  }, [user, reset])

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ProfileData) => {
    setIsLoading(true)
    
    try {
      const updateData: any = {
        username: data.username,
        email: data.email
      }

      if (showPasswordFields && data.newPassword) {
        if (data.newPassword !== data.confirmPassword) {
          toast.error('New passwords do not match')
          return
        }
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      await axios.put('/api/profile', updateData)
      toast.success('Profile updated successfully')
      
      if (showPasswordFields) {
        setShowPasswordFields(false)
        reset({
          username: data.username,
          email: data.email
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-sm text-gray-600">Update your account information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  {...register('username', { required: 'Username is required' })}
                  className="input"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  {showPasswordFields ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordFields && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      {...register('currentPassword', { 
                        required: showPasswordFields ? 'Current password is required' : false 
                      })}
                      type="password"
                      className="input"
                      placeholder="Enter current password"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      {...register('newPassword', { 
                        required: showPasswordFields ? 'New password is required' : false,
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      type="password"
                      className="input"
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      {...register('confirmPassword', { 
                        required: showPasswordFields ? 'Please confirm your password' : false,
                        validate: value => 
                          !showPasswordFields || value === newPassword || 'Passwords do not match'
                      })}
                      type="password"
                      className="input"
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-6 py-2 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile