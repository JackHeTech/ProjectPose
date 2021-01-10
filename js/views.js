/**
 * @author its ya boi Devam Sisodraker
 */

class ViewsService {

    views;

    constructor() {
        views = [
            $(" #testPage "),
            $(" #homePage "),
            $(" #calibrationPage "),
            $(" #exercisePage ")
        ];
    }

    /**
     * Hide all views from sight (including the canvas)
     */
    hideAllViews() {
        this.views.forEach(view => {
            view.hide();
        });
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