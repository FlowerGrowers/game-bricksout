const rulesBtn = document.querySelector('#rules-btn');
const closeBtn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');
const canvas = document.querySelector('#canvas');
let score = 0;
let context = canvas.getContext('2d');
const brickRowCount = 9;
const brickColumnCount = 5;
const bricks = [];






const ball = {
	x:canvas.width/2,
	y:canvas.height/2,
	size:10,
	speed:4,
	dx:4,
	dy:-4,
}

const paddle = {
	x:canvas.width/2-40,
	y:canvas.height-20,
	w:80,
	h:10,
	speed:8,
	dx:0
} 

const brickInfo = {
	w:70,
	h:20,
	padding:10,
	offsetX:45,
	offsetY:60,
	visible:true
}

function drawBall(){
	context.beginPath();
	context.arc(ball.x,ball.y,ball.size,0,Math.PI*2,true);
	context.strokeStyle = '#0095DD';
	context.stroke();
	context.fillStyle = '#0095dd';
	context.fill();
	// canvas.height = canvas.height * window.devicePixelRatio;
	// canvas.width = canvas.width  * window.devicePixelRatio;
	// context.scale(window.devicePixelRatio, window.devicePixelRatio);
	context.closePath();
}

function drawPaddle(){
	context.beginPath();
	context.rect(paddle.x,paddle.y,paddle.w,paddle.h);
	context.fillStyle='#0095DD';
	context.fill();
	context.closePath();
}

function drawScore(){
	context.font='20px Arial';
	context.fillText(`得分:${score}`,canvas.width-100,30);
}





for(let i=0;i<brickRowCount;i++){
	bricks[i]=[];
	for(let j=0;j<brickColumnCount;j++){
		const x = i*(brickInfo.w+brickInfo.padding)+brickInfo.offsetX;
		const y = j*(brickInfo.h+brickInfo.padding)+brickInfo.offsetY;
		bricks[i][j] = {
			x,y,...brickInfo
		}
	}
}

function drawBricks(){
	bricks.forEach(col => {
		col.forEach(brick=>{
			context.beginPath();
			context.rect(brick.x,brick.y,brick.w,brick.h);
			context.fillStyle=brick.visible?'#0095DD':'transparent';
			context.fill();
			context.closePath();
		})
	})
}


function draw(){
	context.clearRect(0,0,canvas.width,canvas.height);
	drawBall();
	drawPaddle();
	drawScore();
	drawBricks();
}

function movePaddle(){
	paddle.x += paddle.dx;
	// 设置边界值 
	if(paddle.x + paddle.w > canvas.width){
		paddle.x = canvas.width - paddle.w;
	}
	
	if(paddle.x < 0){
		paddle.x = 0;
	}
}

function moveBall(){
	ball.x += ball.dx;
	ball.y += ball.dy;
	
	// 设置边界 左右侧
	if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
		ball.dx *= -1;
	}
	// 设置边界 上下侧
	if(ball.y + ball.size > canvas.height || ball.y - ball.size<0){
		ball.dy *= -1;
	}
	// 撞击挡板 
	if(ball.x-ball.size > paddle.x && ball.x+ball.size < paddle.x+paddle.w && ball.y + ball.size > paddle.y){
		ball.dy = -ball.speed;
	}
	
	bricks.forEach(colum=>{
		colum.forEach(brick=>{
			if(brick.visible){
				if(ball.x - ball.size > brick.x && ball.x+ball.size<brick.x +brick.w  && ball.y + ball.size > brick.y &&ball.y-ball.size<brick.y+brick.h){
					ball.dy *= -1;
					brick.visible = false;
					
					
					increaseSource();
				}
			}
		})
	})
	
	if(ball.y+ball.size>canvas.height){
		showAllBricks();
		score = 0;
		
	}
}

function increaseSource(){
	score++;
	if(score%(brickColumnCount*brickRowCount)===0){
		showAllBricks();
	}
}

function showAllBricks(){
	bricks.forEach(column=>{
		console.log(column)
		column.forEach(brick=>{
			brick.visible=true;
		})
	})
}


function keyDown(e){
	// 左右37 39
	if(e.keyCode === 39 ){
		paddle.dx = paddle.speed;
		
	}else if(e.keyCode === 37){
		paddle.dx = -paddle.speed;
		
	}
}
function keyUp(e){
	if(e.keyCode === 39 || e.keyCode === 37){
		paddle.dx = 0;
		
	}
}
// 设置事件监听
rulesBtn.addEventListener('click',()=>rules.classList.add('show'));
closeBtn.addEventListener('click',()=>rules.classList.remove('show'));
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

// 创建update的函数 

function update(){
	movePaddle();
	moveBall();
	draw();
	requestAnimationFrame(update);
}

update();