import { Picture } from "./classDeclarations";

export const l = (a) => console.log(a);

export const scale = 10;

function drawPicture(picture, canvas, scale, previous) {
    if (previous == null ||
        previous.width != picture.width ||
        previous.height != picture.height) {
        canvas.width = picture.width * scale;
        canvas.height = picture.height * scale;
        previous = null;
    }

    let cx = canvas.getContext("2d");
    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            let color = picture.pixel(x, y);
            if (previous == null || previous.pixel(x, y) !== color) {
                cx.fillStyle = color;
                cx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
}

export const mouse = function(downEvent, onDown, domElt) {
    if (downEvent.button !== 0) return;
    let pos = pointerPosition(downEvent, domElt);
    let onMove = onDown(pos);
    if (!onMove) return;
    let move = moveEvent => {
        if (moveEvent.buttons === 0) {
            domElt.removeEventListener("mousemove", move);
        } else {
            let newPos = pointerPosition(moveEvent, domElt);
            if (newPos.x === pos.x && newPos.y === pos.y) return;
            pos = newPos;
            onMove(newPos);
        }
    };
    domElt.addEventListener("mousemove", move);
};

export const touch = function(startEvent,
    onDown, domElt) {
    let pos = pointerPosition(startEvent.touches[0], domElt);
    let onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    let move = moveEvent => {
        let newPos = pointerPosition(moveEvent.touches[0],
            domElt);
        if (newPos.x === pos.x && newPos.y === pos.y) return;
        pos = newPos;
        onMove(newPos);
    };
    let end = () => {
        domElt.removeEventListener("touchmove", move);
        domElt.removeEventListener("touchend", end);
    };
    domElt.addEventListener("touchmove", move);
    domElt.addEventListener("touchend", end);
};

export const pointerPosition = (pos, domNode) => {
    let rect = domNode.getBoundingClientRect();
    return {
        x: Math.floor((pos.clientX - rect.left) / scale),
        y: Math.floor((pos.clientY - rect.top) / scale)
    };
}

export const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        //return r+","+g+","+b;//return 23,14,45 -> reformat if needed
        return { r: r, g: g, b: b, a: 255 } 
    } 
    return null;
  }

  export const drawLine = (from, to, color) => {
    let points = [];
    if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
      if (from.x > to.x) [from, to] = [to, from];
      let slope = (to.y - from.y) / (to.x - from.x);
      for (let {x, y} = from; x <= to.x; x++) {
        points.push({x, y: Math.round(y), color});
        y += slope;
      }
    } else {
      if (from.y > to.y) [from, to] = [to, from];
      let slope = (to.x - from.x) / (to.y - from.y);
      for (let {x, y} = from; y <= to.y; y++) {
        points.push({x: Math.round(x), y, color});
        x += slope;
      }
    }
    return points;
  }

  export const drawStraightLine = (from, to, color) => {
    let points = [];
    if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
      if (to.x > from.x) {
        for (let {x, y} = from; x <= to.x; x++) {
          points.push({x, y: Math.round(y), color});
        }
      } else if (from.x > to.x) {
        for (let {x, y} = from; x >= to.x; x--) {
          points.push({x, y: Math.round(y), color});
        }
      }
      
    } else if (Math.abs(from.y - to.y) > Math.abs(from.x - to.x)) {
      if (to.y > from.y) {
        for (let {x, y} = from; y <= to.y; y++) {
          points.push({x: Math.round(x), y, color});
        }
      } else if (from.y > to.y) {
        for (let {x, y} = from; y >= to.y; y--) {
          points.push({x: Math.round(x), y, color});
        }
      }
    }
    return points;
  }

  export const drawRectangle = (start, pos, color) => {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
            drawn.push({ x, y, color });
        }
    }
    return drawn;
}

export const drawCircle = (pos, to, picture, color) => {
    let radius = Math.sqrt(Math.pow(to.x - pos.x, 2) +
        Math.pow(to.y - pos.y, 2));
    let radiusC = Math.ceil(radius);
    let drawn = [];
    for (let dy = -radiusC; dy <= radiusC; dy++) {
        for (let dx = -radiusC; dx <= radiusC; dx++) {
            let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            if (dist > radius) continue;
            let y = pos.y + dy,
                x = pos.x + dx;
            if (y < 0 || y >= picture.height ||
                x < 0 || x >= picture.width) continue;
            drawn.push({ x, y, color });
        }
    }
    return drawn;
}

export const download = async (canvasRef) => {
  const image = canvasRef.current.toDataURL('image/png');
  const blob = await (await fetch(image)).blob();
  const blobURL = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = "image.png";
  link.click();
  link.remove();
}

export const loadImage = (dispatch, width, height) => {
  let rawImage;
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = () => {
    rawImage = finishLoad(input.files[0], dispatch, width, height);
    };
  input.click();
  return rawImage;
}

const finishLoad = (file, dispatch, width, height) => {
  let raw;
  if (file == null) return;
  let image = document.createElement("img");
  image.onload = () => {
    raw = pictureFromImage(image, width, height);
    console.log("raw: ", raw); 
    dispatch({ type: 'draw/fromImage', payload: {...raw} })
  }
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    image.src = reader.result;
  });
  reader.readAsDataURL(file);
}

const pictureFromImage = (image, width, height) => {
  let canvas = document.createElement("canvas");;
  canvas.width = width;
  canvas.height = height;
  let hRatio = canvas.width  / image.width;
  let vRatio =  canvas.height / image.height;
  let ratio  = Math.max ( hRatio, vRatio );
  let centerShift_x = ( canvas.width - image.width * ratio ) / 2;
  let centerShift_y = ( canvas.height - image.height * ratio ) / 2; 
  let cx = canvas.getContext("2d");
  cx.clearRect(0,0,canvas.width, canvas.height);
  cx.drawImage(image, 0, 0, image.width, image.height,
    centerShift_x, centerShift_y, image.width*ratio, image.height*ratio); 
  let pixels = [];
  let { data } = cx.getImageData(0, 0, width, height);
  function hex(n) {
      return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
      let [r, g, b] = data.slice(i, i + 3);
      pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

function drawImageScaled(img, ctx) {
  var canvas = ctx.canvas ;
  var hRatio = canvas.width  / img.width    ;
  var vRatio =  canvas.height / img.height  ;
  var ratio  = Math.min ( hRatio, vRatio );
  var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
  var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.drawImage(img, 0,0, img.width, img.height,
                     centerShift_x,centerShift_y,img.width * ratio, img.height * ratio);  
}