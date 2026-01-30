using System;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class HorseTrainingEnrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        [Required, MaxLength(50)]
        public string MicrochipId { get; set; } = string.Empty;
        public virtual HorseProfile Horse { get; set; } = null!;

        public int ProgramId { get; set; }
        public virtual TrainingProgramme Program { get; set; } = null!;

        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
        public int? PerformanceScore { get; set; }
        public string? Notes { get; set; }
    }
}
