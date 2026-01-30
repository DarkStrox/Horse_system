using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class TrainingProgramme
    {
        [Key]
        public int ProgramId { get; set; }

        [MaxLength(150)]
        public string? NameOfProgram { get; set; }

        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal Price { get; set; }

        // Relationships
        public int? TrainerId { get; set; }
        public virtual Trainer? Trainer { get; set; }

        public int? ManegeId { get; set; }
        public virtual Manege? Manege { get; set; }

        public virtual ICollection<HorseTrainingEnrollment> Enrollments { get; set; } = new List<HorseTrainingEnrollment>();
    }
}
