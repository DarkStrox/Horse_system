using System;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class HealthRecord
    {
        [Key]
        public int HealthId { get; set; }

        [Required]
        public string Diagnosis { get; set; } = string.Empty;

        [Required]
        public string Treatment { get; set; } = string.Empty;

        public DateTime VisitDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }

        [Required, MaxLength(50)]
        public string MicrochipId { get; set; } = string.Empty;
        public virtual HorseProfile Horse { get; set; } = null!;

        public int? VetId { get; set; }
        public virtual EquineVet? Vet { get; set; }
    }
}
