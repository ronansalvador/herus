'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './style.module.css' // Importando o CSS module

interface Item {
  id: number
  name: string
}

interface Servico {
  id: number
  cliente: string
}

export default function StockChange() {
  const [items, setItems] = useState<Item[]>([])
  const [services, setServices] = useState<Servico[]>([])

  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(
    undefined,
  )
  const [selectedServiceId, setSelectedServiceId] = useState<
    number | undefined
  >(undefined)
  const [change, setChange] = useState(0)
  const [itemSearchTerm, setItemSearchTerm] = useState<string>('')
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>('')
  const [isEntry, setIsEntry] = useState<boolean>(true) // Estado para determinar se é entrada ou saída

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/item')
        setItems(response.data)
      } catch (error) {
        console.log(error)
        toast.error('Erro ao carregar itens.')
      }
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/servico')
        setServices(response.data)
      } catch (error) {
        console.log(error)
        toast.error('Erro ao carregar serviços.')
      }
    }

    fetchItems()
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/estoque', {
        itemId: selectedItemId,
        servicoId: isEntry ? undefined : selectedServiceId, // Vincula o serviço apenas se não for entrada
        change: isEntry ? change : -change, // Altera o sinal da quantidade
      })
      toast.success('Estoque atualizado com sucesso!')
      console.log(response)
      setChange(0)
      setSelectedServiceId(undefined)
    } catch (error) {
      console.log(error)
      toast.error('Erro ao atualizar estoque.')
    }
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()),
  )

  const filteredServices = services.filter((service) =>
    service.cliente.toLowerCase().includes(serviceSearchTerm.toLowerCase()),
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entrada / Retirada de Itens</h1>

      {/* Botões para selecionar entrada ou saída */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${isEntry ? styles.active : ''}`}
          onClick={() => setIsEntry(true)}
        >
          Entrada
        </button>
        <button
          className={`${styles.button} ${!isEntry ? styles.active : ''}`}
          onClick={() => setIsEntry(false)}
        >
          Saída
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo de busca para itens */}
        <div>
          <label htmlFor="searchItem" className={styles.label}>
            Buscar Item
          </label>
          <input
            id="searchItem"
            type="text"
            value={itemSearchTerm}
            onChange={(e) => setItemSearchTerm(e.target.value)}
            placeholder="Digite o nome do item"
            className={styles.input}
          />
        </div>

        {/* Select de itens */}
        <div>
          <label htmlFor="item" className={styles.label}>
            Item
          </label>
          <select
            id="item"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
            className={styles.select}
          >
            <option value="">Selecione um item</option>
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de busca para serviços */}
        {!isEntry && (
          <div>
            <label htmlFor="searchService" className={styles.label}>
              Buscar Serviço
            </label>
            <input
              id="searchService"
              type="text"
              value={serviceSearchTerm}
              onChange={(e) => setServiceSearchTerm(e.target.value)}
              placeholder="Digite o nome do cliente ou obra"
              className={styles.input}
            />
          </div>
        )}

        {/* Select de serviços */}
        {!isEntry && (
          <div>
            <label htmlFor="service" className={styles.label}>
              Serviço
            </label>
            <select
              id="service"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              className={styles.select}
            >
              <option value="">Selecione um serviço</option>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.cliente}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input para mudança de quantidade */}
        <div>
          <label htmlFor="change" className={styles.label}>
            Mudança de Quantidade
          </label>
          <input
            id="change"
            type="number"
            value={change}
            onChange={(e) => setChange(Number(e.target.value))}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Atualizar Estoque
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}
