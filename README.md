# Dreamweaver
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
A simple doodle for use in html5, There are some features that are not easy to use, I am trying to update.
<br />
**Pure JavaScript, No other dependence**s
<br />
![image](https://github.com/user-attachments/assets/116d3351-68eb-4f5d-a743-5694b8a4bcbb)

## Example
``` html
<canvas id="draw" style="width:200px; height:200px; border: 2px solid #94FC13;"></canvas>
<div id="bar">
  <div id="painter"></div>
  <br />
  <div id="tool"></div>
  <br />
  <canvas id="colorBar" style="width: 300px; height: 150px; padding-top:2%"></canvas>
</div>
```

``` typescript
import Dreamweaver from 'doodle-board';
new Dreamweaver(document.getElementById("draw"), document.getElementById("bar"), true)
```

## Advanced
``` html
<canvas id="draw" style="width:200px; height:200px; border: 2px solid #94FC13;"></canvas>
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
    <button id="save" onclick="saveImg()"></button>
    <button id="delete"></button>
  </div>
  <br />
  <!-- Brush size -->
  <!-- <input onchange="onChangeFontSize" /> under development  -->
  <br />
  <!-- Color selection -->
  <canvas id="colorBar" style="width: 300px; height: 150px; padding-top:2%"></canvas>
</div>
```
``` typescript
import Dreamweaver, { DW_curtain, featureFun } from 'doodle-board';
const dw_curtain = DW_curtain;
dw_curtain.canvas = document.getElementById("draw-canvas")
new Dreamweaver(dw_curtain.canvas, document.getElementById("bar"))
// Save the image to local
const saveImg = () => {
  let link = document.createElement('a')
  link.download = 'image.png';
  link.href = featureFun('save', dw_curtain)
  link.click()
}
```