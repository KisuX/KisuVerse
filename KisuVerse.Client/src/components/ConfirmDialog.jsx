import { useLanguage } from '../LanguageContext'

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  const { t } = useLanguage()

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-primary-dark mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-full border hover:bg-gray-50 transition">
            {t('admin.cancel')}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-full bg-red-600 text-white hover:opacity-90 transition">
            {t('admin.confirmDelete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
