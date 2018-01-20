
const color = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
const kappa = 0.5522847498;

export const clear = (context) => () => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const alpha = (context) => (alpha) => {
  context.globalAlpha = alpha;
};

export const fill = (context) => (...args) => {
  context.fillStyle = color(...args);
};

export const strokeWeight = (context) => (width) => {
  context.lineWidth = Math.max(width, 0.0001);
};

export const stroke = (context) => (...args) => {
  context.strokeStyle = color(...args);
};

export const drawEllipse = (context) => (posX, posY, width, height) => {
  const x = posX - width * 0.5;
  const y = posY - height * 0.5;
  const ox = (width / 2) * kappa;
  const oy = (height / 2) * kappa;
  const xe = x + width;
  const ye = y + height;
  const xm = x + width / 2;
  const ym = y + height / 2;
  context.beginPath();
  context.moveTo(x, ym);
  context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  context.closePath();
  context.fill();
  context.stroke();
};
