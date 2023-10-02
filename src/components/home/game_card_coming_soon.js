import styles from '@/styles/game_card_pitch.module.css';

export default function GameCardComingSoon() {

    return (
        <>
        <div className={styles.container}>

            <h3 className={styles.title}>COMING SOON</h3>

            This game is currently in development. 
            We are working to release it as soon as possible. 
            Thank you for your patience!

            <br/>
            <br/>

            In the meantime, try playing one of our other games!

        </div>
        </>
    )

}