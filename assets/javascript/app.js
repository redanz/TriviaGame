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
		timeLeft: 30
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
	inter = setInterval(showTimerValue, 1000);
}

function pauseTimer(){
	answers[questionNum-1]['timeLeft'] = timer;
	clearInterval(inter);
}

$('#loadButton').on('click', function(){
	document.querySelectorAll('.key')[0].style.visibility = 'visible';
	document.querySelectorAll('.key')[1].style.visibility = 'visible';
	document.querySelectorAll('.key')[2].style.visibility = 'visible';
	document.querySelector('#score').style.visibility = 'visible';
	document.querySelector('#timer-header').style.visibility = 'visible';

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