
# FamilyTech Games

### Project Description and Purpose
FamilyTech Games serves up different games, typically dependent upon the user's family history data, all accessible from the home screen. FamilyTech Games was  created to keep our old games easily maintainable by structuring them under a uniform framework and updating them to have a more modern look and appeal. It also provides a single backend service that serves family history questions across multiple games. With this application, it is easier to create and deploy new games. We build and maintain games to encourage genealogy work and to help people learn about their family in fun, engaging ways.


## To Run Locally

 - Git clone this repo down to your local server and enter the project folder. Then on the command line, enter the following commands:
 - ```cd /src/```
Contained within the src/ directory is the Next.js project, so you must be within this directory to start it up.
 - ```npm install```
Then you must install the required dependencies. Here it is done with the Node Package Manager service.
 - ```npm run dev```
There are different ways to run the project (listed under "scripts" in package.json). To run in development mode, execute this command.
 - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Technologies and Dependencies Required
- The frontend is a React application that uses the NextJS library using the `create-next-app` command. The backend uses NodeJS.


## Deployment Strategy
- Deployments are handled through Github Actions and are triggered by pull requests from `dev` into the deployment branch `main`. 


## File Structure

### Game Files
| Game | JS | CSS | README.md |
|:------------ |:------ |:------ |:------- |
| Crossword | [crossword.js](./src/pages/crossword.js) | [crossword.module.css](./src/styles/crossword.module.css) | [Crossword.md](./readme-files/Crossword.md) |
| Word Scramble | [word_scramble.js](./src/pages/word_scramble.js) | [word_scramble.module.css](./src/styles/word_scramble.module.css) | [WordScramble.md](./readme-files/WordScramble.md) |
| Word Search | [word_search.js](./src/pages/word_search.js) | [word_search.module.css](./src/styles/word_search.module.css) | [WordSearch.md](./readme-files/WordSearch.md) |



### To create a new game

1. Add the game image that will appear on the game's card on the home page to /src/public/game_images/. Game image files have a ratio of 6 to 5, 300 px to 250 px.

2. Create a <new_game_name>_rules.js file under /src/data/game_rules/ containing the rules and a pitch of your game. The rules show up in the "How To Play" dialog when playing a specific game while the pitch shows up behind the game card in the home page and gives a brief description of what the game is about.

3. Add the game's title, url, image path, pitch path, rules path, settings, and if it is production ready to /src/data/games.js in the proper place. Games are arranged in two sections, production ready and in development, both in alphabetical order.

4. Create a new <new_game_name>.js file in /src/pages/ and build the functionality of the game, using pieces in the /src/components/ directory as needed. The url in this game's data must name of this file and it is standard to make this the name of the game.

5. If you want specific styles for your game (recommended), create a <new_game_name>.module.css file in /src/styles/ and import it into whichever file you need.

6. Create a <new_game_name>.md file in /readme_files/ and add a description to your game based off the template. 

From development to production ready:

7. Add the game to the Game Files table, move the game data in games.js to be in the proper order, and mark prodReady as true. Don't forget to test it first!

