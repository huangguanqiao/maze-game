/*
Treasure Hunt Game - Team Avengers
Team Avengers member: Guanqiao Huang / Hyndhavi Nune / Manasa Korkanti / Narender Kaur / Jacob Tabit

A list of the functions for the game:
JS Task 1: The HTML can randomly generate a maze map (reachable)
JS Task 2: Players to move the icon, using arrow keys on the keyboard
JS Task 3: Several difficulty levels of maze for the game
JS Task 4: Number of steps the player has used could be shown on the page
JS Task 5: Do the functional testing of the created game, e.g. the maze map is reachable.
*/

//return getElementById
const getElement = id => {
	//console.log(`getElement:${id}`);
	return document.getElementById(id);
}

//Global varable
let canvas = getElement('canvas');
let width = canvas.width;

//create empty object and array to store the record
let maze_cells = {};

//start cell which is 0 0
let start_cell = { 'x': 0, 'y': 0 };
let player_y;
let player_x;
let maze;

//record the round you play
let round = 0;

//After click the start button trigger the start game event
getElement('start').addEventListener('click', function () {
	let level = getElement('level').value;
	//console.log(level);
	let col, row;
	let obj = getElement('canvas');


	switch (level) {
		case 'easy':
			col = 10;
			row = 10;
			break;
		case 'medium':
			col = 15;
			row = 15;
			break;
		case 'hard':
			col = 20;
			row = 20;
			break;
		case 'extreme':
			col = 30;
			row = 30;
			break;
		default:
			col = 10;
			row = 10;
	}


	maze = new Maze(obj, col, row);
	//console.log(`Created game: ${level} col=${col} row=${row}`);
	maze.clearOffset();
});

//After click the tips button trigger the get tips event
getElement('guides').addEventListener('click', function () {
	alert("Hello! Welcome to the Treasure Hunt Game! \n"
		+ "Guide 1: Using the arrow keys on the keyboard to control the man(Red Square) to find a way to get the treasure(Yellow Square)!\n"
		+ "Guide 2: You can choose difficulty level for the game, click start a new game button. \n"
		+ "Guide 3: Once you wins (gets the treasure), the page will show how many steps you have used. ");
	//+ "Contribution: \n"
	//+ "Team 3: Guanqiao Huang / Hyndhavi Nune / Manasa Korkanti / Narender Kaur / Jacob Tabit");
});



// class able to create maze multiple time
class Maze {
	constructor(obj, col, row) {
		this.col = col; //how many col in the maze
		this.row = row; //how many row in the maze
		this.canvas = obj.getContext('2d'); //2D drawing functions
		this.steps; //steps counter
		this.accessPath = []; //access path
		this.drawMaze(); //draw maze function, initial maze
	}

	//dawing maze, trigger all the sub-function for drawing
	drawMaze() {
		//console.log('call drawMaze');
		this.cell = (width - 2) / this.col; //2 is the line width

		//Initize maze_cells[row][col], each cells have records
		//top, bottom, left, right are the border records, false means have border
		for (let i = 0; i < this.row; i++) {
			maze_cells[i] = [];
			for (let j = 0; j < this.col; j++) {
				maze_cells[i].push({
					'x': j,
					'y': i,
					'top': false,
					'bottom': false,
					'left': false,
					'right': false,
					'isVisited': false
				})
				//console.log(`[${i}][${j}]: ${maze_cells[i][j]}`);
			}
		}

		//at the begining, set player to start point
		player_x = start_cell.x;
		player_y = start_cell.y;

		//steps from 0
		this.steps = 0;
		this.accessPath.push(start_cell);

		maze_cells[0][0].isVisited = true;

		//set the border of the start point and won point
		maze_cells[0][0].top = true;
		maze_cells[this.row - 1][this.col - 1].bottom = false;

		this.calculate(0, 0, maze_cells);
		this.drawCells();
		maze_cells[0][0].top = false;
		maze_cells[this.row - 1][this.col - 1].bottom = false;

		this.drawPlayer(player_y, player_x);
	}

	//calculate and update the information for each cells before draw the cells
	calculate(x, y, arr) {
		let neighbors = [];

		//check how many unvisited neighbors around current cell [x][y]
		//there are four possible cell, which are [x-1][y],[x+1][y],[x][y-1],[x][y+1]
		if (x - 1 >= 0 && !maze_cells[x - 1][y].isVisited) {
			neighbors.push({ 'x': x - 1, 'y': y });
		}

		if (x + 1 < this.row && !maze_cells[x + 1][y].isVisited) {
			neighbors.push({ 'x': x + 1, 'y': y });
		}

		if (y - 1 >= 0 && !maze_cells[x][y - 1].isVisited) {
			neighbors.push({ 'x': x, 'y': y - 1 });
		}

		if (y + 1 < this.col && !maze_cells[x][y + 1].isVisited) {
			neighbors.push({ 'x': x, 'y': y + 1 });
		}

		if (neighbors.length > 0) { //Adjacent rooms have unvisited rooms
			//current cell
			let current = { 'x': x, 'y': y };

			//random pickup a unvisted neighhors cell
			let next = neighbors[Math.floor(Math.random() * neighbors.length)];

			maze_cells[next.x][next.y].isVisited = true;

			//save the visited cells in an array
			this.accessPath.push({ 'x': next.x, 'y': next.y });


			this.createAccess(current, next);
			this.calculate(next.x, next.y, arr);
		} else {
			//in here which means there is no neighbors around current cell
			let next = this.accessPath.pop();
			if (next != null) {
				this.calculate(next.x, next.y, arr);
			}
		}

	}

	//create access between current cell and next cell
	createAccess(cur, next) {
		if (cur.x < next.x) {
			maze_cells[cur.x][cur.y].bottom = true; //current cell no bottom border
			maze_cells[next.x][next.y].top = true; //next cell no top border
		}

		if (cur.x > next.x) {
			maze_cells[cur.x][cur.y].top = true;
			maze_cells[next.x][next.y].bottom = true;
		}

		if (cur.y < next.y) {
			maze_cells[cur.x][cur.y].right = true;
			maze_cells[next.x][next.y].left = true;
		}

		if (cur.y > next.y) {
			maze_cells[cur.x][cur.y].left = true;
			maze_cells[next.x][next.y].right = true;
		}
	}

	//draw the cells
	drawCells() {
		let ctx = this.canvas;   //get canvas Object
		let cellLength = this.cell; //get each cell's length

		//set a transparent board，clear a rectangular area
		ctx.clearRect(0, 0, getElement('canvas').width, getElement('canvas').height);

		//create new path
		ctx.beginPath();
		ctx.save();
		ctx.translate(1, 1);

		//setting up the line style for maze
		ctx.strokeStyle = '#000fff';
		ctx.lineWidth = 2;

		//draw the line for each cell
		for (let i in maze_cells) { //i is row
			//total number of cells in single row
			let num = maze_cells[i].length;
			//console.log(`num: ${num}`);

			for (let j = 0; j < num; j++) {
				//each cell record
				let cell = maze_cells[i][j];

				i = parseInt(i);

				//draw the line one by one based on top, bottom, left and right boolean from each cell record
				if (!cell.top) {
					ctx.moveTo(j * cellLength, i * cellLength);
					ctx.lineTo((j + 1) * cellLength, i * cellLength);
				}

				if (!cell.bottom) {
					ctx.moveTo(j * cellLength, (i + 1) * cellLength);
					ctx.lineTo((j + 1) * cellLength, (i + 1) * cellLength);
				}

				if (!cell.left) {
					ctx.moveTo(j * cellLength, i * cellLength);
					ctx.lineTo(j * cellLength, (i + 1) * cellLength);
				}

				if (!cell.right) {
					ctx.moveTo((j + 1) * cellLength, i * cellLength);
					ctx.lineTo((j + 1) * cellLength, (i + 1) * cellLength);
				}
			}
		}

		//render the path
		ctx.stroke();
		ctx.restore();

		this.drawTreasure();
		this.drawOffset();

	}


	//draw the player
	drawPlayer(col, row) {
		let ctx = this.canvas;
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(getElement('offset'), 0, 0);
		ctx.translate(2, 2);


		ctx.fillStyle = '#ff0000';
		ctx.fillRect(col * this.cell, row * this.cell, this.cell - 2, this.cell - 2);

		ctx.restore();

		//Each move will add one step
		this.steps++;
		console.log(`Player now in steps ${this.steps},[${row}] [${col}] `);
	}

	//draw the treasure
	drawTreasure() {
		let ctx = this.canvas;

		//Drwa finished point
		ctx.fillStyle = '#ffff00';
		ctx.fillRect((this.col - 1) * this.cell, (this.row - 1) * this.cell, this.cell - 2, this.cell - 2);

		//Still implement for this feature
		/*
		let img = new Image()
		img.src = './img/finishSprite.png';
		img.onload = function () {
			let pattern = ctx.createPattern(img, 'no-repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect((this.col - 1) * this.cell, (this.row - 1) * this.cell, this.cell, this.cell);
		};
		*/

		/*
		setTimeout(() => {
			let pattern = ctx.createPattern(img, 'no-repeat');
			ctx.fillStyle = pattern;
			ctx.fillRect((this.col - 1) * this.cell, (this.row - 1) * this.cell, this.cell, this.cell);
		}, 2000);
		*/
	}


	//draw offset
	drawOffset() {
		//console.log('call drawOffset');
		let offsetCanvas = document.createElement('canvas');

		if (round == 0) {
			offsetCanvas.id = 'offset';
		} else {
			offsetCanvas.id = `offset - ${round}`;
		}
		round++;

		document.body.appendChild(offsetCanvas);
		offsetCanvas.width = getElement('canvas').width;
		offsetCanvas.height = getElement('canvas').height;

		let offset = getElement('offset').getContext('2d');
		offset.clearRect(0, 0, getElement('canvas').width, getElement('canvas').height);
		offset.drawImage(getElement('canvas'), 0, 0, offsetCanvas.width, offsetCanvas.height);
		getElement('offset').style.display = 'none';
	}

	//delete the useless offset
	clearOffset() {
		//console.log('call clearOffset');
		for (let i = 1; i <= round; i++) {
			if (getElement(`offset - ${i}`)) {
				getElement(`offset - ${i}`).remove();
			}
		}

	}

	//show alert saying the player win
	showWin() {
		if (player_y == (maze.col - 1) && player_x == (maze.row - 1)) {
			alert(`Congratulations ! you got the treasure in ${this.steps} steps!`);
			//location.reload();
			maze.clearOffset();
			if (confirm("Do u want to start a new game?")) {
				document.getElementById("start").click();
			}
		}
	}

}

//Created a default level of the Maze
maze = new Maze(getElement('canvas'), 10, 10);


//Monitor keyboard
window.addEventListener('keydown', function (event) {
	switch (event.keyCode) {
		case 37:
			//left arrow
			event.preventDefault();
			if (maze_cells[player_x][player_y].left) {
				player_y--;
			}
			break;
		case 38:
			//up arrow
			event.preventDefault();
			if (maze_cells[player_x][player_y].top) {
				player_x--;
			}
			break;
		case 39:
			//right arrow
			event.preventDefault();
			if (maze_cells[player_x][player_y].right) {
				player_y++
			}
			break;
		case 40:
			//down arrow
			event.preventDefault();
			if (maze_cells[player_x][player_y].bottom) {
				player_x++;
			}
			break;
	}

	//key updated, keep calling draw the player
	maze.drawPlayer(player_y, player_x);
	maze.showWin();
});