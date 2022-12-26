let finalPattern = [];
let userClickedPattern = [];
let clicked;
let zeroCellIndex;
let zeroRowIndex;
let clickedCellIndex;
let clickedRowIndex;
let moves = 0;
const submitButton = document.querySelector(".submit");
const table = document.querySelector("#gridTable");
let row = document.querySelector("#rowCount");
let col= document.querySelector("#colCount");
let mCount= document.querySelector("h4");

// Create the Grid
submitButton.addEventListener("click",(e) => {
	if(row.value && col.value) {
		e.preventDefault();
		const tbody = document.querySelector("tbody");
		if(tbody) tbody.remove();
		let rowCount = Number(row.value);
		let colCount = Number(col.value);
		finalPattern = Array.from({length: rowCount * colCount}, (item,index) => index);
		let pattern = [...finalPattern];
		for (var r = 0; r < rowCount; r++) {
			var insertRowInTable = document.querySelector("#gridTable").insertRow(r);
			for (var c = 0; c < colCount; c++) {
				var random = Math.floor(Math.random() * pattern.length);
				random = pattern[random];
				pattern.splice(pattern.indexOf(random), 1);
				userClickedPattern.push(random);
				if(random == 0) {
					insertRowInTable.insertCell(c).innerHTML = random;
					table.rows[r].cells[c].style.backgroundColor = "black";
					} else {
					insertRowInTable.insertCell(c).innerHTML = random;
				}
			}
		}
		table.dispatchEvent(new CustomEvent('gridCreated'));
	}
});

// Click Operation on the grid
table.addEventListener('gridCreated', () => {
	document.querySelectorAll("tr").forEach((element) => {
		element.addEventListener("click", (event) => {
			const zero = Array.from(table.querySelectorAll('td')).find(number => number.style.backgroundColor == "black");
			clicked = event.target.innerText;
			zeroCellIndex = zero.cellIndex;
			zeroRowIndex = zero.parentElement.rowIndex;
			clickedCellIndex = event.target.cellIndex;
			clickedRowIndex = event.currentTarget.rowIndex;
			if(clickedRowIndex + 1 == zeroRowIndex && clickedCellIndex == zeroCellIndex) {
				changeLetter();     // Move top
				} else if(clickedRowIndex - 1 == zeroRowIndex && clickedCellIndex == zeroCellIndex) {
				changeLetter();     // Move bottom
				} else if(clickedCellIndex + 1 == zeroCellIndex && clickedRowIndex == zeroRowIndex) {
				changeLetter();    //  Move left
				} else if(clickedCellIndex - 1 == zeroCellIndex && clickedRowIndex == zeroRowIndex) { 
				changeLetter();    //  Move right
			}
		});
	});
});

// Swap the value
function changeLetter() {
	table.rows[zeroRowIndex].cells[zeroCellIndex].classList.add("slide");
	table.rows[zeroRowIndex].cells[zeroCellIndex].innerText = clicked;
	table.rows[zeroRowIndex].cells[zeroCellIndex].style.backgroundColor = "";
	table.rows[clickedRowIndex].cells[clickedCellIndex].style.backgroundColor = "black";
	table.rows[clickedRowIndex].cells[clickedCellIndex].innerText = 0;
	moves++;
	mCount.innerText = `Moves: ${moves}`;
	const numberOrder = Array.from(table.querySelectorAll('td')).map(number => number.innerText);
	userClickedPattern = [...numberOrder];
	userClickedPattern.splice(userClickedPattern.length-1,1);
	const tempFinalPattern = finalPattern.slice(1);
	if(userClickedPattern.join('') == tempFinalPattern.join('')) {
		if(confirm("You Won....Press okay to restart")) {
			submitButton.click();
		}	
	}
}