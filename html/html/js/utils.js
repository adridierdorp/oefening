function isEnterKey(event) {
	return event.keyCode == 13;
}

function showDiv(divId, show) {
	var display = $("#" + divId).attr("class");
	if (!show) {
		if (display.indexOf("invisible") < 0) {
			display = display + " invisible";
			display = display.replace("  ", " ");
		}
	} else {
		if (display.indexOf("invisible") >= 0) {
			display = display.replace("invisible", "");
		}
	}
	$("#" + divId).attr("class", display);
}

function showInput(inputId, show) {
	if (show) {
		$("#" + inputId).show();
	} else {
		$("#" + inputId).hide();
	}
}

function showMessage(message) {
	$("#messageLabel").empty();
	$("#messageLabel").html(message);
}

function createQuestionLatex(divId) {
	var htmlElement = document.getElementById(divId);
	var config = {
		handlers : {
			edit : function() {
			}
		},
		restrictMismatchedBrackets : true
	};
	var mathField = mathQuillEditor.MQ.MathField(htmlElement, config);
	return mathField;
}

/**
 * alignDivs("abc", right);
 * @param elementId
 * @param position
 * @returns
 */
function alignDivs(divIdA, divIdB,  position) {
	$("#" + divIdA).position({
		of : $("#" + divIdB),
		my : position,
		at : position
	});
}