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
var timer;
var submit = false;
var end = false;


$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response){
		triviaData = response.results;
		storePageData();
		cleanAndStoreData(triviaData);
		$('#loadingScreen').hide();
		$('#startScreen').show();
		console.log(triviaData);
	});

$('#startButton').on('click', function(){
	$('#startScreen').hide();
	$('#quizScreen').show();
	displayQuestion();
})

$('#nextButton').on('click', function(){
	//.disable() or something to disable/gray out
	if(questionNum < 9){
		questionNum++;
		displayQuestion();
	}
});

$('#previousButton').on('click', function(){
	if(questionNum > 0){
		questionNum--;
		displayQuestion();
	}	
});

function displayQuestion(){
	var question = triviaDataClean[questionNum];
	console.log(questionNum, triviaDataClean[questionNum]);
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


function cleanData(str1){
	return str1.replace(/&amp;/g,"&")
			   .replace(/&gt;/g, ">")
			   .replace(/&lt;/g, "<")
			   .replace(/&quot;/g, "\"")
			   .replace(/&#039;/g, "\'")
			   .replace(/&pi;/g, "π")
			   .replace(/&eacute;/g, "é");

}


function storePageData(){
	for (var i=0; i<11; i++){
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



function displayValuesForPage(pageNum){


	start=false;
	
	if (questionNum == 10){
		console.log('yes')
		$('#loadButton').text('Submit!');
		if (end == true){
			console.log('yes2')
			submitQuiz();
			return;
		};
		end = true;
		displayAnswerOptions(pageNum);
	} else if (end == true){
		console.log('yes2')
		submitQuiz();
		return;
	}

	
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


$('#answersButtons').on('click', function(event){
	if (event.target.tagName == 'BUTTON'){
		checkAnswer(event.target.textContent);
	}
})

function checkAnswer(answer) {
	// if (answers[questionNum-1].answered != true){
		if (answer == allAnswers[questionNum].correct){
			score++;
			answers[questionNum].correct = true;
			$('#result').text('Correct! You answered:');
			$('#answer').text(allAnswers[questionNum].correct);
			
		} else {
			$('#result').text('Sorry, the correct answer was: ');
			$('#answer').text(allAnswers[questionNum].correct);
			answers[questionNum].correct = false;
		}
		// pauseTimer();
		answers[questionNum].answered = true;
		$('#score').text('Score: ' + score);
	// }
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



function submitQuiz(){
	$('.container').hide();
	$('#answersDiv').hide();
	document.querySelector('.table').style.visibility = 'visible';
}




// $('#loadButton').on('click', function(){

// 	if (loadData == true){
// 		questionNum++;
// 		cleanAndStoreData(triviaData);
// 		displayValuesForPage(questionNum);
// 		loadData = false;

// 	} else if (questionNum >= 10){
// 		pauseTimer();
// 		// questionNum++;
// 		displayValuesForPage(questionNum);
// 		console.log('here', questionNum)
// 		return;

// 	} else {
// 		pauseTimer();
// 		questionNum++;
// 		displayValuesForPage(questionNum);
// 	}
// 	startTimer();
// })


// $('#previousButton').on('click', function(){
// 	$('timer').text(30);
// 	pauseTimer();
// 	questionNum--;
// 	end = false;
// 	displayValuesForPage(questionNum);
// 	startTimer();
// })
