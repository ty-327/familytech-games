import Board from "@/components/crossword/board";
import styles from "@/styles/crossword.module.css"

function CrosswordPage() {

  return (
    <>
    <h1></h1>
    <div className={styles.container}>
      
      <Board/>
      
    </div>
    </>
  );
}

export default CrosswordPage;