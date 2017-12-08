import { Component, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "answer-list",
    templateUrl: './answer-list.component.html',
    styleUrls: ['./answer-list.component.css']
})

export class AnswerListComponent implements OnChanges {
    @Input() question: Question;
    answers: Answer[];
    title: string;

    constructor(private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string,
        private router: Router) {

        this.answers = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof changes['question'] !== "undefined") {

            // retrieve the question variable change info
            var change = changes['question'];

            // only perform the task if the value has been changed
            if (!change.isFirstChange()) {
                // execute the Http request and retrieve the result
                this.loadData();
            }
        }
    }

    loadData() {
        var url = this.baseUrl + "api/answer/All/" + this.question.Id;
        this.http.get<Answer[]>(url).subscribe(result => {
            this.answers = result;
        }, error => console.error(error));
    }

    onCreate() {
        this.router.navigate(["/answer/create", this.question.Id]);
    }

    onEdit(answer: Answer) {
        this.router.navigate(["/answer/edit", answer.Id]);
    }

    onDelete(answer: Answer) {
        if (confirm("Do you really want to delete this answer?")) {
            var url = this.baseUrl + "api/answer/" + answer.Id;
            this.http
                .delete(url)
                .subscribe(res => {
                    console.log("Answer " + answer.Id + " has been deleted.");

                    // refresh the question list
                    this.loadData();
                }, error => console.log(error));
        }
    }
}
