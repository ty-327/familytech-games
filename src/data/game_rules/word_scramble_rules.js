export default function WordScrambleRules({ isPitch }) {
  if (isPitch) {
    return (
      <div>
        Oh no! Someone has scrambled all of your ancestors' names. Help set
        things right by decyphering their true identities!
      </div>
    );
  }

  return (
    <div>
      Unscramble the name of your ancestors. Type in all the unscrambled names
      to win the game!
      {/* <Animation video={} altText="Crossword Demonstration Video"></Animation> */}
      {/* Todo: create a crossWord video */}
    </div>
  );
}
