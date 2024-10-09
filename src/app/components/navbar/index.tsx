// Navbar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './style.module.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  // Função para fechar o menu
  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Estoque Herus</div>
      <div className={styles.menuIcon} onClick={toggleMenu}>
        {isOpen ? '✖️' : '☰'}
      </div>
      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
        <li>
          <Link href="/criar" onClick={closeMenu}>
            Cadastro de Produto
          </Link>
        </li>
        <li>
          <Link href="/" onClick={closeMenu}>
            Estoque
          </Link>
        </li>
        <li>
          <Link href="/movimentacao" onClick={closeMenu}>
            Entrada / Saída
          </Link>
        </li>
        <li>
          <Link href="/cadastro" onClick={closeMenu}>
            Clientes
          </Link>
        </li>
        <li>
          <Link href="/clientes" onClick={closeMenu}>
            Movimentações
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
