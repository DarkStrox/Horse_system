using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class Trainer
    {
        [Key, ForeignKey("User")]
        public int TrainerId { get; set; }

        public int ExperienceYears { get; set; }
        public string? Bio { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual ICollection<TrainingProgramme> TrainingProgrammes { get; set; } = new List<TrainingProgramme>();
    }
}
