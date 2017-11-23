import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
    form: FormGroup;

    // this will be TRUE when editing an existing quiz, 
    //   FALSE when creating a new one.
    editMode: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        @Inject('BASE_URL') private baseUrl: string) {

        // create an empty object from the Quiz interface
        this.quiz = <Quiz>{};

        // initialize the form
        this.createForm();

        var id = +this.activatedRoute.snapshot.params["id"];
        if (id) {
            this.editMode = true;

            // fetch the quiz from the server
            var url = this.baseUrl + "api/quiz/" + id;
            this.http.get<Quiz>(url).subscribe(result => {
                this.quiz = result;
                this.title = "Edit - " + this.quiz.Title;

                // update the form with the quiz value
                this.updateForm();

            }, error => console.error(error));
        }
        else {
            this.editMode = false;
            this.title = "Create a new Quiz";
        }
    }

    createForm() {
        this.form = this.fb.group({
            Title: ['', Validators.required],
            Description: '',
            Text: ''
        });
    }

    updateForm() {
        this.form.setValue({
            Title: this.quiz.Title,
            Description: this.quiz.Description || '',
            Text: this.quiz.Text || ''
        });
    }

    onSubmit() {

        // build a temporary quiz object from form values
        var tempQuiz = <Quiz>{};
        tempQuiz.Title = this.form.value.Title;
        tempQuiz.Description = this.form.value.Description;
        tempQuiz.Text = this.form.value.Text;

        var url = this.baseUrl + "api/quiz";

        if (this.editMode) {

            // don't forget to set the tempQuiz Id,
            //   otherwise the EDIT would fail!
            tempQuiz.Id = this.quiz.Id;

            this.http
                .post<Quiz>(url, tempQuiz)
                .subscribe(res => {
                    this.quiz = res;
                    console.log("Quiz " + this.quiz.Id + " has been updated.");
                    this.router.navigate(["home"]);
                }, error => console.log(error));
        }
        else {
            this.http
                .put<Quiz>(url, tempQuiz)
                .subscribe(res => {
                    var v = res;
                    console.log("Quiz " + v.Id + " has been created.");
                    this.router.navigate(["home"]);
                }, error => console.log(error));
        }
    }

    onBack() {
        this.router.navigate(["home"]);
    }

    // retrieve a FormControl
    getFormControl(name: string) {
        return this.form.get(name);
    }

    // returns TRUE if the FormControl is valid
    isValid(name: string) {
        var e = this.getFormControl(name);
        return e && e.valid;
    }

    // returns TRUE if the FormControl has been changed
    isChanged(name: string) {
        var e = this.getFormControl(name);
        return e && (e.dirty || e.touched);
    }

    // returns TRUE if the FormControl is invalid after user changes
    hasError(name: string) {
        var e = this.getFormControl(name);
        return e && (e.dirty || e.touched) && !e.valid;
    }
}

