using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TestMakerFreeWebApp.ViewModels;
using System.Collections.Generic;
using System.Linq;
using TestMakerFreeWebApp.Data;
using Mapster;

namespace TestMakerFreeWebApp.Controllers
{
    public class QuestionController : BaseApiController
    {
        #region Constructor
        public QuestionController(ApplicationDbContext context)
            : base(context) { }
        #endregion

        #region RESTful conventions methods
        /// <summary>
        /// Retrieves the Question with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Question</param>
        /// <returns>the Question with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var question = DbContext.Questions.Where(i => i.Id == id)
                .FirstOrDefault();

            // handle requests asking for non-existing quizzes
            if (question == null) return NotFound(new
            {
                Error = String.Format("Question ID {0} has not been found", id)
            });

            return new JsonResult(
                question.Adapt<QuestionViewModel>(),
                JsonSettings);
        }

        /// <summary>
        /// Adds a new Question to the Database
        /// </summary>
        /// <param name="model">The QuestionViewModel containing the data to insert</param>
        [HttpPut]
        public IActionResult Put([FromBody]QuestionViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);

            // map the ViewModel to the Model
            var question = model.Adapt<Question>();

            // override those properties 
            //   that should be set from the server-side only
            question.CreatedDate = DateTime.Now;
            question.LastModifiedDate = question.CreatedDate;

            // add the new question
            DbContext.Questions.Add(question);
            // persist the changes into the Database
            DbContext.SaveChanges();

            // return the newly-created Question to the client
            return new JsonResult(question.Adapt<QuestionViewModel>()
                , JsonSettings);
        }

        /// <summary>
        /// Edit the Question with the given {id}
        /// </summary>
        /// <param name="model">The QuestionViewModel containing the data to update</param>
        [HttpPost]
        public IActionResult Post([FromBody]QuestionViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);

            // retrieve the question to edit
            var question = DbContext.Questions.Where(q => q.Id ==
                        model.Id).FirstOrDefault();

            // handle requests asking for non-existing quizzes
            if (question == null) return NotFound(new
            {
                Error = String.Format("Question ID {0} has not been found", model.Id)
            });

            // handle the update (without object-mapping)
            //   by manually assigning the properties 
            //   we want to accept from the request
            question.QuizId = model.QuizId;
            question.Text = model.Text;
            question.Notes = model.Notes;

            // properties set from server-side
            question.LastModifiedDate = question.CreatedDate;

            // persist the changes into the Database.
            DbContext.SaveChanges();

            // return the updated Quiz to the client.
            return new JsonResult(question.Adapt<QuestionViewModel>()
                , JsonSettings);
        }

        /// <summary>
        /// Deletes the Question with the given {id} from the Database
        /// </summary>
        /// <param name="id">The ID of an existing Question</param>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // retrieve the question from the Database
            var question = DbContext.Questions.Where(i => i.Id == id)
                .FirstOrDefault();

            // handle requests asking for non-existing questions
            if (question == null) return NotFound(new
            {
                Error = String.Format("Question ID {0} has not been found", id)
            });

            // remove the quiz from the DbContext.
            DbContext.Questions.Remove(question);
            // persist the changes into the Database.
            DbContext.SaveChanges();

            // return an HTTP Status 200 (OK).
            // return new OkResult();

            // [2018.01.26] BOOK ERRATA: return a NoContentResult to comply with a bug in the Angular 5 HttpRouter (fixed on December 2017, see here: https://github.com/angular/angular/issues/19502) which expects a JSON by default 
            // and will throw a SyntaxError: Unexpected end of JSON input in case of an HTTP 200 result with no content.
            // ref.: https://github.com/angular/angular/issues/19502
            // ref.: https://github.com/PacktPublishing/ASP.NET-Core-2-and-Angular-5/issues/19
            return new NoContentResult();
        }
        #endregion

        // GET api/question/all
        [HttpGet("All/{quizId}")]
        public IActionResult All(int quizId)
        {
            var questions = DbContext.Questions
                .Where(q => q.QuizId == quizId)
                .ToArray();
            return new JsonResult(
                questions.Adapt<QuestionViewModel[]>(),
                JsonSettings);
        }
    }
}
