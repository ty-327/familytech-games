import styles from '@/styles/game_card_pitch.module.css';

export default function GameCardPitch({ pitch, title }) {

    return (
        <>
        <div className={styles.container}>

            <h3 className={styles.title}>PLAY NOW</h3>

            { pitch }

        </div>
        </>
    )

}