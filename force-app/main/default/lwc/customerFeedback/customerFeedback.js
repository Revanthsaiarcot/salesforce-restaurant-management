import { LightningElement, api, track } from 'lwc';
import submitFeedback from '@salesforce/apex/CustomerController.submitFeedback';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CustomerFeedback extends LightningElement {
    @api tableId;
    @track rating = 0;
    @track comments = '';
    @track submitted = false;

    get stars() {
        let starArray = [];
        for(let i=1; i<=5; i++) {
            starArray.push({
                value: i,
                class: i <= this.rating ? 'star filled' : 'star'
            });
        }
        return starArray;
    }

    get isSubmitDisabled() {
        return this.rating === 0;
    }

    handleRating(event) {
        this.rating = parseInt(event.target.dataset.value, 10);
    }

    handleCommentChange(event) {
        this.comments = event.target.value;
    }

    handleSubmit() {
        console.log('Submitting Feedback:', { 
            tableId: this.tableId, 
            rating: this.rating, 
            comments: this.comments 
        });

        submitFeedback({ 
            tableId: this.tableId, 
            rating: this.rating, 
            comments: this.comments 
        })
        .then(() => {
            this.submitted = true;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Thanks!', message: 'Feedback received.', variant: 'success'
            }));
        })
        .catch(error => {
            console.error('Feedback Error:', error);
            // THIS WILL SHOW THE EXACT ERROR ON SCREEN
            let errorMessage = 'Unknown Error';
            if (error.body && error.body.message) {
                errorMessage = error.body.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            this.dispatchEvent(new ShowToastEvent({
                title: 'Feedback Failed', 
                message: errorMessage, // <--- READ THIS MESSAGE
                variant: 'error',
                mode: 'sticky'
            }));
        });
    }

    handleSkip() {
        this.handleReset();
    }

    handleReset() {
        window.location.reload();
    }
}