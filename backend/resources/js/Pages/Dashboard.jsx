import { useEffect } from 'react'
import { router } from '@inertiajs/react'

export default function Dashboard({ auth }) {
  useEffect(() => {
    if (!auth?.user) return

    const role = auth.user.role

    switch (role) {
      case 'admin':
        router.visit('/admin/dashboard')
        break
      case 'recolector':
        router.visit('/recolector/dashboard')
        break
      default:
        router.visit('/usuario/dashboard')
        break
    }
  }, [auth])

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <h4 className="text-muted">Cargando tu panel...</h4>
    </div>
  )
}
