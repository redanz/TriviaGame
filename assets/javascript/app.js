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
var difficulty; //  <url>&difficulty=easy, medium, hard
var keys;
var triviaDataClean = [];
var start = true;
var loadData = true;
var questionNum = 0;
var pageIndex = questionNum-1;
var forward = true;
var allAnswers = [];
var correctAnswers = [];
var answersArrays = [];
var score = 0;
var answers = [];
var inter;


$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response){
		triviaData = response.results;
		loadPageData();
		document.querySelector('#loadButton').style.visibility = 'visible';
	});

function cleanData(str1){
	return str1.replace(/&amp;/g,"&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, "\"").replace(/&#039;/g, "\'").replace(/&pi;/g, "pi");
}

function loadPageData(){
	for (var i=0; i<10; i++){
		answers[i] = {
		answered: false,
		timeLeft: 10
		};
	}
}

function cleanAndStoreData(obj){

	keys = Object.keys(obj[0]);

	// loops through original object and pushes clean version of objects to triviaDataClean
	for (var i=0; i<obj.length; i++){
		// var has to be declared inside the loop: https://stackoverflow.com/questions/19054997/push-is-overwriting-previous-data-in-array
		var newCleanObj = {};
		// loops through keys of original object array and cleans strings
		for (var j=0; j<keys.length; j++){
			// checks if key has multiple values (in an array)
			if (typeof(obj[i][keys[j]]) != 'string'){
				var array = [];
				// loops through values in the array to clean string and push to an array
				for (var k=0; k<obj[i][keys[j]].length; k++){
					array.push(cleanData(obj[i][keys[j]][k]));
					
				}
				newCleanObj[keys[j]] = array;
			} else {
				newCleanObj[keys[j]] = cleanData(obj[i][keys[j]]);
			}
		}
		triviaDataClean.push(newCleanObj);
	}
	storeAnswers(triviaDataClean);
	return triviaDataClean;
}

function storeAnswers(data){
	var ithAnswerArray = [];

	for (var i=0; i<data.length; i++){
		ithAnswerArray = [];
		var answersObj = {};
		var arrIncorrect = [];
		answersObj['correct'] = data[i].correct_answer;

		ithAnswerArray.push(data[i].correct_answer);

		for (var j=0; j<data[i].incorrect_answers.length; j++){
			arrIncorrect.push(data[i].incorrect_answers[j]);
		}

		ithAnswerArray.push.apply(ithAnswerArray, arrIncorrect);
		answersObj['incorrect'] = arrIncorrect;
		allAnswers.push(answersObj);

		answersArrays.push(ithAnswerArray);
	}
	return allAnswers;
}

//takes an array and returns an array with same elements in different order
function jumbleArray(arr){
	//to preserve original array
	var cloneArray = JSON.parse(JSON.stringify(arr));
	len = cloneArray.length;
	var newArray = [];
	for (var i=0; i<len; i++){
		randomIndex = Math.floor(Math.random()*cloneArray.length);
		newArray.push(cloneArray[randomIndex]);
		cloneArray.splice(randomIndex, 1);
	}
	return newArray;
}

function displayAnswerOptions(pageNum){
	index = pageNum-1;
	$('#result').text('');
	var answers = jumbleArray(answersArrays[index]);
		if (triviaDataClean[index].type == 'multiple'){
			document.querySelectorAll('.boolean')[0].style.visibility = 'visible';
			document.querySelectorAll('.boolean')[1].style.visibility = 'visible';
			document.querySelectorAll('.multiple')[0].style.visibility = 'visible';
			document.querySelectorAll('.multiple')[1].style.visibility = 'visible';
			$('#answerOption1').text(answers[0]);
			$('#answerOption2').text(answers[1]);
			$('#answerOption3').text(answers[2]);
			$('#answerOption4').text(answers[3]);
		} else {
			document.querySelectorAll('.boolean')[0].style.visibility = 'visible';
			document.querySelectorAll('.boolean')[1].style.visibility = 'visible';
			document.querySelectorAll('.multiple')[0].style.visibility = 'hidden';
			document.querySelectorAll('.multiple')[1].style.visibility = 'hidden';
			$('#answerOption1').text('True');
			$('#answerOption2').text('False');
			$('#answerOption3').text('');
			$('#answerOption4').text('');
		}

}

function displayValuesForPage(pageNum){
	index = pageNum-1;
	$('#category').text(triviaDataClean[(index)].category);
	$('#result').text('');
	$('#answer').text('');
	$('timer').text('');

	if (triviaDataClean[(index)].type == 'multiple'){
		$('#type').text('Pick an Answer');
	} else {
		$('#type').text('True or False');
	}
	$('#question').text(triviaDataClean[(index)].question);
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
	displayAnswerOptions(pageNum);
	if (answers[questionNum-1].answered == true){
		if(answers[questionNum-1].correct == true){
			$('#result').text('Correct! You answered:');
			$('#answer').text(allAnswers[questionNum-1].correct)
		} else if(answers[questionNum-1].correct != true) {
			$('#result').text('Sorry, the correct answer was: ');
			$('#answer').text(allAnswers[questionNum-1].correct);
		}
		
	}
}

function checkAnswer() {
	if (answers[questionNum-1].answered != true){
		if (event.target.innerText == allAnswers[questionNum-1].correct){
			score++;
			answers[questionNum-1].correct = true;
			$('#result').text('Correct! You answered:');
			$('#answer').text(allAnswers[questionNum-1].correct);
			
		} else {
			$('#result').text('Sorry, the correct answer was: ');
			$('#answer').text(allAnswers[questionNum-1].correct);
			answers[questionNum-1].correct = false;
		}
		pauseTimer();
		answers[questionNum-1].answered = true;
		$('#score').text('Score: ' + score + '/' + answers.length);
	}
}



function showTimerValue(){
	if (timer > 0 && answers[questionNum-1].answered != true){
		$('#timer').text(timer);
		timer--;
	} else {
		answers[questionNum-1].answered = true;
		$('#timer').text('Time is up!')
		$('#result').text('The correct answer was: ');
		$('#answer').text(allAnswers[questionNum-1].correct);
	}
		
}

function startTimer(){
	timer=answers[questionNum-1].timeLeft;
	$('timer').text(timer);
	clearInterval(inter);
	inter = setInterval(showTimerValue, 1000)
}

function pauseTimer(){
	answers[questionNum-1]['timeLeft'] = timer;
	clearInterval(inter);
}

$('#loadButton').on('click', function(){
	document.querySelectorAll('.key')[0].style.visibility = 'visible';
	document.querySelectorAll('.key')[1].style.visibility = 'visible';
	document.querySelectorAll('.key')[2].style.visibility = 'visible';

	

	if (loadData == true){
		questionNum++;
		cleanAndStoreData(triviaData);
		displayValuesForPage(questionNum);
		loadData = false;

	} else if (questionNum == 10){

		return;

	} else {
			questionNum++;
			displayValuesForPage(questionNum);
	}
	startTimer();
})


$('#previousButton').on('click', function(){
	questionNum--;
	displayValuesForPage(questionNum);
})


$('#answersDiv').on('click', function(){
	checkAnswer();
})