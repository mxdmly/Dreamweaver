# Dreamweaver
A simple doodle for use in html5
<br />
Pure JavaScript, No other dependence
<br />
![image](https://github.com/user-attachments/assets/116d3351-68eb-4f5d-a743-5694b8a4bcbb)
## Example
``` html
<canvas id="draw" style="width:200px; height:200px; border: 2px solid #94FC13;"></canvas>
<div id="bar">
  <div id="painter">
    <button id="pen">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z" />
      </svg>
    </button>
    <!-- ...and other button -->
  </div>
  <div id="tool">
    <canvas id="colorBar" style="width: 300px; height: 150px; padding-top:2%"></canvas>
  </div>
</div>
```

``` typescript
import Dreamweaver from 'doodle-board';
new Dreamweaver(document.getElementById("draw"), document.getElementById("bar"))
```
