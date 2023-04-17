let zoom = 0.5;
let drag;
let prevMouse;
let matahari;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 0);
}

function setup() {
  drag = createVector(0, 0);
  createCanvas(windowWidth, windowHeight - 0.50, WEBGL);
  matahari = new Body(58, 0, null, loadImage("Textures/sun.jpg"), color(255));
  merkurius = new Body(25, 120, matahari, loadImage("Textures/mercury.jpg"));
  bumi = new Body(29, 190, matahari, loadImage("Textures/earth.jpg"));
  mars = new Body(27, 260, matahari, loadImage("Textures/mars.jpg"));
}

function draw() {
  background("#252525");
  noStroke(500);
  ambientMaterial(255);
  ambientLight(42);
  orbitControl();
  rotateX(PI/2);
  matahari.update();
  matahari.draw();
}

function mousePressed() {
  prevMouse = createVector(mouseX, mouseY);
}


function mouseWheel(event) {
  zoom += event.delta * 0.0005;
}

function Body(radius, distance, parent, tex, emission) {
  this.radius = radius;
  this.distance = distance;
  this.orbitLength = distance * 2 * PI;
  this.angle = random(2 * PI);
  this.tex = tex;
  this.emission = emission;
  this.children = [];
  this.parent = parent;
  if (parent) {
    parent.children.push(this);
  }
}

Body.prototype.update = function() {
  if (this.orbitLength > 0) {
    let speed = pow((width - this.distance) / (width), 0.5);
    this.angle += (speed / this.orbitLength) * (2 * PI);
  }
  for (let body of this.children) {
    body.update();
  }
}

Body.prototype.draw = function() {
  push();
  {
    push();
    {
      strokeWeight(0.5);
      stroke(150);
      noFill();
      ellipse(0, 0, this.distance * 2);
    }
    pop();
    
    if (this.emission) {
      fill(this.emission);
      scale(100);
      pointLight(this.emission, drag.x, drag.y, 0);
      scale(0.01);
    }
    
    rotate(-this.angle);
    translate(this.distance, 0);
    if (this.emission) {
      ambientLight(this.emission);
    }
    ambientMaterial(255);
    texture(this.tex);
    sphere(this.radius);
    for (let body of this.children) {
      body.draw();
    }
  }
  pop();
}
