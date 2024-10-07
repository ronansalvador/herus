import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.nav}>menu</div>
      <div className={styles.content}>
        <h1>Iniciando</h1>
      </div>
    </div>
  )
}
