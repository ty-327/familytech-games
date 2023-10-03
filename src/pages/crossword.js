import Board from "@/components/crossword/board";
import styles from "@/styles/crossword.module.css"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
function CrosswordPage() {

  return (
    <>
    <div className="m-3">
      <br/>
      <h1>Family Search Crossword!!</h1>
      <br/>

      <div className={styles.container}>
      
        <Board/>
      
      </div>
      <div className="text-center">
        <br />
        If you need help getting to know your relatives, visit <a href="https://www.familysearch.org/tree/pedigree/landscape/">familysearch.org</a>!!
      </div>
    </div>
    
    </>
  );
}

export default CrosswordPage;