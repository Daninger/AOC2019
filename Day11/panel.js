class Panel {
  x = 0;
  y = 0;
  degree = 0;
  colors = {};

  minx = 0;
  maxx = 0;
  miny = 0;
  maxy = 0;

  getColor() {
    let k = this.x + "," + this.y;
    if (k in this.colors) return this.colors[k];
    return 0;
  }
  getColorXY(x, y) {
    let k = x + "," + y;
    if (k in this.colors) return this.colors[k];
    return 0;
  }
  setColor(c) {
    let k = this.x + "," + this.y;
    this.colors[k] = c;
  }
  turn(dir) {
    //0 means it should turn left 90 degrees, and 1 means it should turn right 90 degrees.
    if (dir == 0) this.degree = (this.degree + 270) % 360;
    else this.degree = (this.degree + 90) % 360;
  }
  moveForward() {
    switch (this.degree) {
      case 0:
        this.y--;
        break;
      case 90:
        this.x++;
        break;
      case 180:
        this.y++;
        break;
      case 270:
        this.x--;
        break;
    }
    this.minx = Math.min(this.minx, this.x);
    this.maxx = Math.max(this.maxx, this.x);
    this.miny = Math.min(this.miny, this.y);
    this.maxy = Math.max(this.maxy, this.y);
  }
  countPanels() {
    return Object.keys(this.colors).length;
  }
  dump() {
    for (let y = this.miny; y <= this.maxy; y++) {
      let line = "";
      for (let x = this.minx; x <= this.maxx; x++) {
        line += this.getColorXY(x, y) == 0 ? "." : "#";
      }
      console.log(line);
    }
  }
}
module.exports = Panel;
