import { useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@/contexts/UserContext';
import styles from '@/styles/Person.module.css';

export default function Example() {
  const { userFSData } = useUser();
  //console.log("data out of context " + userFSData);

  useEffect(() => {
    if (userFSData) {
      //console.log("data in if statement " + Array.from(userFSData.values()).length);
      const fsDataObj = Object.fromEntries(userFSData);
      let ascendancyNums = Array.from(userFSData.values()).map((person) => person.a_num);
      getQuestions(fsDataObj, ascendancyNums);
    }
  }, [])

  return (
    <div>
      <h1>Example</h1>
      {userFSData && Array.from(userFSData.values()).map((person, key) => {
        // return (
        //   <div key={key}>
        //     {value.a_num}
        //   </div>
        // )
        return <Person personData={person} key={key} />;
      })}
    </div>
  );
}

// NOTE: Components should be in separate files to reduce confusion.
// This is for demonstration purposes only.
function Person({ personData }) {
  return (
    <div className={styles.container}>
      <h2>{personData.name.full}</h2>
      <h2>{personData.gender}</h2>
      <h2>{personData.lifespan.string}</h2>
      <h2>{personData.birthDate.original}</h2>
      <h2>{personData.birthPlace}</h2>
    </div>
  );
}

async function getQuestions(userFSData, ascendancyNums) {
  const url = "http://localhost:3000/api/questiongenerator"
  await axios.post(url, {userFSData, ascendancyNums}).then((res) => {
    console.log('res:', res)
  })
  .catch((err) => {
    console.log('err:', err)
  })
}


