var triviaDataClean = [];
var questionNum = 0;
var allAnswers = [];
var answersArrays = [];
var score = 0;
var answers = [];
var inter;
var level;
var queryURL = "https://opentdb.com/api.php"


$('#startButton').on('click', function(){
	event.preventDefault()
	$(this).attr('disabled', 'disabled');
	$(this).text('Loading...');
	$('#loadingButton').show();

	var amount = $('#amountPref option:selected').val();
	var difficulty = $('#difficultyPref option:selected').val();
	var type = $('#typePref option:selected').val();
	level = $('#levelPref').val();

	if (amount != 'Choose...'){
		queryURL +=  "?amount="+amount;
	} else {
		queryURL +=  "?amount="+10;
	}
	if (difficulty != 'Choose...' && difficulty != ''){
		queryURL += "&difficulty="+difficulty;
	}
	if (type != 'Choose...' && type != ''){
		queryURL += "&type="+ type;
	}
	if (level != 'Choose...'){
		level = parseInt(level);
	} else {
		level = 30;
	}

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response){
		cleanAndStoreData(response.results);
		setPageData();
		$('#preferencesScreen').hide();
		$('#quizScreen').show();
		$('#previousButton').hide();
		displayQuestion();
		startTimer();
	});
})


function progressButtons(){
	if (questionNum == 0){
		$('#previousButton').hide();
	} else if (questionNum == triviaDataClean.length-1){
		$('#nextButton').text('Submit');
	} else {
		$('#previousButton').show();
		$('#nextButton').text('Next Question');
	}
}

$('#nextButton').on('click', function(){
	if ($('#nextButton').text() == 'Submit') {
		submitQuiz();
	}
	if (questionNum < triviaDataClean.length-1){
		questionNum++;
		displayQuestion();
		startTimer();
	}
	progressButtons();
});

$('#previousButton').on('click', function(){
	if (questionNum > 0){
		questionNum--;
		displayQuestion();
		startTimer();
	}
	progressButtons();
});

function displayQuestion(){
	var question = triviaDataClean[questionNum];
	$('#category').text(question.category);
	$('#result').text('');
	$('#answer').text('');
	$('#timer').text('');

	if (question.type == 'multiple'){
		$('#type').text('Pick an Answer');
	} else {
		$('#type').text('True or False');
	}

	$('#question').text(question.question);
	$('#questionNumber').text(' ' + (questionNum+1));
	displayAnswerOptions();
	displayResult();
}

function displayAnswerOptions(){
	var answers = jumbleArray(answersArrays[questionNum]);
	if (triviaDataClean[questionNum].type == 'multiple'){
		$('#trueOrFalseButtons').hide();
		$('#multipleChoiceButtons').show();
		$('#answerOption1').text(answers[0]);
		$('#answerOption2').text(answers[1]);
		$('#answerOption3').text(answers[2]);
		$('#answerOption4').text(answers[3]);
	} else {
		$('#trueOrFalseButtons').show();
		$('#multipleChoiceButtons').hide();
	}
}

$('#answersButtons').on('click', function(event){
	if (event.target.tagName == 'BUTTON'){
		checkAnswer(event.target.textContent);
	}
})

function checkAnswer(answer) {
	if (!answers[questionNum].answered){
		pauseTimer();
		if (answer == allAnswers[questionNum].correct){
			score++;
			answers[questionNum].correct = true;
			
		} else {
			answers[questionNum].correct = false;
		}
		answers[questionNum].answered = true;
	}
	displayResult();
}

function displayResult(){
	if (!answers[questionNum].answered){
		$('#result').text('');
		$('#answer').text('');
	} else if (answers[questionNum].correct){
		$('#result').text('Correct! You answered: ' + allAnswers[questionNum].correct);
	} else {
		$('#result').text('The correct answer was: ' + allAnswers[questionNum].correct);
	}
	$('#score').text('Score: ' + score);
}


function showTimerValue(){
	if (answers[questionNum].timeLeft > 0 && !answers[questionNum].answered){
		answers[questionNum].timeLeft--;
	}

	if (answers[questionNum].timeLeft > 0){
		$('#timer').text(answers[questionNum].timeLeft);
	} else {
		answers[questionNum].answered = true;
		$('#timer').text('Time is up!')
		$('#result').text('The correct answer was: ' + allAnswers[questionNum].correct);
	}
}

function startTimer(){
	showTimerValue()
	clearInterval(inter);
	inter = setInterval(showTimerValue, 1000);
}

function pauseTimer(){
	clearInterval(inter);
}

function cleanData(str1){
	return str1.replace(/&amp;/g,"&")
			   .replace(/&gt;/g, ">")
			   .replace(/&lt;/g, "<")
			   .replace(/&quot;/g, "\"")
			   .replace(/&#039;/g, "\'")
			   .replace(/&pi;/g, "π")
			   .replace(/&eacute;/g, "é");
}

function setPageData(){
	for (var i=0; i<triviaDataClean.length; i++){
		answers[i] = {
		answered: false,
		timeLeft: level+1
		};
	}
}

function cleanAndStoreData(obj){

	var keys = Object.keys(obj[0]);

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
	//to preseve length of original array for the loop below 
	var len = cloneArray.length;
	var newArray = [];
	for (var i=0; i<len; i++){
		randomIndex = Math.floor(Math.random()*cloneArray.length);
		newArray.push(cloneArray[randomIndex]);
		cloneArray.splice(randomIndex, 1);
	}
	return newArray;
}

function scoreSheet(){
	var timeSpent = 0;
	var answered = 0;
	var correct = 0;
	var scoreSummary = {
		totalTimeSpent: 0,
		totalAnswered: 0,
		totalCorrect: 0
	};
	for (var i=0; i<answers.length-1; i++){
		timeSpent += level - answers[i].timeLeft;
		if (answers[i].answered == true){
			answered ++;
			if (answers[i].correct == true){
				correct++;
			}
		}
	}

	scoreSummary.totalTimeSpent = timeSpent;
	scoreSummary.totalAnswered = answered;
	scoreSummary.totalCorrect = correct;
	return scoreSummary;
}

function submitQuiz(){
	$('#quizScreen').hide();
	$('#scoreScreen').show();
	scoreSummary = scoreSheet();
	$('#timeSpent').text(scoreSummary.totalTimeSpent + ' seconds');
	$('#answeredTotal').text(scoreSummary.totalAnswered);
	$('#skippedQuestions').text(triviaDataClean.length - scoreSummary.totalAnswered);
	$('#answeredCorrect').text(scoreSummary.totalCorrect);
	$('#percentCorrect').text((scoreSummary.totalCorrect / triviaDataClean.length * 100).toFixed(2) + '%');
}
