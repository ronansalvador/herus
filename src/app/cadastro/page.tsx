'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation' // Para redirecionar o usuário
import styles from './style.module.css'

interface Servico {
  id: number
  cliente: string
}

export default function ServiceForm() {
  const [serviceId, setServiceId] = useState<number | undefined>(undefined)
  const [cliente, setCliente] = useState<string>('')
  const [services, setServices] = useState<Servico[]>([])
  const [filter, setFilter] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false) // Estado de carregamento
  const router = useRouter() // Hook do Next.js para redirecionar

  const fetchServices = async () => {
    setLoading(true) // Começa a carregar
    try {
      const response = await axios.get('/api/servico')
      setServices(response.data)
    } catch (error) {
      console.log(error)
      toast.error('Erro ao carregar serviços.')
    } finally {
      setLoading(false) // Termina de carregar
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) // Começa a carregar
    try {
      if (serviceId) {
        await axios.put(`/api/servico/${serviceId}`, { cliente })
        toast.success('Serviço atualizado com sucesso!')
      } else {
        await axios.post('/api/servico', { cliente })
        toast.success('Serviço criado com sucesso!')
      }
      setCliente('')
      setServiceId(undefined)
      await fetchServices() // Recarrega a lista de serviços
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar/atualizar serviço.')
    } finally {
      setLoading(false) // Termina de carregar
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/servico/${id}`)
      toast.success('Serviço excluído com sucesso!')
      setServices(services.filter((service) => service.id !== id))
    } catch (error) {
      console.log(error)
      toast.error('Erro ao excluir serviço.')
    }
  }

  const handleSelectService = (id: number) => {
    const selectedService = services.find((service) => service.id === id)
    if (selectedService) {
      setServiceId(selectedService.id)
      setCliente(selectedService.cliente)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }

  const handleViewMaterials = (id: number) => {
    router.push(`/clientes/${id}`)
  }

  const filteredServices = services.filter((service) =>
    service.cliente.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {serviceId ? 'Atualizar Serviço' : 'Criar Serviço'}
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cliente" className={styles.label}>
            Nome do Cliente / Obra
          </label>
          <input
            id="cliente"
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className={styles.searchInput}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={`${styles.button} ${styles.pdfButton}`}
          >
            {serviceId ? 'Atualizar Serviço' : 'Criar Serviço'}
          </button>
        </div>
      </form>
      <div className={styles.filterContainer}>
        <label htmlFor="filter" className={styles.label}>
          Filtrar por nome do cliente
        </label>
        <input
          id="filter"
          type="text"
          value={filter}
          onChange={handleFilterChange}
          className={styles.searchInput}
        />
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome do Cliente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>{service.cliente}</td>
                <td className={styles.tdButtons}>
                  <button
                    onClick={() => handleSelectService(service.id)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => handleViewMaterials(service.id)}
                    className={styles.viewButton}
                  >
                    Lista de Material
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer />
    </div>
  )
}
