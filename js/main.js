
window.onload = function() {
  var width = 330;
  var height = 100;

  var gui = new dat.GUI();
  var rectCount = 3;
  var demo = $(".demo");
  var predefinedColors = ["#00aeff", "#0fa954", "#54396e", "#e61d5f"];
  var colorIndex = 0;

  var logo = new Logo();
  logo.message = "<epam>";
  logo.fontStyle = "Helvetica";
  logo.fontSize = 80;

  gui.add(logo, "message");
  gui.add(logo, "fontStyle", ["Arial", "Helvetica", "sans-serif"])
  gui.add(logo, "fontSize", 80).min(0).max(200);

  var polygonPoints = [
    [[0,0], [width/2, height], [0, height], [0,0]],
    [[0,0], [width/2, 0], [width, height], [width/2, height], [0,0]],
    [[width/2, 0], [width, 0], [width, height], [width/2,0]]
  ]

  for(var i = 0; i < rectCount; i++) {
    var points = polygonPoints[i];//generatePolygonPoints(i, rectCount)
    var canvas = $("<canvas>");
    canvas.attr("width", width);
    canvas.attr("height", height);
    demo.append(canvas);

    canvas.css("-webkit-clip-path", "polygon(" + polygonArrayIntoString(points) + ")");

    var clip = new Clip(canvas[0], points);
    clip.color0 = predefinedColors[colorIndex++];
    clip.color1 = predefinedColors[colorIndex];
    clip.particleCount = 300;

    clip.growthSpeed = 0.2;       // how fast do particles change size?
    clip.maxSize = 4;          // how big can they get?
    clip.noiseStrength = 10;      // how turbulent is the flow?
    clip.speed = 0.2;             // how fast do particles move?
    clip.displayOutline = false;  // should we draw the message as a stroke?
    clip.framesRendered = 0;

    logo.addClip(clip);

    var folder = gui.addFolder('Part' + (i + 1));

    // Sliders with min + max
    folder.add(clip, "particleCount").min(1).max(400);
    folder.add(clip, "maxSize").min(0.5).max(7);
    folder.add(clip, "growthSpeed").min(0.01).max(1).step(0.05);
    folder.add(clip, "speed", 0.1, 2, 0.05); // shorthand for min/max/step

    // Sliders with min, max and increment.
    folder.add(clip, "noiseStrength", 10, 100, 5);

    folder.addColor(clip, "color0");
    folder.addColor(clip, "color1");

    // Boolean checkbox
    folder.add(clip, "displayOutline");
  }

  function generatePolygonPoints(i, rectCount) {
    return [
      [i * width / rectCount, 0],
      [(i + 1) * width / rectCount, 0],
      [(i + 1) * width / rectCount, height],
      [i * width / rectCount, height],
      [i * width / rectCount, 0]
    ];
  }

  function polygonArrayIntoString(array) {
    var result = '';
    for(var i = 0; i < array.length; i++) {
      result += array[i][0] + 'px' + ' ' + array[i][1] + 'px';
      if (i < array.length - 1) {
        result += ',';
      }
    }

    return result;
  }
};
