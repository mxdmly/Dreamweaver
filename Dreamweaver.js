// MIT License

// Copyright (c) [2022] [Jintao.Wu] [mxdmly]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// https://choosealicense.com/licenses/mit/

/**
 * 画图⭐
 * 关注嘉然，顿顿解馋
 */
export default class Dreamweaver {
  constructor(...args) {
  //用id构建对象
  DW_curtain.canvas = args[0];
  DW_brush.div = args[1];
  this.autoCreateTools(args[2])

  //添加控件
  //假如对象被创建了即可绑定鼠标与键盘事件
  if (DW_curtain.canvas) {
    DW_curtain.ctx = DW_curtain.canvas.getContext('2d');
    //获取并设置宽高
    DW_curtain.size.width = DW_curtain.canvas.width;
    DW_curtain.size.height = DW_curtain.canvas.height;
    DW_curtain.canvas.onmousemove = function (ev) {
    mouseAxis.lastX = mouseAxis.nowX;
    mouseAxis.lastY = mouseAxis.nowY;
    mouseAxis.nowX = ev.offsetX;
    mouseAxis.nowY = ev.offsetY;
    drawPicture(mouseAxis, DW_curtain);
    };
    DW_curtain.canvas.onmousedown = function (ev) {
    DW_curtain.draw = true;
    mouseAxis.firstX = ev.offsetX;
    mouseAxis.firstY = ev.offsetY;
    //避免重复使用上次绘制后残留的画笔
    DW_curtain.ctx.beginPath();
    //为了避免画笔线段头尾连接
    // DW_curtain.ctx.moveTo(mouseAxis.nowX, mouseAxis.nowY);
    //画笔触碰到画板，意味着开始画新的内容，所以以前的历史记录可以清空
    console.log(DW_curtain.history_current + 1, DW_curtain.history.length - DW_curtain.history_current + 1);//测试用的
    DW_curtain.history.splice(DW_curtain.history_current + 1, DW_curtain.history.length - DW_curtain.history_current - 1);
    }
    DW_curtain.canvas.onmouseup = function (ev) {
    DW_curtain.draw = false;
    //存储画布历史记录，用于重绘与撤销
    let img = new Image();
    img.src = DW_curtain.canvas.toDataURL();
    DW_curtain.history.push(img);
    DW_curtain.history_current++;
    }
  }
  if (DW_brush.div) {
    DW_brush.colorBar.canvas = DW_brush.div.querySelector("#colorBar");
    DW_brush.colorBar.ctx = DW_brush.div.querySelector("#colorBar").getContext('2d');
    //获取并设置宽高
    DW_brush.colorBar.size.width = DW_brush.colorBar.canvas.width;
    DW_brush.colorBar.size.height = DW_brush.colorBar.canvas.height;
    DW_brush.colorBar.array = createColorArray(9);
    DW_brush.colorBar.canvas.onmousemove = function (ev) {
    mouseAxis.lastX = mouseAxis.nowX;
    mouseAxis.lastY = mouseAxis.nowY;
    mouseAxis.nowX = ev.offsetX;
    mouseAxis.nowY = ev.offsetY;
    draw(mouseAxis, DW_brush, DW_curtain);
    };
    DW_brush.colorBar.canvas.onmousedown = function (ev) {
    DW_brush.colorBar.draw = true;
    draw(mouseAxis, DW_brush, DW_curtain);//点击后也能选中颜色
    }
    DW_brush.colorBar.canvas.onmouseup = function (ev) {
    DW_brush.colorBar.draw = false;
    }
    //画笔、圆、矩形、箭头、橡皮擦、文字 等按钮
    DW_brush.div.querySelector("#painter").querySelectorAll("button").forEach(function (button) {
    button.onclick = function (ev) {
      ev.cancelBubble = true; //阻止DOM冒泡，提高性能
      DW_curtain.shapeFun = chargeShapeFun(button.id, DW_curtain.ctx); //返回一个描述绘画路径的函数
      button.style = "background-color:#46a3ff; border:2px solid #000000;"; //把当前按下的按钮设置一个颜色方便辨认，以后改成calss样式
      DW_brush.div.querySelectorAll("button").forEach(function (b) {
      if (b.id !== button.id) {
        b.style = ""; //把非当前按下的按钮背景改回普通颜色
      }
      });
      //把鼠标指针改为画笔的样式
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="` + DW_brush.colorBar.ctx.fillStyle + `" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z" /></svg>`;
      const iconUrl = 'data:image/svg+xml;base64,'
      + window.btoa(unescape(encodeURIComponent(svgIcon)))
      DW_curtain.canvas.style.cursor = 'url(' + iconUrl + ') 0 24,auto';
    }
    });
    //移动、回退、重绘、保存 等按钮
    DW_brush.div.querySelector("#tool").querySelectorAll("button").forEach(function (button) {
    button.onclick = function (ev) {
      featureFun(button.id, DW_curtain);
    }
    });
    //加载颜色选择器
    updateColorBar(DW_brush.colorBar.array, DW_brush.colorBar.ctx);
    updateColorSlider(0, DW_brush.colorBar);
    draw(mouseAxis, DW_brush, DW_curtain);
  }
  }
  /**
   * 设置笔触大小，或者说设置笔尖接触画板的轻重
   * @param {*} i 一个数值，代表笔触大小
   */
  setSize(i) {
    DW_curtain.ctx.lineWidth = i;
  }
  sendCanvas() {
    return DW_curtain.canvas;
  }
  setCanvasSize(dw_curtain = DW_curtain.canvas ,w, h, left, top) {
    if (dw_curtain.canvas) {
      dw_curtain.canvas.style.left = left;
      // dw_curtain.canvas.style.top = top;
      dw_curtain.size.width = dw_curtain.canvas.width;
      dw_curtain.size.height = dw_curtain.canvas.height;
    }
  }
  autoCreateTools(autoCreateTools = false) {
    if (autoCreateTools == false) {
      return
    }
    //画笔
    let painter_div = document.getElementById('painter')
    if (null == painter_div.querySelector('#pen')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'pen'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z" /></svg>`
      painter_div.appendChild(temp_btn)
    }
    if (null == painter_div.querySelector('#round')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'round'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z" /></svg>`
      painter_div.appendChild(temp_btn)
    }
    if (null == painter_div.querySelector('#square')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'square'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" /></svg>`
      painter_div.appendChild(temp_btn)
    }
    if (null == painter_div.querySelector('#arrow')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'arrow'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="m18.787 9.473s-4.505-4.502-6.259-6.255c-.147-.146-.339-.22-.53-.22-.192 0-.384.074-.531.22-1.753 1.753-6.256 6.252-6.256 6.252-.147.147-.219.339-.217.532.001.19.075.38.221.525.292.293.766.295 1.056.004l4.977-4.976v14.692c0 .414.336.75.75.75.413 0 .75-.336.75-.75v-14.692l4.978 4.978c.289.29.762.287 1.055-.006.145-.145.219-.335.221-.525.002-.192-.07-.384-.215-.529z" /></svg>`
      painter_div.appendChild(temp_btn)
    }
    if (null == painter_div.querySelector('#rubber')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'rubber'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm.456-11.429l-4.528 4.528 5.658 5.659 4.527-4.53-5.657-5.657z" /></svg>`
      painter_div.appendChild(temp_btn)
    }
    if (null == painter_div.querySelector('#text')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'text'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M22 0h-20v6h1.999c0-1.174.397-3 2.001-3h4v16.874c0 1.174-.825 2.126-2 2.126h-1v2h9.999v-2h-.999c-1.174 0-2-.952-2-2.126v-16.874h4c1.649 0 2.02 1.826 2.02 3h1.98v-6z" /></svg>`
      painter_div.appendChild(temp_btn)
    }
    //工具箱
    let tool_div = document.getElementById('tool')
    if (null == tool_div.querySelector('#delete')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'delete'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 14.586l3.586-3.586 1.414 1.414-3.586 3.586 3.586 3.586-1.414 1.414-3.586-3.586-3.586 3.586-1.414-1.414 3.586-3.586-3.586-3.586 1.414-1.414 3.586 3.586zm-7 6.414h-12v-2h12v2zm0-4.024h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-4h-24v-2h24v2z" /></svg>`
      tool_div.appendChild(temp_btn)
    }
    if (null == tool_div.querySelector('#save')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'save'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z" /></svg>`
      tool_div.insertBefore(temp_btn, tool_div.querySelector('#delete'))
    }
    if (null == tool_div.querySelector('#redo')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'redo'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M4.115 5.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.819-2.706-7.297-2.676-10.074.1-2.992 2.993-2.664 7.684.188 10.319l-3.314 3.5c-4.716-4.226-5.257-12.223-.267-17.213z" /></svg>`
      tool_div.insertBefore(temp_btn, tool_div.querySelector('#save'))
    }
    if (null == tool_div.querySelector('#undo')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'undo'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19.885 5.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.074.1 2.992 2.993 2.664 7.684-.188 10.319l3.314 3.5c4.716-4.226 5.257-12.223.267-17.213z" /></svg>`
      tool_div.insertBefore(temp_btn, tool_div.querySelector('#redo'))
    }
    if (null == tool_div.querySelector('#close')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'close'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-unlock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`
      tool_div.insertBefore(temp_btn, tool_div.querySelector('#undo'))
    }
    if (null == tool_div.querySelector('#open')) {
      let temp_btn = document.createElement('button')
      temp_btn.id = 'open'
      temp_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
      tool_div.insertBefore(temp_btn, tool_div.querySelector('#close'))
    }
  }
}

/**画布 */
export const DW_curtain = {
  canvas: null,
  ctx: null,
  draw: false,
  shapeFun: function () { },
  /**位置与画布大小 */
  size: {
  top: 12,
  left: 12,
  width: 500,
  height: 500
  },
  /**历史记录 */
  history: [],
  history_current: -1,
};
/**画笔盒 */
const DW_brush = {
  div: null,
  text: null,
  /** 调色盘 */
  colorBar: {
  canvas: null,
  ctx: null,
  draw: false,
  size: {
    top: null,
    left: null,
    width: 120,
    height: 10
  },
  /**用于组合成rgb颜色环的数组 */
  array: [],
  }
};
/**鼠标坐标轴 */
const mouseAxis = {
  nowX: 0,
  nowY: 0,
  lastX: 0,
  lastY: 0,
  firstX: 0,
  firstY: 0,
}


/**
 * 创造颜色选择器数组
 * @param {Number} threshold 阈值，该值越大色彩过渡越平滑，但需要更长的容器
 * @returns {Array} 数组
 */
function createColorArray(threshold = 15) {
  let colorRBG_array = [];
  let max = 255 / threshold * 6; //颜色块之间丰富程度，取值1~15，反比
  let r = 255, g = 0, b = 0;
  for (let i = 0; i <= max; i++) {
  colorRBG_array.push({ r: r, g: g, b: b });
  if (g <= 0 && r >= 255) b = b + threshold; //RGB颜色循环
  if (g <= 0 && b >= 255) r = r - threshold;
  if (r <= 0 && b >= 255) g = g + threshold;
  if (r <= 0 && g >= 255) b = b - threshold;
  if (b <= 0 && g >= 255) r = r + threshold;
  if (b <= 0 && r >= 255) g = g - threshold;
  }
  return colorRBG_array;
}

/**
 * 颜色选择器的滑块
 * @param {int} x 鼠标落在横坐标的位置，需要整数
 */
function updateColorSlider(x, bar) {
  x = x - 8;
  const { ctx, array } = bar;
  if (x < 2) { //限制滑块位置
  x = 1;
  } else if (x > bar.size.width - 16) {
  x = bar.size.width - 15;
  }
  ctx.lineWidth = 2;
  //外圈黑色圆环
  ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  ctx.beginPath();
  //arc(x, y, radius, startAngle, endAngle, anticlockwise)
  //画一个以（x,y）为圆心的以 radius 为半径的圆弧（圆），从 startAngle 开始到 endAngle 结束，按照 anticlockwise 给定的方向（默认为顺时针）来生成。
  ctx.arc(x + 7, 10, 8, 0, Math.PI * 2);
  ctx.stroke();
  //中间圈白色圆环
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  ctx.beginPath();
  ctx.arc(x + 7, 10, 7, 0, Math.PI * 2);
  ctx.stroke();
  //内圈实心颜色圆环，表示当前颜色
  ctx.fillStyle = "rgba(" + array[x].r + "," + array[x].g + " ," + array[x].b + ", 1)";
  ctx.beginPath();
  ctx.arc(x - 0 + 7, 10, 5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 画颜色选择器的背景条
 */
function updateColorBar(array, ctx) {
  for (let i = 0; i < array.length; i++) {
  ctx.fillStyle = "rgba(" + array[i].r + "," + array[i].g + " ," + array[i].b + ", 1)";
  ctx.beginPath();
  ctx.moveTo(i + 7, 6);
  ctx.lineTo(++i + 7, 6);
  ctx.lineTo(i + 7, 14);
  ctx.lineTo(--i + 7, 14);
  ctx.fill();
  }
}

/**
 * 清除画布内容
 * @param {*} canvasContainer 画布
 */
function clear(canvasContainer) {
  canvasContainer.ctx.clearRect(0, 0, canvasContainer.size.width, canvasContainer.size.height);
}

/**
 * 鼠标在颜色框移动就会触发这个函数
 */
function draw(mouseAxis, canvasContainer, canvasContainer2) {
  const { colorBar } = canvasContainer;
  if (colorBar.draw === false) return;
  clear(colorBar);
  updateColorBar(colorBar.array, colorBar.ctx);
  updateColorSlider(mouseAxis.nowX, colorBar);
  //改变主画笔的颜色
  canvasContainer2.ctx.fillStyle = colorBar.ctx.fillStyle;
  canvasContainer2.ctx.strokeStyle = colorBar.ctx.fillStyle;
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" stroke-width="60" fill="` + DW_brush.colorBar.ctx.fillStyle + `" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z" /></svg>`;
  const iconUrl = 'data:image/svg+xml;base64,'
  + window.btoa(unescape(encodeURIComponent(svgIcon)))
  DW_curtain.canvas.style.cursor = 'url(' + iconUrl + ') 0 24,auto';
}

/**
 * 绘画专用，移动鼠标的分类
 * @param {document.getElementById} id 是那个按钮调用的，输入id就行
 * @param {*} x 鼠标x轴
 * @param {*} y 鼠标y轴
 */
function chargeShapeFun(id, ctx) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  switch (id) {
  case "pen": //画笔
    return function (mouseAxis, ctx) {
    ctx.lineTo(mouseAxis.nowX, mouseAxis.nowY);
    ctx.stroke();
    }
  case "square": //正方形
    return function (mouseAxis, ctx, canvasContainer) {
    clearPicture(canvasContainer)
    ctx.beginPath();
    ctx.strokeRect(mouseAxis.firstX, mouseAxis.firstY, mouseAxis.nowX - mouseAxis.firstX, mouseAxis.nowY - mouseAxis.firstY);
    ctx.stroke();
    }
  case "round": //圆形
    return function (mouseAxis, ctx, canvasContainer) {
    clearPicture(canvasContainer)
    ctx.beginPath();
    //圆心以后得做成动态的，目前还不是
    ctx.ellipse(mouseAxis.firstX + (mouseAxis.nowX - mouseAxis.firstX) / 2, mouseAxis.firstY + (mouseAxis.nowY - mouseAxis.firstY) / 2, Math.abs(mouseAxis.nowX - mouseAxis.firstX) / 2, Math.abs(mouseAxis.nowY - mouseAxis.firstY) / 2, Math.PI, 0, 2 * Math.PI);
    ctx.stroke();
    }
  case "arrow": //箭头
    return function (mouseAxis, ctx, canvasContainer) {
    clearPicture(canvasContainer)
    //龙哥的代码， 以后要自己写一次——————————————————————————————————————————————————————————
    if (mouseAxis.nowX !== 0 && mouseAxis.nowY !== 0 && mouseAxis.firstX !== 0 && mouseAxis.firstY !== 0) {
      ctx.fill();

      var offsetFactor = 22
      var arrowScaleFactor = 2.0

      var slopy = Math.atan2((mouseAxis.nowY - mouseAxis.firstY), (mouseAxis.nowX - mouseAxis.firstX))
      var cosy = Math.cos(slopy)
      var siny = Math.sin(slopy)

      var OffsetPosX1 = -offsetFactor * cosy - (offsetFactor / arrowScaleFactor * siny)
      var OffsetPosX2 = -offsetFactor * cosy + (offsetFactor / arrowScaleFactor * siny)
      var OffsetPosY1 = -offsetFactor * siny + (offsetFactor / arrowScaleFactor * cosy)
      var OffsetPosY2 = offsetFactor * siny + (offsetFactor / arrowScaleFactor * cosy)

      offsetFactor = 18
      arrowScaleFactor = 4

      var OffsetPosX3 = -offsetFactor * cosy - (offsetFactor / arrowScaleFactor * siny)
      var OffsetPosX4 = -offsetFactor * cosy + (offsetFactor / arrowScaleFactor * siny)
      var OffsetPosY3 = -offsetFactor * siny + (offsetFactor / arrowScaleFactor * cosy)
      var OffsetPosY4 = offsetFactor * siny + (offsetFactor / arrowScaleFactor * cosy)

      ctx.beginPath()
      ctx.moveTo(mouseAxis.nowX, mouseAxis.nowY)
      ctx.lineTo(mouseAxis.nowX + OffsetPosX1, mouseAxis.nowY + OffsetPosY1)
      ctx.lineTo(mouseAxis.nowX + OffsetPosX3, mouseAxis.nowY + OffsetPosY3)
      ctx.lineTo(mouseAxis.firstX, mouseAxis.firstY)
      ctx.lineTo(mouseAxis.nowX + OffsetPosX4, mouseAxis.nowY - OffsetPosY4)
      ctx.lineTo(mouseAxis.nowX + OffsetPosX2, mouseAxis.nowY - OffsetPosY2)
      ctx.closePath()
    }
    //抄袭是可耻的————————————————————————————————————————————————————————————————————————
    // ctx.beginPath();
    // ctx.moveTo(mouseAxis.firstX, mouseAxis.firstY);
    // ctx.lineTo(mouseAxis.nowX - Math.abs(mouseAxis.nowX -  mouseAxis.firstX) * 0.3, mouseAxis.nowY - Math.abs(mouseAxis.firstY - mouseAxis.nowY) * 0.3);
    // ctx.lineTo(mouseAxis.firstX - 20, mouseAxis.nowY - (mouseAxis.nowY - mouseAxis.firstY)*0.3);
    // ctx.lineTo(mouseAxis.nowX, mouseAxis.nowY);
    // ctx.lineTo(mouseAxis.firstX + 20, mouseAxis.nowY - (mouseAxis.nowY - mouseAxis.firstY)*0.3);
    // ctx.lineTo(mouseAxis.nowX + 10, mouseAxis.nowY + 10);
    // ctx.fill();
    }
  case "rubber": //橡皮檫
    return function (mouseAxis, ctx) {
    ctx.globalCompositeOperation = 'destination-out';
    //ctx.beginPath()
    ctx.moveTo(mouseAxis.lastX, mouseAxis.lastY);
    ctx.lineTo(mouseAxis.nowX, mouseAxis.nowY);
    ctx.stroke();
    }
  case "text":
    if (DW_brush.text == null) {
    //悬浮窗
    DW_brush.text = document.createElement("div");
    DW_brush.text.setAttribute("id", "text");
    DW_brush.text.style = `
          background-color:rgba(0.5,0.5,0.5,0);
          position: fixed;
          left:500px;
          top:500px;
          display:none`;
    //输入框
    let input = document.createElement("textarea");
    input.setAttribute("id", "text_input");
    input.style = "background-color:rgba(0.5,0.5,0.5,0.5)";
    //确定按钮，点击后把文本写入当前坐标轴上
    let access_btn = document.createElement("button");
    access_btn.setAttribute("id", "access_btn");
    access_btn.innerHTML = "Access";
    access_btn.style = "color:rgba(0.5,0.5,0.5,0.5)";
    access_btn.onclick = function (e) {
      ctx.fillText(DW_brush.text.querySelector("#text_input").value,
      Number(DW_brush.text.style.left.replace("px", "")) - Number(DW_curtain.canvas.style.left.replace("px", "")),
      Number(DW_brush.text.style.top.replace("px", "")) - 20,
      );
    }
    //取消按钮
    let cancel_btn = document.createElement("button");
    cancel_btn.setAttribute("id", "access_btn");
    cancel_btn.innerHTML = "Cancel";
    cancel_btn.style = "color:rgba(0.5,0.5,0.5,0.5)";
    cancel_btn.onclick = function () {
      DW_brush.text.style.display = "none";
    }

    DW_brush.text.appendChild(access_btn);
    DW_brush.text.appendChild(cancel_btn);
    DW_brush.text.appendChild(document.createElement("br"));
    DW_brush.text.appendChild(input);
    DW_curtain.canvas.parentNode.appendChild(DW_brush.text);
    }
    return function (mouseAxis, ctx) {
    DW_brush.text.style.display = "block";
    DW_brush.text.style.color = ctx.fillStyle;
    // DW_brush.text.style.fontSize = DW_curtain.ctx.lineWidth + "px";
    DW_brush.text.style.left = 10 + mouseAxis.nowX + Number(DW_curtain.canvas.style.left.replace("px", "")) + "px";
    DW_brush.text.style.top = -50 + mouseAxis.nowY + Number(DW_curtain.canvas.style.top.replace("px", "")) + "px";
    }
  default:
    break;
  }
}

/**
 * 功能性按钮
 * @param {*} id 识别按下哪个按钮
 * @param {*} canvasContainer 画布容器
 * @returns 
 */
export function featureFun(id, canvasContainer) {
  const { ctx, history } = canvasContainer;
  ctx.globalCompositeOperation = 'source-over';
  switch (id) {
  /*
  case "draw_move":
    if (drawMove_boo) { //是否第一次移动图层
      drawBack();
      drawMove_boo = false;
    }
    if (myDrawCanvasPictureNum_i < myDrawCanvasSaveDataTemp_array.length) {
      myDraw_ctx.clearRect(0, 0, myDrawcanvasWidth_i, myDrawcanvasHight_i);
      myDraw_ctx.drawImage(myDrawCanvasSaveDataTemp_array[myDrawCanvasPictureNum_i + 1], x - x_buff, y - y_buff);
    }
    break;
  */
  case "undo":
    clear(canvasContainer);
    if (canvasContainer.history_current >= 0) {
    canvasContainer.history_current--;
    if (canvasContainer.history_current >= 0) {
      ctx.drawImage(history[canvasContainer.history_current], 0, 0);
    }
    }
    break;
  case "redo":
    if (canvasContainer.history_current < history.length - 1) {
    canvasContainer.history_current++;
    clear(canvasContainer);
    ctx.drawImage(history[canvasContainer.history_current], 0, 0);
    }
    break;
  case "save":
    let img = new Image();
    img.src = canvasContainer.canvas.toDataURL();
    return img;
  case "delete":
    clear(canvasContainer);
    history.length = 0;
    canvasContainer.history_current = -1;
    break;
  default:
    break;
  }
}
/**
 * 鼠标在绘画框移动就会触发这个函数
 */
function drawPicture(mouseAxis, canvasContainer) {
  const { ctx } = canvasContainer;
  if (canvasContainer.draw === false) return;
  //绘制新内容
  canvasContainer.shapeFun(mouseAxis, ctx, canvasContainer);
}

/**
 * 形状画笔需要清除历史痕迹
 * @param {*} canvasContainer 
 */
function clearPicture(canvasContainer) {
  const { ctx, history, history_current } = canvasContainer;
  clear(canvasContainer);
  // 把历史记录绘画出来
  if (history_current >= 0) {
  ctx.drawImage(history[history_current], 0, 0);
  }
}