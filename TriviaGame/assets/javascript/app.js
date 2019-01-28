// var test = 
	[
		{
			category: "Entertainment: Music",
			type: "boolean",
			difficulty: "medium",
			question: "The cover of The Beatles album &quot;Abbey Road&quot; featured a Volkswagen Beetle in the background.",
			correct_answer: "True",
			incorrect_answers: [
			"False"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "easy",
			question: "In Mean Girls, who has breasts that tell when it&#039;s raining?",
			correct_answer: "Karen Smith",
			incorrect_answers: [
			"Gretchen Weiners",
			"Janice Ian",
			"Cady Heron"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "medium",
			question: "Which of these songs by artist Eminem contain the lyric &quot;Nice to meet you. Hi, my name is... I forgot my name!&quot;?",
			correct_answer: "Rain Man",
			incorrect_answers: [
			"Without Me",
			"Kim",
			"Square Dance"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "medium",
			question: "What was the title of Sakamoto Kyu&#039;s song &quot;Ue o Muite Arukou&quot; (I Look Up As I Walk) changed to in the United States?",
			correct_answer: "Sukiyaki",
			incorrect_answers: [
			"Takoyaki",
			"Sushi",
			"Oden"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "easy",
			question: "Which one of these songs did the group &quot;Men At Work&quot; NOT make?",
			correct_answer: "Safety Dance",
			incorrect_answers: [
			"Down Under",
			"Who Can It Be Now?",
			"It&#039;s a Mistake"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "medium",
			question: "What is the name of the main character from the music video of &quot;Shelter&quot; by Porter Robinson and A-1 Studios?",
			correct_answer: "Rin",
			incorrect_answers: [
			"Rem",
			"Ren",
			"Ram"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "medium",
			question: "African-American performer Sammy Davis Jr. was known for losing which part of his body in a car accident?",
			correct_answer: "Left Eye",
			incorrect_answers: [
			"Right Ear",
			"Right Middle Finger",
			"Nose"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "medium",
			question: "Which member of &quot;The Beatles&quot; narrated episodes of &quot;Thomas the Tank Engine&quot;?",
			correct_answer: "Ringo Starr",
			incorrect_answers: [
			"George Harrison",
			"John Lennon",
			"Paul McCartney"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "medium",
			question: "Who is the vocalist and frontman of rock band &quot;Guns N&#039; Roses&quot;?",
			correct_answer: "Axl Rose",
			incorrect_answers: [
			"Kurt Cobain",
			"Slash",
			"Bono"
			]
		},
		{
			category: "Entertainment: Music",
			type: "multiple",
			difficulty: "hard",
			question: "What was the name of the cold-war singer who has a song in Grand Theft Auto IV, and a wall landmark in Moscow for his memorial?",
			correct_answer: "Viktor Tsoi",
			incorrect_answers: [
			"Jimi Hendrix",
			"Brian Jones",
			"Vladimir Vysotsky"
			]
		}
	];
var queryURL = "https://opentdb.com/api.php?amount=10";
var triviaData;
var difficulty; //&difficulty=easy, medium, hard
var keys;
var triviaDataClean = [];
var start = true;
var storeData = true;
var questionNum = 0;
var forward = true;

$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response){
		triviaData = response.results;
	});


function cleanData(str1){
	return str1.replace(/&amp;/g,"&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, "\"").replace(/&#039;/g, "\'");
}

function cleanObjectData(obj){

	keys = Object.keys(obj[0]);

	// loops through original object and pushes clean version of objects to triviaDataClean
	for (var i=0; i<obj.length; i++){
		// has to be inside the loop: https://stackoverflow.com/questions/19054997/push-is-overwriting-previous-data-in-array
		var newCleanObj = {};
		// loops through keys of original object array and cleans strings
		for (var j=0; j<keys.length; j++){
			// checks if key has multiple values (in an array)
			if (typeof(obj[i][keys[j]]) != 'string'){
				// loops through values in the array to clean string
				for (var k=0; k<obj[i][keys[j]].length; k++){
					newCleanObj[keys[j]] = cleanData(obj[i][keys[j]][k]);
					
				}
			} else {
				newCleanObj[keys[j]] = cleanData(obj[i][keys[j]]);

			}
		}
		triviaDataClean.push(newCleanObj);
	}
	return triviaDataClean;
}


function displayValuesForPage(pageNum){

	$('#category').text(triviaDataClean[(pageNum-1)].category);
	$('#question').text(triviaDataClean[(pageNum-1)].question);
	$('#questionNumber').text(' ' + (pageNum));
	$('#loadButton').text('Next Question');
	start=false;
	if (questionNum == 10){

		$('#loadButton').text('Submit!');

	} else if (questionNum > 1){

		document.querySelector('#previousButton').style.visibility = 'visible';
	
	} else {

		document.querySelector('#previousButton').style.visibility = 'hidden';
	}
}


$('#loadButton').on('click', function(){

	if (storeData == true){
		questionNum++;
		cleanObjectData(triviaData);
		displayValuesForPage(questionNum);
		storeData = false;

	} else if (questionNum == 10){

		return;

	} else {
			questionNum++;
			displayValuesForPage(questionNum);
	}

})


$('#previousButton').on('click', function(){

	questionNum--;
	displayValuesForPage(questionNum);
})





