import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "answer-edit",
    templateUrl: './answer-edit.component.html',
    styleUrls: ['./answer-edit.component.css']
})

export class AnswerEditComponent {
    title: string;
    answer: Answer;

    // this will be TRUE when editing an existing question, 
    //   FALSE when creating a new one.
    editMode: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {

        // create an empty object from the Quiz interface
        this.answer = <Answer>{};

        var id = +this.activatedRoute.snapshot.params["id"];

        // quick & dirty way to check if we're in edit mode or not
        this.editMode = (this.activatedRoute.snapshot.url[1].path == "edit");

        if (this.editMode) {

            // fetch the answer from the server
            var url = this.baseUrl + "api/answer/" + id;
            this.http.get<Answer>(url).subscribe(result => {
                this.answer = result;
                this.title = "Edit - " + this.answer.Text;
            }, error => console.error(error));
        }
        else {
            this.answer.QuestionId = id;
            this.title = "Create a new Answer";
        }
    }

    onSubmit(answer: Answer) {
        var url = this.baseUrl + "api/answer";

        if (this.editMode) {
            this.http
                .post<Answer>(url, answer)
                .subscribe(res => {
                    var v = res;
                    console.log("Answer " + v.Id + " has been updated.");
                    this.router.navigate(["question/edit", v.QuestionId]);
                }, error => console.log(error));
        }
        else {
            this.http
                .put<Answer>(url, answer)
                .subscribe(res => {
                    var v = res;
                    console.log("Answer " + v.Id + " has been created.");
                    this.router.navigate(["question/edit", v.QuestionId]);
                }, error => console.log(error));
        }
    }

    onBack() {
        this.router.navigate(["question/edit", this.answer.QuestionId]);
    }
}

