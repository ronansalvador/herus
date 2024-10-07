'use client'
import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CreateItem() {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/item', { name, quantity })
      console.log(response)
      toast.success('Item criado com sucesso!')
      setName('')
      setQuantity(0)
    } catch (error) {
      toast.error('Erro ao criar item.')
      console.log(error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Cadastrar Novo Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Nome do Item
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block font-medium">
            Quantidade Inicial
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Salvar
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}
