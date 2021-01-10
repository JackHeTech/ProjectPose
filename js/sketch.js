class PostureNN {
  video;
  poseNet;
  canvas;
  poses = [];
  nn;

  constructor(createCanvas, createCapture) {
    this.nn = window.ml5.neuralNetwork({
      task: "classification",
      debug: true,
    });

    this.canvas = createCanvas(640, 480);
    this.video = createCapture(VIDEO);
    this.video.size(width, height);

    // Create a new poseNet method with a single detection
    this.poseNet = ml5.poseNet(this.video, this.poseNetReady);

    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    this.poseNet.on("pose", (results) => {
      this.poses = results;
    });

    // Hide the video element, and just show the canvas
    this.video.hide();
    // this.canvas.hide();
  }

  /**
   * EVENT: Triggered when PoseNet is ready
   */
  poseNetReady() {
    // $("#status").html("Model Loaded");
  }

  /**
   * Add data to the NN training set
   * @param {Array<object>} poses pose to be added to the dataset
   * @param {boolean} isGoodPosture whether the posture was good
   */
  addPostureToData(poses, isGoodPosture) {
    if (!poses) return;
    this.nn.addData(this.getInputs(), {
      isGoodPosture: isGoodPosture ? "GOOD" : "BAD",
    });
  }

  /**
   * Add the current posture to the data set as good
   */
  goodPosture() {
    this.addPostureToData(this.poses, 1);
  }

  /**
   * Add the current posture to the data set as bad
   */
  badPosture() {
    this.addPostureToData(this.poses, 0);
  }

  /**
   * Train the model with the given data
   */
  trainModel() {
    this.nn.normalizeData();
    this.nn.train(
      {
        epochs: 25,
      },
      () => this.finishedTraining()
    );
  }

  /**
   * EVENT
   * Executed when the training of the model is complete
   */
  finishedTraining() {
    this.classify();
  }

  /**
   * Get current classification
   */
  classifyRightNow() {
    return new Promise((resolve, reject) => {
      if (this.poses.length > 0) {
        let inputs = getInputs();
        this.nn.classify(inputs, (error, results) => {
          if (error != undefined) {
            reject(error);
            return;
          }
          resolve(results[0].label);
        });
      }
    });
  }

  /**
   * Classify the given inputs and
   */
  classify() {
    if (this.poses.length > 0) {
      let inputs = this.getInputs();
      this.nn.classify(inputs, (err, res) => {
        this.gotResults(err, res);
      });
    }
  }

  /**
   * EVENT: Triggered after the NN classifies something
   * Logs the output of confidence to the GUI
   */
  gotResults(error, results) {
    console.log(error);
    //  Log output
    document.getElementById("result").innerHTML = `${results[0].label} (${floor(
      results[0].confidence * 100
    )})%`;
    // Classify again
    this.classify();
  }

  /**
   * Gets all points from PoseNet
   * @param {any} poses
   * @returns inputs
   */
  getInputs() {
    let keypoints = this.poses[0].pose.keypoints;
    let inputs = [];
    for (let i = 0; i < keypoints.length; i++) {
      inputs.push(keypoints[i].position.x);
      inputs.push(keypoints[i].position.y);
    }
    return inputs;
  }

  /**
   * ???
   * Draws onto the canvas
   */
  draw() {
    image(this.video, 0, 0, width, height);

    // We can call both s to draw all keypoints and the skeletons
    this.drawKeypoints();
    this.drawSkeleton();
  }

  // A  to draw ellipses over the detected keypoints
  drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < this.poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = this.poses[i].pose;
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

  // A  to draw the skeletons
  drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < this.poses.length; i++) {
      let skeleton = this.poses[i].skeleton;
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

  /**
   * Load data from given URL
   */
  loadData() {
    this.nn.loadData("./data.json");
  }

  /**
   * Remove data from given url
   */
  saveData() {
    this.nn.saveData("data");
  }
}

let posturenn;

function setup() {
  posturenn = new PostureNN(createCanvas, createCapture);
}

function draw() {
  posturenn.draw();
}
