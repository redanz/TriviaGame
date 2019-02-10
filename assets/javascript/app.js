var triviaDataClean = []; // data cleaned and stored locally
var questionNum = 0;
var allAnswers = []; // includes arrays with all answer options
var correctAnswers = []; // includes correct answers for each question number
var score = 0;
var pageData = []; // records if question was answered, time left per question, and if answer was correct 
var inter;
var level;
var queryURL = "https://opentdb.com/api.php";


$('#startButton').on('click', function(){
	event.preventDefault();
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
});

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
	var answers = jumbleArray(allAnswers[questionNum]);
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
});

function checkAnswer(answer) {
	if (!pageData[questionNum].answered){
		pauseTimer();
		if (answer == correctAnswers[questionNum]){
			score++;
			pageData[questionNum].correct = true;
			
		} else {
			pageData[questionNum].correct = false;
		}
		pageData[questionNum].answered = true;
	}
	displayResult();
}

function displayResult(){
	if (!pageData[questionNum].answered){
		$('#result').text('');
		$('#answer').text('');
	} else if (pageData[questionNum].correct){
		$('#result').text('Correct! You answered: ' + correctAnswers[questionNum]);
	} else {
		$('#result').text('Sorry, the correct answer was: ' + correctAnswers[questionNum]);
	}
	$('#score').text('Score: ' + score);
}

function showTimerValue(){
	if (pageData[questionNum].timeLeft > 0 && !pageData[questionNum].answered){
		pageData[questionNum].timeLeft--;
	}
	if (pageData[questionNum].timeLeft > 0){
		$('#timer').text(pageData[questionNum].timeLeft);
	} else {
		pageData[questionNum].answered = true;
		$('#timer').text('Time is up!');
		$('#result').text('The correct answer was: ' + correctAnswers[questionNum]);
	}
}

function startTimer(){
	showTimerValue();
	clearInterval(inter);
	inter = setInterval(showTimerValue, 1000);
}

function pauseTimer(){
	clearInterval(inter);
}

function cleanData(str){
	return str.replace(/&amp;/g,"&")
			   .replace(/&gt;/g, ">")
			   .replace(/&lt;/g, "<")
			   .replace(/&quot;/g, "\"")
			   .replace(/&#039;/g, "\'")
			   .replace(/&pi;/g, "π")
			   .replace(/&eacute;/g, "é");
}

function setPageData(){ 
	for (var i=0; i<triviaDataClean.length; i++){
		pageData.push({
		answered: false,
		timeLeft: level+1
		});
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
	// storeAnswers(triviaDataClean);
	storeAnswers(triviaDataClean);
}

function storeAnswers(data){
	var tempArr = [];
	for (var i=0; i<data.length; i++){
		
		correctAnswers.push(data[i].correct_answer);
		tempArr = [];
		tempArr.push(data[i].correct_answer);

		for (var j=0; j<data[i].incorrect_answers.length; j++){
			tempArr.push(data[i].incorrect_answers[j]);
		}
		allAnswers.push(tempArr);
	}
	return allAnswers;
}

//takes an array and returns an array with same elements in different order
function jumbleArray(arr){
	var randomIndex;
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
	for (var i=0; i<pageData.length; i++){
		timeSpent += level - pageData[i].timeLeft;
		if (pageData[i].answered == true){
			answered ++;
			if (pageData[i].correct == true){
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
	var scoreSummary = scoreSheet();
	$('#quizScreen').hide();
	$('#scoreScreen').show();
	$('#timeSpent').text(scoreSummary.totalTimeSpent + ' seconds');
	$('#answeredTotal').text(scoreSummary.totalAnswered);
	$('#skippedQuestions').text(triviaDataClean.length - scoreSummary.totalAnswered);
	$('#answeredCorrect').text(scoreSummary.totalCorrect);
	$('#percentCorrect').text((scoreSummary.totalCorrect / triviaDataClean.length * 100).toFixed(2) + '%');
}
