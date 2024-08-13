# Dreamweaver
A simple doodle for use in html5, There are some features that are not easy to use, I am trying to update.
**Pure JavaScript, No other dependence**
<br />
![image](https://github.com/user-attachments/assets/116d3351-68eb-4f5d-a743-5694b8a4bcbb)
## Example
``` html
<canvas id="draw" style="width:200px; height:200px; border: 2px solid #94FC13;"></canvas>
<div id="bar">
  <div id="painter">
    <!-- ...and other button -->
  </div>
  <div id="tool">
  </div>
  <canvas id="colorBar" style="width: 300px; height: 150px; padding-top:2%"></canvas>
</div>
```

``` typescript
import Dreamweaver from 'doodle-board';
new Dreamweaver(document.getElementById("draw"), document.getElementById("bar"), true)
```