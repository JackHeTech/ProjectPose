/**
 * @author its ya boi Devam Sisodraker
 */
class CheckInterval {

    /**
     * Check every 1000ms by default
     */
    checkIntervalGap = 1000;

    /**
     * Actual reference to interval object
     */
    checkInterval;

    constructor() {
        checkInterval = setInterval(() => this.onCheckInterval(), this.checkIntervalGap);
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
        this.checkInterval = value;
        this.clearCheckInterval();
        this.checkInterval = setInterval(() => this.checkInterval(), this.checkInterval);
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
                if (result == "BAD") {
                    this.displayBadPostureMessage();
                }
            })
            .catch((error) => {});
    }

    /**
     * Function which is execute when the NN detects bad posture
     */
    displayBadPostureMessage(); // stub

}

// const checkInterval = new CheckInterval();