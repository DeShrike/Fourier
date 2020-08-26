// Fourier Transform Drawing With Complex Numbers

const IDLE = -1;
const USER = 1;
const FOURIER = 2;

let x = [];
let fourierX;

let time = 0;
let path = [];

let drawing = [];
let state = IDLE;

let prevmouseX = 0;
let prevmouseY = 0;

class Complex
{
	constructor(a, b)
	{
		this.re = a;
		this.im = b;
	}

	mult(other)
	{
		let re = this.re * other.re - this.im * other.im;
		let im = this.re * other.im + this.im * other.re;
		return new Complex(re, im);
	}

	div(value)
	{
		if (typeof value === "number")
		{
			let re = this.re / value;
			let im = this.im / value;
			return new Complex(re, im);
		}
		else
		{
			alert("Not implemented");
		}
	}

	add(other)
	{
		let re = this.re + other.re;
		let im = this.im + other.im;
		return new Complex(re, im);
	}

	magnitude()
	{
		return sqrt(this.re * this.re + this.im * this.im);
	}

	angle()
	{
		return atan2(this.im, this.re);
	}
}

function dft_complex(x)
{
	// Calculate Discrete Fourier Transform
	// using an array of complex numbers as input

	let X = [];
	const N = x.length;
	for (let k = 0; k < N; k++)
	{
		let sum = new Complex(0, 0);
		for (let n = 0; n < N; n++)
		{
			let phi = TWO_PI * k * n / N;
			let c = new Complex(cos(phi), -sin(phi));
			sum = sum.add( x[n].mult(c) );
		}

		sum = sum.div(N);

		let freq = k;
		let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
		//let amp = sum.magnitude();
		let phase = atan2(sum.im, sum.re); 
		//let phase = sum.angle(); 

		X[k] = { 
			re: sum.re, 
			im: sum.im,
			freq,
			amp,
			phase,
		};
	}

	return X;
}

function epicycles(x, y, rotation, fourier)
{
	let cycles = fourier.length;

	for (let i = 0; i < cycles; i++)
	{
		let prevx = x;
		let prevy = y;

		let freq = fourier[i].freq;
		let radius = fourier[i].amp;
		let phase = fourier[i].phase;

		if (radius < 5)
		{
			continue;
		}

		x += radius * cos(freq * time + phase + rotation);
		y += radius * sin(freq * time + phase + rotation);

		stroke(255, 100);
		ellipse(prevx, prevy, radius * 2);

		stroke(255);
-		line(prevx, prevy, x, y);
		// ellipse(x, y, 8);
	}

	return createVector(x, y);
}

function mousePressed()
{
	state = USER;
	drawing = [];
	x = [];
	time = 0;
	path = [];
}

function mouseReleased()
{
	state = FOURIER;

	for (let i = 0; i < drawing.length; i++)
	{
		const c = new Complex(drawing[i].x, drawing[i].y);
		x.push(c);
	}

	fourierX = dft_complex(x); 
	fourierX.sort((a, b) => b.amp - a.amp);
}

function setup()
{
	createCanvas(800, 500);
}

function draw()
{
	background(0);
	noFill();

	if (state == USER)
	{
		let mx = mouseX - width / 2;
		let my = mouseY - height / 2;
		if (mx != prevmouseX || my != prevmouseY)
		{
			let point = createVector(mx, my);
			drawing.push(point);
		}

		stroke(250);
		noFill();
		beginShape();
		for (let v of drawing)
		{
			vertex(v.x + width / 2, v.y + height / 2);
		}
		endShape();

		prevmouseX = mx;
		prevmouseY = my;
	}
	else if (state == FOURIER)
	{
		let v = epicycles(width / 2, height / 2, 0 , fourierX);
		path.unshift(v);

		stroke(255);
		beginShape();
		for (let i = 0; i < path.length; i++)
		{
			vertex(path[i].x, path[i].y);
		}
		endShape();

		let dt = TWO_PI / fourierX.length;
		time += dt;

		if (time >= TWO_PI - 0.1)
		{
			path.pop();
		}
	}
}
