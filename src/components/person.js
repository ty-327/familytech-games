import styles from "@/styles/Person.module.css";
import { PersonImage } from "./person_image";

export default function Person({ personData }) {
  let personPageUrl =
    "https://www.familysearch.org/tree/person/details/" + personData.pid;
  return (
    <div className={styles.container}>
      <div className={styles.person_header}>
        <PersonImage
          pid={personData.pid}
          imageHeight={100}
          imageWidth={100}
          gender={personData.gender}
        />

        <div className={styles.header_info}>
          <a
            href={personPageUrl}
            target="_blank"
            rel="noreferrer"
            id={styles.display_name}
          >
            {personData.name.full}
          </a>
          <p>
            {personData.pid} · {personData.lifespan.string}
          </p>
        </div>
      </div>
      <div className={styles.person_info}>
        <p>
          Birthday: {personData.birthDate.month} {personData.birthDate.day}{" "}
          {personData.birthDate.year}
        </p>
        <p>Birth Place: {personData.birthPlace}</p>
      </div>
      <button id={styles.link_btn}>
        <a href={personPageUrl} target="_blank" rel="noreferrer">
          Visit {personData.name.full} on FamilySearch
        </a>
      </button>
    </div>
  );
}
