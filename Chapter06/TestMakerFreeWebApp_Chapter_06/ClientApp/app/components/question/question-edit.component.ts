import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "question-edit",
    templateUrl: './question-edit.component.html',
    styleUrls: ['./question-edit.component.css']
})

export class QuestionEditComponent {
    title: string;
    question: Question;

    // this will be TRUE when editing an existing question, 
    //   FALSE when creating a new one.
    editMode: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {

        // create an empty object from the Quiz interface
        this.question = <Question>{};

        var id = +this.activatedRoute.snapshot.params["id"];

        // check if we're in edit mode or not
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        if (this.editMode) {

            // fetch the question from the server
            var url = this.baseUrl + "api/question/" + id;
            this.http.get<Question>(url).subscribe(result => {
                this.question = result;
                this.title = "Edit - " + this.question.Text;
            }, error => console.error(error));
        }
        else {
            this.question.QuizId = id;
            this.title = "Create a new Question";
        }
    }

    onSubmit(question: Question) {
        var url = this.baseUrl + "api/question";

        if (this.editMode) {
            this.http
                .post<Question>(url, question)
                .subscribe(res => {
                    var v = res;
                    console.log("Question " + v.Id + " has been updated.");
                    this.router.navigate(["quiz/edit", v.QuizId]);
                }, error => console.log(error));
        }
        else {
            this.http
                .put<Question>(url, question)
                .subscribe(res => {
                    var v = res;
                    console.log("Question " + v.Id + " has been created.");
                    this.router.navigate(["quiz/edit", v.QuizId]);
                }, error => console.log(error));
        }
    }

    onBack() {
        this.router.navigate(["quiz/edit", this.question.QuizId]);
    }
}
