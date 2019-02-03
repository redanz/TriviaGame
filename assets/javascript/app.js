// var test = 
	[
		{
			category: "Entertainment: Music",
			type: "boolean",
			difficulty: "medium",
			question: "The cover of The Beatles album &quot;Abbey Road&quot; featured a Volkswagen Beetle in the background\
			The cover of The Beatles album &quot;Abbey Roasdfawerawetawetawerwerwr23e2343d Volkswagen Beetle in the background.\
			es album &quot;Abbey Road&quot; featured a Volkswagen Beetle in the backgrou\
			es album &quot;Abbey Road&quot; featured a Volkswagen Beetle in the backgrou",
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
var triviaDataClean = [];
var questionNum = 0;
var allAnswers = [];
var answersArrays = [];
var score = 0;
var answers = [];
var inter;


$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response){
		setPageData();
		cleanAndStoreData(response.results);
		$('#loadingScreen').hide();
		$('#startScreen').show();
	});

// TEST
// setPageData();
// cleanAndStoreData(test);
// $('#loadingScreen').hide();
// $('#startScreen').show();

$('#startButton').on('click', function(){
	$('#startScreen').hide();
	$('#quizScreen').show();
	$('#previousButton').hide();
	displayQuestion();
	startTimer();
})


function progressButtons(){
	if (questionNum == 0){
		$('#previousButton').hide();
	} else if (questionNum == 9){
		$('#nextButton').text('Submit');
	} else {
		$('#previousButton').show();
		$('#nextButton').text('Next Question');
	}
}



$('#nextButton').on('click', function(){
	//.disable() or something to disable/gray out
	if ($('#nextButton').text() == 'Submit') {
		submitQuiz();
	}

	if (questionNum < 9){
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
	// console.log(questionNum, triviaDataClean[questionNum]);
	$('#category').text(question.category);
	$('#result').text('');
	$('#answer').text('');
	$('#timer').text('');

	if (questionNum == 0)

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
		// $('#answer').text(allAnswers[questionNum].correct);
	} else {
		$('#result').text('Sorry, the correct answer was: ' + allAnswers[questionNum].correct);
		// $('#answer').text(allAnswers[questionNum].correct);
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
	for (var i=0; i<11; i++){
		answers[i] = {
		answered: false,
		timeLeft: 31
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
	len = cloneArray.length;
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
		timeSpent += 30 - answers[i].timeLeft;
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
	console.log(scoreSummary);
	return scoreSummary;
}

function submitQuiz(){
	$('#quizScreen').hide();
	$('#scoreScreen').show();
	$('#timeSpent').text(scoreSheet().totalTimeSpent + ' seconds');
	$('#answeredTotal').text(scoreSheet().totalAnswered);
	$('#answeredCorrect').text(scoreSheet().totalCorrect);
}
