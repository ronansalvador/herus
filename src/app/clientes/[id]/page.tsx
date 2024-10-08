'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import styles from './style.module.css'

interface Movimentacao {
  id: number
  servicoId: number
  itemId: number
  change: number
}

interface Servico {
  id: number
  cliente: string
  changes: Movimentacao[]
}

interface Item {
  id: number
  name: string
}

interface Props {
  params: {
    id: number
  }
}

export default function ClienteMovements({ params }: Props) {
  const { id } = params
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [servico, setServico] = useState<Servico | null>(null)
  const [itens, setItens] = useState<Item[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicoResponse, itensResponse] = await Promise.all([
          axios.get(`/api/servico/${id}`),
          axios.get('/api/item'),
        ])
        setServico(servicoResponse.data)
        setMovimentacoes(servicoResponse.data.changes)
        setItens(itensResponse.data)
      } catch (error) {
        console.error(error)
        toast.error('Erro ao carregar dados.')
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // Agrupando movimentações por itemId e somando as quantidades, sem sinal de negativo
  const groupedMovimentacoes = movimentacoes.reduce((acc, movimentacao) => {
    const existing = acc.find((item) => item.itemId === movimentacao.itemId)

    if (existing) {
      existing.quantidade += Math.abs(movimentacao.change)
    } else {
      acc.push({
        itemId: movimentacao.itemId,
        quantidade: Math.abs(movimentacao.change),
      })
    }

    return acc
  }, [] as { itemId: number; quantidade: number }[])

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
        pdf.save(`${servico?.cliente}_movimentacoes.pdf`)
      })
    }
  }

  // Função para exportar Excel
  const exportExcel = () => {
    const dataToExport = groupedMovimentacoes.map((movimentacao) => {
      const item = itens.find((i) => i.id === movimentacao.itemId)
      return {
        Item: item ? item.name : 'Item não encontrado',
        Quantidade: movimentacao.quantidade,
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimentações')
    XLSX.writeFile(workbook, `${servico?.cliente}_movimentacoes.xlsx`)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Movimentações de Materiais: {servico?.cliente}
      </h1>
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
            <th>Item</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {groupedMovimentacoes.map((movimentacao, index) => {
            const item = itens.find((i) => i.id === movimentacao.itemId)
            return (
              <tr key={index}>
                <td>{item ? item.name : 'Item não encontrado'}</td>
                <td>{movimentacao.quantidade}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  )
}
