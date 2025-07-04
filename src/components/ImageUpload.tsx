import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  multiple?: boolean
  accept?: string
  maxSize?: number // in MB
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  multiple = false,
  accept = 'image/*',
  maxSize = 5,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (!files.length) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      
      if (multiple) {
        Array.from(files).forEach(file => {
          if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File ${file.name} is too large. Max size is ${maxSize}MB`)
            return
          }
          formData.append('files', file)
        })
        
        const response = await axios.post('/api/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        
        response.data.files.forEach((file: any) => {
          onUpload(file.url)
        })
        
        toast.success(`${response.data.files.length} files uploaded successfully`)
      } else {
        const file = files[0]
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(`File is too large. Max size is ${maxSize}MB`)
          return
        }
        
        formData.append('file', file)
        
        const response = await axios.post('/api/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        
        onUpload(response.data.url)
        toast.success('File uploaded successfully')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-400 transition-colors ${
          dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
        } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          
          <div className="text-sm text-gray-600">
            {isUploading ? (
              <p>Uploading...</p>
            ) : (
              <>
                <p className="font-medium">
                  Click to upload or drag and drop
                </p>
                <p>
                  {accept} up to {maxSize}MB
                  {multiple && ' (multiple files allowed)'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload