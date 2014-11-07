function Clip(canvas, points) {
  var that = this;
  var fontSize = 0;
  var fontStyle = "";
  var message = "";
  var particleCount = 0;
  var particles = [];

  // These are the variables that we manipulate with gui-dat.
  // Notice they're all defined with "this". That makes them public.
  // Otherwise, gui-dat can't see them.

  this.__defineGetter__("message", function () {
    return message;
  });
  this.__defineSetter__("message", function (m) {
    message = m;

    that.createBitmap();
  });

  this.__defineGetter__("fontSize", function() {
    return fontSize;
  });
  this.__defineSetter__("fontSize", function (fs) {
    fontSize = fs;

    that.createBitmap();
  });

  this.__defineGetter__("fontStyle", function() {
    return fontStyle;
  });
  this.__defineSetter__("fontStyle", function (fs) {
    fontStyle = fs;

    that.createBitmap();
  });


  this.__defineGetter__("particleCount", function() {
    return particleCount;
  });
  this.__defineSetter__("particleCount", function (pc) {
    particleCount = pc;

    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle(rect.x + Math.random() * rect.width, rect.y + Math.random() * rect.height));
    }
  });

  ////////////////////////////////////////////////////////////////
  // This is the context we actually use to draw.
  var c = canvas;// document.createElement('canvas');
  var g = c.getContext('2d');

  var rect = getRectFromPoints(points);
  var width = c.width;
  var height = c.height;
  // var textAscent = 80;
  // var textOffsetLeft = 0;
  var noiseScale = 300;
  // var frameTime = 30;

  // var colors = ["#00aeff", "#0fa954", "#54396e", "#e61d5f"];

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  $(r).css("-webkit-clip-path", $(c).css("-webkit-clip-path"));
  var s = r.getContext('2d');

  r.setAttribute('width', c.width);
  r.setAttribute('height', c.height);

  // Stores bitmap image
  var pixels = [];

  this.resize = function(w, h) {
    width = w;
    height = h;
  };

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  this.createBitmap = function () {

    s.font = g.font = "800 " + fontSize + "px " + fontStyle;
    s.fillStyle = "#fff";
    s.fillRect(0, 0, width, height);

    s.fillStyle = "#222";
    s.fillText(message, 0, fontSize);

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;
  };

  // Called once per frame, updates the animation.
  this.render = function () {
    g.clearRect(0, 0, width, height);

    if (that.displayOutline) {
      g.globalCompositeOperation = "source-over";
      g.strokeStyle = "#000";
      g.lineWidth = .5;
      g.strokeText(message, 0, fontSize);
    }

    g.globalCompositeOperation = "darker";

    var colors = [];
    for (var prop in that) {
      if (prop.indexOf("color") == 0 && that[prop].toLowerCase() != "#ffffff") {
        colors.push(that[prop]);
      }
    }

    for (var i = 0; i < particles.length; i++) {
      g.fillStyle = colors[i % colors.length];
      particles[i].render();
    }

  };

  // Returns a color for a given pixel in the pixel array.
  var getColor = function (x, y) {
    var base = (Math.floor(y) * width + Math.floor(x)) * 4;
    var c = {
      r: pixels[base + 0],
      g: pixels[base + 1],
      b: pixels[base + 2],
      a: pixels[base + 3]
    };

    return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
  };

  // This calls the setter we've defined above, so it also calls
  // the createBitmap function.
  // this.message = message;
  // this.fontSize = fontSize;
  // this.fontStyle = fontStyle;

  that.createBitmap();

  // Set g.font to the same font as the bitmap canvas, incase we
  // want to draw some outlines.
  s.font = g.font = "800 " + fontSize + "px " + fontStyle;

  var loop = function() {

    requestAnimationFrame(loop);

    // Don't render if we don't see it.
    // Would be cleaner if I dynamically acquired the top of the canvas.
    if (document.body.scrollTop < height + 20) {
      that.render();
    }

  }

  // This calls the render function every 30 milliseconds.
  loop();

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    // Size of particle
    this.r = 0;

    // This velocity is used by the explode function.
    this.vx = 0;
    this.vy = 0;

    // Called every frame
    this.render = function () {

      // What color is the pixel we're sitting on top of?
      var c = getColor(this.x, this.y);

      // Where should we move?
      var angle = noise(this.x / noiseScale, this.y / noiseScale) * that.noiseStrength;

      // Are we within the boundaries of the image?
      var onScreen = this.x > rect.x && this.x < rect.x + rect.width &&
          this.y > rect.y && this.y < rect.y + rect.height;

      var isBlack = c != "rgb(255,255,255)" && onScreen;

      // If we're on top of a black pixel, grow.
      // If not, shrink.
      if (isBlack) {
        this.r += that.growthSpeed;
      } else {
        this.r -= that.growthSpeed;
      }

      // This velocity is used by the explode function.
      this.vx *= 0.5;
      this.vy *= 0.5;

      // Change our position based on the flow field and our
      // explode velocity.
      this.x += Math.cos(angle) * that.speed + this.vx;
      this.y += -Math.sin(angle) * that.speed + this.vy;

      this.r = constrain(this.r, 0, that.maxSize);

      // If we're tiny, keep moving around until we find a black
      // pixel.
      if (this.r <= 0) {
        this.x = rect.x + Math.random() * rect.width;
        this.y = rect.y + Math.random() * rect.height;
        return; // Don't draw!
      }

      // Draw the circle.
      g.beginPath();
      g.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      g.fill();
    }
  }

  function constrain(v, o1, o2) {
    if (v < o1) v = o1;
    else if (v > o2) v = o2;
    return v;
  }

  function getRectFromPoints(points) {
    var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = 0, maxY = 0;
    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      if (point[0] < minX) {
        minX = point[0];
      }
      if (point[0] > maxX) {
        maxX = point[0];
      }

      if (point[1] < minY) {
        minY = point[1];
      }
      if (point[1] > maxY) {
        maxY = point[1];
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}
