'use client'
import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './style.module.css'

export default function CreateItem() {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('') // Adicionando o estado do campo price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/item', { name, quantity, price }) // Enviando o price
      console.log(response)
      toast.success('Item criado com sucesso!')
      setName('')
      setQuantity('')
      setPrice('') // Resetando o campo price após sucesso
    } catch (error) {
      toast.error('Erro ao criar item.')
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar Novo Item</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="name" className={styles.label}>
            Nome do Item
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className={styles.label}>
            Quantidade Inicial
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className={styles.label}>
            Preço
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Salvar
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}
