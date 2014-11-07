function Logo() {
  var self = this;
  var message = '';
  var fontSize = 80;
  var fontStyle = "Arial";

  this.__defineGetter__("message", function () {
    return message;
  });
  this.__defineSetter__("message", function (m) {
    message = m;
    self.clips.forEach(function(clip) {
      clip.message = message;
    });
  });

  this.__defineGetter__("fontSize", function() {
    return fontSize;
  });
  this.__defineSetter__("fontSize", function (fs) {
    fontSize = fs;
    self.clips.forEach(function(clip) {
      clip.fontSize = fontSize;
    });
  });

  this.__defineGetter__("fontStyle", function() {
    return fontStyle;
  });
  this.__defineSetter__("fontStyle", function (fs) {
    fontStyle = fs;
    self.clips.forEach(function(clip) {
      clip.fontStyle = fontStyle;
    });
  });

  this.clips = [];
  this.message = message;
  this.fontSize = fontSize;
  this.fontStyle = fontStyle;

  this.addClip = function(clip) {
    clip.message = message;
    clip.fontSize = fontSize;
    clip.fontStyle = fontStyle;

    self.clips.push(clip);
  };
}
