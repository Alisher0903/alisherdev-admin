import { Dialog } from '@headlessui/react'
import { X, Mail, User, Calendar, MessageSquare } from 'lucide-react'

interface Contact {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contact }) => {
  if (!contact) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Contact Message
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a 
                    href={`mailto:${contact.email}`}
                    className="font-medium text-primary-600 hover:text-primary-800"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.isRead 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {contact.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Subject</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{contact.subject}</p>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Message</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {contact.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <a
                href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                className="btn-primary px-4 py-2 flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </a>
              <button
                onClick={onClose}
                className="btn-secondary px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ContactModal