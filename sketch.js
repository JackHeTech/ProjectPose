let video;
let poseNet;
let poses = [];

const nn = ml5.neuralNetwork({
  inputs: 34,
  outputs: 2,
  task: "classification",
  debug: true,
});

function goodPosture() {
  addPostureToData(poses, 1);
}

function badPosture() {
  addPostureToData(poses, 0);
}

// Train the model
function trainModel() {
  nn.normalizeData();
  nn.train(
    {
      epochs: 25,
    },
    finishedTraining
  );
}

// Begin prediction
function finishedTraining() {
  classify();
}

// Classify
function classify() {
  if (poses.length > 0) {
    let inputs = getInputs(poses);
    nn.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  //  Log output
  document.getElementById("result").innerHTML = `${results[0].label} (${floor(
    results[0].confidence * 100
  )})%`;
  // Classify again
  classify();
}
function getInputs(poses) {
  let keypoints = poses[0].pose.keypoints;
  let inputs = [];
  for (let i = 0; i < keypoints.length; i++) {
    inputs.push(keypoints[i].position.x);
    inputs.push(keypoints[i].position.y);
  }
  return inputs;
}

function addPostureToData(poses, isGoodPosture) {
  if (!poses) return;
  nn.addData(getInputs(poses), {
    isGoodPosture: isGoodPosture ? "GOOD" : "BAD",
  });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
