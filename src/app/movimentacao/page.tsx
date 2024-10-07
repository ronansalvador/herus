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

export default function StockChange() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(
    undefined,
  )
  const [change, setChange] = useState(0)
  const [searchTerm, setSearchTerm] = useState<string>('') // Estado para armazenar o termo de busca

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
    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/estoque', {
        itemId: selectedItemId,
        change,
      })
      toast.success('Estoque atualizado com sucesso!')
      console.log(response)
      setChange(0)
    } catch (error) {
      console.log(error)
      toast.error('Erro ao atualizar estoque.')
    }
  }

  // Função para filtrar os itens com base no termo de busca
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entrada / Retirada de Itens</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="search" className={styles.label}>
            Buscar Item
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
            placeholder="Digite o nome do item"
            className={styles.input}
          />
        </div>
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
