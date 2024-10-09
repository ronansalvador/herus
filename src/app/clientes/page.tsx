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
}

interface Change {
  id: number
  itemId: number
  change: number
  item: Item
}

interface Servico {
  id: number
  cliente: string
  createdAt: string
  changes: Change[]
}

export default function ServiceMovements() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false) // Estado de loading

  useEffect(() => {
    const fetchServicos = async () => {
      setLoading(true) // Inicia o loading
      try {
        const response = await axios.get('/api/servico')
        setServicos(response.data)
      } catch (error) {
        console.log(error)
        toast.error('Erro ao carregar serviços.')
      } finally {
        setLoading(false) // Finaliza o loading
      }
    }

    fetchServicos()
  }, [])

  // Filtrar serviços com base no termo de busca
  const filteredServicos = servicos.filter((servico) =>
    servico.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Função para exportar PDF
  const exportPDF = () => {
    const input = document.getElementById('table-to-pdf')
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()

        const imgWidth = pdf.internal.pageSize.getWidth()
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save('movimentacoes.pdf')
      })
    }
  }

  // Função para exportar Excel
  const exportExcel = () => {
    const dataToExport = filteredServicos.flatMap((servico) =>
      servico.changes.map((change) => ({
        Servico: servico.cliente,
        Item: change.item.name,
        Quantidade: Math.abs(change.change), // Removendo o negativo
      })),
    )

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimentações')
    XLSX.writeFile(workbook, 'movimentacoes.xlsx')
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Movimentações de Materiais por Serviço</h1>
      <div>
        <label htmlFor="search" className={styles.label}>
          Filtrar por Cliente/Serviço
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome do cliente ou serviço"
          className={styles.input}
        />
      </div>
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

      {/* Exibe uma mensagem de loading enquanto os dados estão sendo carregados */}
      {loading ? (
        <div className={styles.loading}>Carregando serviços...</div>
      ) : (
        <table id="table-to-pdf" className={styles.table}>
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Item</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicos.map((servico, index) =>
              servico.changes.map((change, subIndex) => (
                <tr key={`${index}-${subIndex}`}>
                  {subIndex === 0 && (
                    <td rowSpan={servico.changes.length}>{servico.cliente}</td>
                  )}
                  <td>{change.item.name}</td>
                  <td>{Math.abs(change.change)}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  )
}
