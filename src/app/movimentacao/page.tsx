'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Entrada / Retirada de Itens</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="item" className="block font-medium">
            Item
          </label>
          <select
            id="item"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">Selecione um item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="change" className="block font-medium">
            Mudança de Quantidade
          </label>
          <input
            id="change"
            type="number"
            value={change}
            onChange={(e) => setChange(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Atualizar Estoque
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}
