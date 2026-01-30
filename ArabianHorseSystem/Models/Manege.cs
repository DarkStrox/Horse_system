using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class Manege
    {
        [Key]
        public int ManegeId { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Type { get; set; }

        [MaxLength(50)]
        public string? SurfaceType { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Active"; // Active, Closed, Maintenance

        public int Capacity { get; set; }
        public string? AvailabilitySchedule { get; set; }

        public int? LocationId { get; set; }
        public virtual Location? Location { get; set; }

        public virtual ICollection<TrainingProgramme> TrainingProgrammes { get; set; } = new List<TrainingProgramme>();
    }
}
