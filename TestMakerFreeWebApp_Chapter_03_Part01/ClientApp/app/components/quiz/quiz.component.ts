import { Component, Input } from "@angular/core";

@Component({
    selector: "quiz",
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css']
})

export class QuizComponent {
    @Input("quiz") quiz: Quiz;
}
