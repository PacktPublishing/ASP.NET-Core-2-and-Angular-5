using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestMakerFreeWebApp.Data
{
    public class Token
    {
        #region Constructor
        public Token()
        {

        }
        #endregion

        #region Properties
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string ClientId { get; set; }

        public int Type { get; set; }

        [Required]
        public string Value { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion

        #region Lazy-Load Properties
        /// <summary>
        /// The user related to this token
        /// </summary>
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        #endregion
    }
}
