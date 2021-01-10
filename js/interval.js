/**
 * @author its ya boi Devam Sisodraker
 */
class CheckInterval {

    /**
     * Check every 1000ms by default
     */
    checkIntervalGap = 5000;

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

const checkInterval = new CheckInterval();
