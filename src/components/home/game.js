import Link from 'next/link';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';

import styles from '@/styles/game.module.css';
import GameCardPitch from './game_card_pitch.js';
import GameCardComingSoon from './game_card_coming_soon.js';
import { useState } from 'react';


/** 
 * Used to display a game with its name and image on the home page.
 * Also holds the links to the games and a card animation to show instructions.
 * If a game is in development, it will not have a link, it will display a 
 * coming soon page instead of a game pitch, and the game image will be greyed out.
*/
export default function Game(props) {

  const { title, url, image, pitch, prodReady } = props;
  const [cardFlip, setCardFlip] = useState(false);


  const handleSwipe = () => {
    setCardFlip(!cardFlip);
  }

  //For swiping functionality on mobile
  const swipeHandler = useSwipeable({
    onSwipedLeft: handleSwipe,
    onSwipedRight: handleSwipe,
  });



  if (prodReady) {
    return (
      <div {...swipeHandler}>
        { prodGame(title, url, image, pitch, cardFlip) }
      </div>
    )
  }

  return (
    <div {...swipeHandler}>
      { devGame(title, image, cardFlip) }
    </div>
  )

  
}

function prodGame(title, url, image, pitch, cardFlip) {

  return (

    <Link href={url}>

      <div className={styles.column_container}>
      <div className={cardFlip ? styles.game_container_hover : styles.game_container}>

        <div className={styles.flip_card_inner}>
          <div className={styles.flip_card_front}>
          

            <Image
              src={image}
              alt="Game Picture"
              height="300px"
              width="250px"
              className={styles.image}
            />


            <div className={styles.title_box}>
              <h4 className={styles.title}>{title}</h4>
            </div>
          </div>


          <div className={styles.flip_card_back}>
            <GameCardPitch pitch={pitch} title={title}/>
          </div>


        </div>
      </div>
      </div>

    </Link>

  )

}




function devGame(title, image, cardFlip) {

  return (
    <div className={styles.column_container}>
    <div className={cardFlip ? styles.in_dev_game_container_hover : styles.in_dev_game_container}>

      <div className={styles.flip_card_inner}>
        <div className={styles.flip_card_front}>
        

          <Image
            src={image}
            alt="Game Picture"
            height="300px"
            width="250px"
            priority="true"
            className={styles.in_dev_image}
          />

          {/* Display Coming Soon sign */}
          <h1 className={styles.in_dev_sign}>
            Coming Soon
          </h1>


          <div className={styles.title_box}>
            <h4 className={styles.title}>{title}</h4>
          </div>

        </div>


        <div className={styles.flip_card_back}>
          <GameCardComingSoon/>
        </div>


      </div>
    </div>
    </div>
  )


}
