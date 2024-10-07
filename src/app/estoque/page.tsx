'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import styles from './style.module.css'

interface Item {
  id: number
  name: string
  quantity: number
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Estados para controlar a edição
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editName, setEditName] = useState<string>('')
  const [editQuantity, setEditQuantity] = useState<number>(0)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/item')
        setItems(response.data)
      } catch (error) {
        console.error(error)
        toast.error('Erro ao carregar itens.')
      }
    }
    fetchItems()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/item`, { data: { id } })
      setItems(items.filter((item) => item.id !== id))
      toast.success('Item deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar item.')
      console.error(error)
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItemId(item.id)
    setEditName(item.name)
    setEditQuantity(item.quantity)
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/item`, {
        id: editingItemId,
        name: editName,
        quantity: editQuantity,
      })
      setItems(
        items.map((item) =>
          item.id === editingItemId
            ? { ...item, name: editName, quantity: editQuantity }
            : item,
        ),
      )
      toast.success('Item atualizado com sucesso!')
      setEditingItemId(null)
      setEditName('')
      setEditQuantity(0)
    } catch (error) {
      toast.error('Erro ao atualizar item.')
      console.error(error)
    }
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportPDF = () => {
    const input = document.getElementById('table-to-pdf')
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()

        const imgWidth = pdf.internal.pageSize.getWidth()
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save('items.pdf')
      })
    }
  }

  const exportExcel = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataToExport = filteredItems.map(({ id, ...rest }) => rest)
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Itens')
    XLSX.writeFile(workbook, 'items.xlsx')
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Itens</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por nome"
        className={styles.searchInput}
      />
      <div className={styles.buttonGroup}>
        <button
          onClick={exportPDF}
          className={`${styles.button} ${styles.pdfButton}`}
        >
          Gerar PDF
        </button>
        <button
          onClick={exportExcel}
          className={`${styles.button} ${styles.excelButton}`}
        >
          Exportar Excel
        </button>
      </div>
      <table id="table-to-pdf" className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                {editingItemId === item.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editingItemId === item.id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    className={styles.editInput}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td className={styles.tdButtons}>
                {editingItemId === item.id ? (
                  <button
                    onClick={handleUpdate}
                    className={styles.updateButton}
                  >
                    Atualizar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className={styles.editButton}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={styles.deleteButton}
                    >
                      Deletar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  )
}
