// import Animation from '@/components/animation.js';

export default function MatchingGameRules({ isPitch }) {
    if (isPitch) {
      return (
        <div>
          Remember the photos of your ancestors to earn points by yourself or with friends!
          {/* Todo: figure out if this is true */}
        </div>
      );
    }
  
    return (
      <>
        <div>
          Click on each card to reveal a picture of an ancestor. If you click on two matching
          cards on your turn you earn a point! Whoever has the most points when all cards
          are flipped over wins!
        </div>
  
        {/* <Animation video={} altText="Crossword Demonstration Video"></Animation> */}
        {/* Todo: create a crossWord video? */}
      </>
    );
  }