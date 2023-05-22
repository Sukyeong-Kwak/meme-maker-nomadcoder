const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraseBtn = document.getElementById("erase-btn");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const lineColor = document.querySelector("#color");
const lineWidth = document.querySelector("#line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;

ctx.lineCap = "round";


let isPainting = false;
let isFilling = false;

// 그림 그리기 
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY); 
}

function startPainting(event) {
  isPainting = true;
}

function cancelPainting(event) {
  isPainting = false;
}

// 붓 두께 바꾸기
function onLineWidthChange(event) {
  ctx.beginPath();
  ctx.lineWidth = event.target.value;
  ctx.fillStyle = event.target.value;
}

// 색 변경 함수(반복 방지)
function changeColor(color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  lineColor.value = color;
}

// 색 선택하기
function onLineColorChange(event) {
  changeColor(event.target.value);
}

// 지정 색 선택하기
function onColorClick(event) {
  changeColor(event.target.dataset.color);
}

// 캔버스 판에 배경색 채우기
function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw"
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } 
}

// 모두 지우기 (= 배경색을 흰색으로 채우기)
function onDestroyClick() {
  ctx.beginPath();
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}

// 지우개 (= 흰색으로 그리기)
function onEraseClick() {
  ctx.beginPath();
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

// 이미지 파일 삽입
function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function() {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  }
}

// 글자 삽입
function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1; 
    ctx.font = "48px serif"
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

// 저장 버튼
function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}


canvas.addEventListener("dblclick", onDoubleClick);

canvas.addEventListener("mousemove", onMove);

canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

lineWidth.addEventListener("change", onLineWidthChange)

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

lineColor.addEventListener("change", onLineColorChange);

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraseClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);