/**
 * @author its ya boi Devam Sisodraker
 */
class CheckInterval {

    /**
     * Check every 1 min by default
     */
    checkIntervalGap = 60 * 1000;

    /**
     * Actual reference to interval object
     */
    checkInterval;

    constructor() {
        this.checkInterval = window.setInterval(() => this.onCheckInterval(), this.checkIntervalGap);
    }

    /**
     * Remove the check interval
     */
    clearCheckInterval() {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
    }

    /**
     * Set the check interval
     * @param {number} value the check interval (in terms of ms)
     */
    setCheckInterval(value) {
        this.checkIntervalGap = value;
        this.clearCheckInterval();
        this.checkInterval = window.setInterval(() => this.checkInterval(), this.checkIntervalGap);
    }

    /**
     * Event run when the check interval must occur
     */
    onCheckInterval() {
        this.isGoodPosition();
    }

    /**
     * Function which determines if the posture is good
     */
    isGoodPosition() {
        posturenn.classifyRightNow()
            .then((result) => {
                console.log(result);
                if (result == "BAD") {
                    this.displayBadPostureMessage();
                }
            })
            .catch(console.error);
    }

    /**
     * Function which is execute when the NN detects bad posture
     */
    displayBadPostureMessage() {
        alert("Correct your posture! Sit up straight!");
    }

}

class ExerciseInterval {

    /**
     * Check every 30 mins by default
     */
    exerciseIntervalGap = 30 * 60 * 1000;

    /**
     * Actual reference to interval object
     */
    exerciseInterval;

    constructor() {
        this.exerciseInterval = window.setInterval(() => this.onExerciseInterval(), this.exerciseIntervalGap);
    }

    /**
     * Remove the check interval
     */
    clearExerciseInterval() {
        clearInterval(this.exerciseInterval);
        this.exerciseInterval = null;
    }

    /**
     * Set the exercise interval
     * @param {number} value the check interval (in terms of ms)
     */
    setExerciseInterval(value) {
        this.exerciseIntervalGap = value;
        this.clearExerciseInterval();
        this.exerciseInterval = window.setInterval(() => this.exerciseInterval(), this.exerciseIntervalGap);
    }

    /**
     * Event run when the check interval must occur
     */
    onExerciseInterval() {
        alert("Time to exercise!");
        // TODO: insert exercise code here
    }

}

let checkInterval = new CheckInterval();
let exerciseInterval = new ExerciseInterval();