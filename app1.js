// Fourier Series

let time = 0;
let wave = [];


let slider;

function setup()
{
	createCanvas(600, 400);
	slider = createSlider(1, 10, 1);
}

function draw()
{
	background(0);
	noFill();
	translate(150, 200);

	let scale = 75;
	let shift = 200;

	let x = 0;
	let y = 0;

	let cycles = slider.value();

	for (let i = 0; i < cycles; i++)
	{
		let prevx = x;
		let prevy = y;

		let n = i * 2 + 1;
		let radius = scale * (4 / (n * PI));

		// let n = i + 1;
		// let m = (n % 2 == 0) ? 1 : -1;
		// let radius = scale * (2 / (n * m * PI));

		x += radius * cos(n * time);
		y += radius * sin(n * time);


		stroke(255, 100);
		ellipse(prevx, prevy, radius * 2);

		stroke(255);
		line(prevx, prevy, x, y);
		// ellipse(x, y, 8);

	}
	
	wave.unshift(y);

	translate(shift, 0);
	line(x - shift, y, 0, wave[0]);

	beginShape();
	for (let i = 0; i < wave.length; i++)
	{
		vertex(i, wave[i]);
	}
	endShape();

	time += 0.05;

	if (wave.length > 300)
	{
		wave.pop();
	}
}
