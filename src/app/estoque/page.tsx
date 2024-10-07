'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'

interface Item {
  id: number
  name: string
  quantity: number
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportPDF = () => {
    const input = document.getElementById('table-to-pdf')
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()

        const imgWidth = pdf.internal.pageSize.getWidth() // Largura da página PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width // Ajusta a altura proporcionalmente à largura

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight) // Usa a largura e altura proporcionais
        pdf.save('items.pdf')
      })
    }
  }

  const exportExcel = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataToExport = filteredItems.map(({ id, ...rest }) => rest) // Remove o campo id
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Itens')
    XLSX.writeFile(workbook, 'items.xlsx')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Lista de Itens</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por nome"
        className="border px-4 py-2 mb-4 w-full"
      />
      <div className="flex gap-4 mb-4">
        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Gerar PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Exportar Excel
        </button>
      </div>
      <table id="table-to-pdf" className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Quantidade</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  )
}
