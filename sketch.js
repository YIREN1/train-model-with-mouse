// @ts-nocheck

let model;
let targetLabel = 'P';
let state = 'collection';

function setup() {
  createCanvas(400, 400);


  const options ={
    inputs: ['x', 'y'],
    outputs: ['label'],
    type: 'classification',
    // debug: 'true',
  };

  model = ml5.neuralNetwork(options);
  // model.loadData('mouse-notes.json', dataLoaded);

  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  };

  model.load(modelInfo, modelLoaded);
}

function modelLoaded() {
  console.log('model loaded');
  state = 'prediction';
}

function dataLoaded() {
  console.log(model.data);
  let data = model.data.data.raw;
  // let data = model.getData();
  for (let i = 0; i < data.length; i++) {
    let inputs = data[i].xs;
    let target = data[i].ys;
    stroke(0);
    noFill();
    ellipse(inputs.x, inputs.y, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(target.label, inputs.x, inputs.y);
  }
  state = 'training';
  console.log('starting training');
  model.normalizeData();
  let options = {
    epochs: 100
  };
  model.train(options, whileTraining, finishedTraining);
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function finishedTraining() {
  console.log('finished training.');
  state = 'prediction';
}

function keyPressed() {
  if (key == 't') {
    state = 'training';
    console.log('starting training');
    model.normalizeData();

    let options = {
      epochs: 100
    };

    model.train(options, whileTraining, finishedTraining);
  } else if (key == 's') {
    model.saveData('mouse-notes');
  } else if (key == 'm') {
    model.save();
  } else {
    targetLabel = key.toUpperCase();
  }
}

function mousePressed(){
  let inputs = {
    x: mouseX,
    y: mouseY
  };

  if (state == 'collection') {
    let target = {
      label: targetLabel
    };
    model.addData(inputs, target);
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);

    // wave.freq(notes`[targetLabel]);
    // env.play();`
  } else if (state == 'prediction') {
    model.classify([inputs], gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  stroke(0); 
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  let label = results[0].label;
  text(label, mouseX, mouseY);
  // wave.freq(notes[label]);
  // env.play();
}


