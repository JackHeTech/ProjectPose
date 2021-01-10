class Countdown {
  /**
   * @param  {} seconds - how long the countdown lasts in seconds
   * @param  {} frequency - rate the actionCallback gets called in hz
   * @param  {} actionCallback -
   * @param  {} updateCallback - gets called every second and has a parameter with seconds left
   * @param  {} finishedCallback - callback that gets called when countdown is completed
   */
  constructor(
    seconds,
    frequency,
    actionCallback,
    updateCallback,
    finishedCallback
  ) {
    if (frequency)
      this.checkInterval = setInterval(function () {
        actionCallback();
      }, 1000 / frequency);

    this.timer = new easytimer.Timer();
    this.timer.start({ countdown: true, startValues: { seconds } });

    updateCallback(seconds);

    this.timer.addEventListener("secondsUpdated", (e) => {
      updateCallback(this.timer.getTimeValues().seconds);
    });

    this.timer.addEventListener("targetAchieved", (e) => {
      finishedCallback();
      this.cleanup();
    });
  }

  cleanup() {
    clearInterval(this.checkInterval);
    this.checkInterval = null;
    this.timer.removeEventListener();
  }
}
