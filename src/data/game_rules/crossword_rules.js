// import Animation from '@/components/animation.js';

export default function CrosswordRules({ isPitch }) {
  if (isPitch) {
    return (
      <div>
        The traditional crossword game with a twist--now all the words you need
        to discover are the names of your ancestors!
        {/* Todo: figure out if this is true */}
      </div>
    );
  }

  return (
    <>
      <div>
        The goal of this crossword puzzle is to fill in all the white boxes with
        the answers to a series of clues. Each row or column is a name of one of
        your ancestors. You can right-click on any clue to reveal the answer!
      </div>

      {/* <Animation video={} altText="Crossword Demonstration Video"></Animation> */}
      {/* Todo: create a crossWord video? */}
    </>
  );
}
