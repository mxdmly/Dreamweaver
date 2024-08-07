# Dreamweaver
A simple doodle for use in html5

## Example
``` html
<canvas id="draw" style="width:200px; height:200px; border: 2px solid #94FC13;"></canvas>
<div id="bar">
  <div id="painter"></div>
  <div id="tool"></div>
</div>
```

``` typescript
import Dreamweaver from 'doodle-board';
new Dreamweaver(document.getElementById("draw"), document.getElementById("bar"))
```