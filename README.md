# Dreamweaver

[![npm](https://img.shields.io/npm/v/doodle-board.svg)](https://www.npmjs.com/package/doodle-board)
[![npm](https://img.shields.io/npm/dw/doodle-board.svg)](https://www.npmjs.com/package/doodle-board)
[![npm](https://img.shields.io/npm/l/doodle-board.svg)](https://mit-license.org)

A simple doodle for use in html5, There are some features that are not easy to use, I am trying to update.
<br />
**Pure JavaScript, No other dependence**
<br />
![image](https://github.com/user-attachments/assets/116d3351-68eb-4f5d-a743-5694b8a4bcbb)

## Example
``` html
<canvas id="draw" width=200 height=200 style="border: 2px solid #94FC13;"></canvas>
<div id="bar">
  <div id="painter"></div>
  <br />
  <div id="tool"></div>
  <br />
  <canvas id="colorBar" width=200 height=150 style="padding-top:2%"></canvas>
</div>
```

``` typescript
import Dreamweaver from 'doodle-board';
new Dreamweaver(document.getElementById("draw"), document.getElementById("bar"), true)
```

## Advanced
``` html
<canvas id="draw" width=200 height=200 style="border: 2px solid #94FC13;"></canvas>
<div id="bar">
  <!-- Drawing tool -->
  <div id="painter">
    <button id="pen"><!-- Your picture --></button>
    <button id="round"></button>
    <button id="square"></button>
    <button id="arrow"></button>
    <button id="rubber"></button>
    <!-- <button id="text"></button> under development -->
  </div>
  <br />
  <!-- Modification tool -->
  <div id="tool">
    <button id="open"></button>
    <button id="close"></button>
    <button id="undo"></button>
    <button id="redo"></button>
    <button id="save"></button>
    <button id="delete"></button>
  </div>
  <br />
  <!-- Brush size -->
  <!-- <input onchange="onChangeFontSize" /> under development  -->
  <br />
  <!-- Color selection -->
  <canvas id="colorBar" width=200 height=150 style="padding-top:2%"></canvas>
</div>
```
``` typescript
import Dreamweaver, { DW_curtain, DW_brush, featureFun, colorBarDraw } from 'doodle-board';
const dw_curtain = DW_curtain;
const dw_brush = DW_brush
window.onload = () => {
  dw_curtain.canvas = document.getElementById("draw");
  dw_brush.div = document.getElementById("bar")
  new Dreamweaver(dw_curtain.canvas, dw_brush.div, true)
  document.getElementById('save').addEventListener('click', () => {  
    saveImg();
  });  
}
// Save the image to local
const saveImg = () => {
  let link = document.createElement('a')
  link.download = 'image.png';
  link.href = featureFun('save', dw_curtain).src
  link.click()
}
// Change brush color
const changeColor = () => {
  dw_curtain.ctx.strokeStyle = "rgba(255,0,0,1)";
  colorBarDraw(2, dw_brush, dw_curtain)
}
```