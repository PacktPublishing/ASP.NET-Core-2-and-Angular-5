import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "quiz-edit",
    templateUrl: './quiz-edit.component.html',
    styleUrls: ['./quiz-edit.component.css']
})

export class QuizEditComponent {
    title: string;
    quiz: Quiz;

    // this will be TRUE when editing an existing quiz, 
    //   FALSE when creating a new one.
    editMode: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {

        // create an empty object from the Quiz interface
        this.quiz = <Quiz>{};

        var id = +this.activatedRoute.snapshot.params["id"];
        if (id) {
            this.editMode = true;

            // fetch the quiz from the server
            var url = this.baseUrl + "api/quiz/" + id;
            this.http.get<Quiz>(url).subscribe(result => {
                this.quiz = result;
                this.title = "Edit - " + this.quiz.Title;
            }, error => console.error(error));
        }
        else {
            this.editMode = false;
            this.title = "Create a new Quiz";
        }
    }

    onSubmit(quiz: Quiz) {
        var url = this.baseUrl + "api/quiz";

        if (this.editMode) {
            this.http
                .post<Quiz>(url, quiz)
                .subscribe(result => {
                    var v = result;
                    console.log("Quiz " + v.Id + " has been updated.");
                    this.router.navigate(["home"]);
                }, error => console.log(error));
        }
        else {
            this.http
                .put<Quiz>(url, quiz)
                .subscribe(result => {
                    var v = result;
                    console.log("Quiz " + v.Id + " has been created.");
                    this.router.navigate(["home"]);
                }, error => console.log(error));
        }
    }

    onBack() {
        this.router.navigate(["home"]);
    }
}

