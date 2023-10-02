

export default function WordSearchRules({ isPitch }) {

    if (isPitch) {
        return (
            <div>
                Up, down, diagonal, backwards--can you find all 
                of your ancestor's names hiding in this haystack of 
                letters?
            </div>
        )
    }


    return (
        <div>
            Search for your the names of your ancestors on
            the board. Click and drag from the start to the
            end of the name to highlight the solution!
        </div>
    )

}
