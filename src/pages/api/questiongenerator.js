import Tree from '../../data/fsdatastructures';

var fsData = null;
let rare = true;
var limit;

export default function handler (req, res)
{
    if (req.method === 'POST')
    {
        fsData = new Tree();
        const map = new Map(Object.entries(req.body.userFSData));
        fsData.setPersons(map);
        var ascendancyNums = req.body.ascendancyNums;
        var promptArray = new Array;

        //console.log('req: ', req.body)
        //console.log("size before becoming a map " + Object.entries(req.body.userFSData).length);
        //console.log("map length " + map.size)
        //console.log(ascendancyNums);
        //console.log("tree " + Array.from(fsData.personMap.values()));
        //console.log(fsData.personMap);
        console.log("ascendency nums", ascendancyNums);

        ascendancyNums.forEach(num => {
            let person = fsData.personMap.get(num.toString());
            let result = generatePrompt(person);
            promptArray.push(result);
        });

        //console.log(promptArray.length)
        console.log(promptArray);

        res.status(201).json(promptArray);
    }
    else {
        res.status(405).json("request method must be POST");
    }
}

/*
Potential question categories:

relationships (sibling count) (paternal vs maternal family) (birth order)
occupations
places or times of events (hometown) (marriage place) (age at death)
(maybe) life events during famous time periods
*/

function generatePrompt(person) {
    return questions[Math.floor(Math.random() * questions.length)](person);
    // if (rare) {
    //     //prioritize less common questions
    //     rare = false;
    //     limit = rareQuestions.length;
    //     let result = rareQuestions[Math.floor(Math.random() * rareQuestions.length)](person);
    //     if (result != null) { return result; }
    //     else { return questions[Math.floor(Math.random() * questions.length)](person); }
    // }
    // else {
    //     rare = true;
    //     return questions[Math.floor(Math.random() * questions.length)](person);
    // }
}

const questions = [
    function(person) { return q0(person); },
    function(person) { return q1(person); },
    function(person) { return q2(person); },
    function(person) { return q3(person); },
    function(person) { return q4(person); },
    function(person) { return q5(person); },
    function(person) { return q6(person); },
    function(person) { return q7(person); },
    function(person) { return q8(person); },
]

const q0 = function(person) {
    if (fsData.getSpouse(person.a_num) != null) { return {
        clue: "The name of " + fsData.getSpouse(person.a_num).name.full + "'s spouse.",
        answer: person.name.compressedName,
    }} else { return q1(person); }
}

const q1 = function(person) {
    if (fsData.getChild(person.a_num)) { return {
        clue: fsData.getChild(person.a_num).name.full + " is this " + (person.gender == "Male" ? "man" : "woman") + "'s child.",
        answer: person.name.compressedName,
    }} else { 
        var rand = Math.floor(Math.random() * 2);
        if (rand == 0) {return q2(person);}
        else return q3(person);
    }
}

const q2 = function(person) {
    console.log("IN q2 ");
    if (fsData.getChild(person.a_num) && person.gender === "Male") 
    {   console.log("IN q2 if statement");
        return {
        clue: "This person is the father of " + fsData.getChild(person.a_num).name.full + ".",
        answer: person.name.compressedName,
    }} else { return q4(person); }
}

const q3 = function(person) {
    if (fsData.getChild(person.a_num) && person.gender === "Female") { 
        console.log("IN q3")
        return {
        clue: "This person is the mother of " + fsData.getChild(person.a_num).name.full + ".",
        answer: person.name.compressedName,
    }} else { return q4(person); }
}

const q4 = function(person) {
    if (fsData.getFather(person.a_num)) { 
        console.log("In q4 if")
        return {
        clue: "This person is the child of " + fsData.getFather(person.a_num).name.full + ".",
        answer: person.name.compressedName,
    }} else { return q5(person); }
}

const q5 = function(person) {
    if (fsData.getMother(person.a_num)) { 
        console.log("In q5 if")
        return {
        clue: "This person is the child of " + fsData.getMother(person.a_num).name.full + ".",
        answer: person.name.compressedName,
    }} else { return q6(person); }
}

const q6 = function(person) {
    if (person.deathPlace && person.lifespan.years && person.deathDate.year) { return {
        clue: "This person died in " + person.deathPlace + " at the age of " + person.lifespan.years + " in " 
            + person.deathDate.year + ".",
        answer: person.name.compressedName,
    }} else { return q7(person); }
}

const q7 = function(person) {
    if (person.birthPlace && person.birthDate.year && person.birthDate.month && person.birthDate.day) { return {
        clue: "This person was born in " + person.birthPlace + " in " 
            + person.birthDate.month + " " + person.birthDate.day + ", " + person.birthDate.year + ".",
        answer: person.name.compressedName,
    }} else { return q8(person); }
}

const q8 = function(person) {
    if (person.birthPlace && person.birthDate.year) { return {
        clue: "This person was born in " + person.birthPlace + " in " + person.birthDate.year + ".",
        answer: person.name.compressedName,
    }} else { return q0(person); }
}

//rare questions

// const rareQuestions = [
//     function(person) { return r0(person); },
// ]

// const r0 = function(person) {
//     if (person.deathPlace && person.lifespan.years) { return {
//         clue: "This person died in " + person.deathPlace + " at the age of " + person.lifespan.years + ".",
//         answer: person.name.compressedName,
//     }} else {
//         limit--; if (limit == 0) { return null; }
//         return r0(person);
//     }
// }


// Question groupings