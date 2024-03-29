class PostureNN {
  video;
  poseNet;
  canvas;
  poses = [];
  nn;
  totalEpoch = 50;
  exerciseNN;

  constructor(createCanvas, createCapture) {
    this.nn = window.ml5.neuralNetwork({
      task: "classification",
      // debug: true,
    });

    this.exerciseNN = window.ml5.neuralNetwork({
      task: "classification",
      // debug: true,
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
  addPostureToData(posture) {
    if (!this.poses) return;
    this.nn.addData(this.getInputs(), {
      posture,
    });
  }

  /**
   * Add the current posture to the data set as good
   */
  goodPosture() {
    this.addPostureToData(this.poses, "GOOD");
  }

  /**
   * Add the current posture to the data set as bad
   */
  badPosture() {
    this.addPostureToData(this.poses, "BAD");
  }

  /**
   * Train the model with the given data
   */
  trainModel() {
    this.nn.normalizeData();
    this.nn.train(
      {
        epochs: this.totalEpoch,
      },
      (epoch, loss) => this.whileTraining(epoch, loss),
      () => this.finishedTraining()
    );
  }

  whileTraining(epoch, loss) {
    document.getElementById(
      "command"
    ).innerHTML = `${epoch}/${this.totalEpoch}: loss: ${loss.loss}`;
  }

  /**
   * EVENT
   * Executed when the training of the model is complete
   */
  finishedTraining() {
    console.log("done");
    //this.classify();
  }

  /**
   * Get current classification
   */
  classifyRightNow() {
    return new Promise((resolve, reject) => {
      if (this.poses.length > 0) {
        let inputs = this.getInputs();
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
  classify(nn, containerId) {
    if (this.poses.length > 0) {
      let inputs = this.getInputs();
      nn.classify(inputs, (err, res) => {
        this.gotResults(err, res, nn, containerId);
      });
    }
  }

  /**
   * EVENT: Triggered after the NN classifies something
   * Logs the output of confidence to the GUI
   */
  gotResults(error, results, nn, containerId) {
    if (error) console.log(error);
    console.log(results);
    //  Log output
    document.getElementById(containerId).innerHTML = `${
      results[0].label
    } (${floor(results[0].confidence * 100)})%`;
    // Classify again
    this.classify(nn, containerId);
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

  loadData(nn, name) {
    nn.loadData(`${name}/data.json`);
  }

  loadNNModel(nn, name, callback) {
    nn.load(
      {
        model: `models/${name}/model.json`,
        metadata: `models/${name}/model_meta.json`,
        weights: `models/${name}/model.weights.bin`,
      },
      () => {
        // done loading
        console.log("done loading");
        if (callback) callback();
      }
    );
  }

  saveData(nn) {
    nn.saveData(`data`);
  }

  saveNNModel(nn) {
    nn.save();
  }

  saveExerciseModel() {
    this.saveNNModel(this.nn);
  }

  loadExerciseModel(name) {
    this.loadNNModel(this.nn, name, () => {
      this.classify(this.nn, "result");
    });
  }

  showMessage(containerId, message) {
    document.getElementById(containerId).innerHTML = message;
  }

  beginCalibration() {
    views.showCanvas();
    const updateMessage = (container, message) => {
      return (seconds) => {
        this.showMessage(container, `${message}${seconds}`);
      };
    };

    new Countdown(3, null, null, updateMessage("timer", ``), () => {
      new Countdown(
        5,
        null,
        null,
        updateMessage(
          "command",
          `Beginning Calibration, please sit with a good posture in `
        ),
        () => {
          new Countdown(
            5,
            20,
            () => {
              this.goodPosture();
            },
            updateMessage(
              "command",
              `Move side to side with a good posture for `
            ),
            () => {
              new Countdown(
                5,
                null,
                null,
                updateMessage(
                  "command",
                  `Get ready to sit with various bad postures (slouching, tech neck positions) in `
                ),
                () => {
                  new Countdown(
                    10,
                    10,
                    () => {
                      this.badPosture();
                    },
                    updateMessage(
                      "command",
                      `Do varying positions of bad postures (slouching, tech neck positions) for `
                    ),
                    () => {
                      this.trainModel();
                      this.showHomePage();
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  }

  showHomePage() {
    views = new ViewsService();
    views.hideAllViews();
    views.showView("homePage");
    views.hideCanvas();
  }

  showExercise() {
    this.beginSeatedTwists();
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async waitForPose() {
    while (this.poses.length == 0) {
      await this.sleep(1000);
    }
    return;
  }

  async beginSeatedTwists() {
    await this.waitForPose();
    console.log(this.poses);
    this.loadNNModel(this.exerciseNN, "seatedtwist", () => {
      this.classify(this.exerciseNN, "reps");
    });
  }
}

let posturenn;

function setup() {
  posturenn = new PostureNN(createCanvas, createCapture);
}

function draw() {
  posturenn.draw();
}
