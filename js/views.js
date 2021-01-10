/**
 * @author its ya boi Devam Sisodraker
 */

class ViewsService {

    views;

    constructor() {
        this.views = [
            $(" #testPage "),
            $(" #homePage "),
            $(" #calibrationPage "),
            $(" #exercisePage "),
            $(" #frontPage ")
        ];
    }

    /**
     * Hide all views from sight (including the canvas)
     */
    hideAllViews() {
        for (let i = 0; i < this.views.length; i++) {
            const view = this.views[i];
            view.hide();
        }
    }

    /**
     * Show view
     */
    showView(title) {
        this.hideAllViews();
        $(`#${title}`).show();
    }

    /**
     * Hide the canvas from sight
     */
    hideCanvas() {
        $(" canvas ").hide();
    }

    /**
     * Put the canvas in sight
     */
    showCanvas() {
        $(" canvas ").show();
    }
}