using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class EquineVet
    {
        [Key, ForeignKey("User")]
        public int VetId { get; set; }

        [Required, MaxLength(20)]
        public string Ssn { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string VeterinaryLicense { get; set; } = string.Empty;

        public int? ExperienceYears { get; set; }  

        [MaxLength(100)]
        public string? Specialization { get; set; }

        [MaxLength(200)]
        public string? PreviousWorkplace { get; set; }

        [MaxLength(500)]
        public string? HorseExperience { get; set; }

        public string? LicenseFileUrl { get; set; }
        public string? NationalIdFileUrl { get; set; }
        public string? CertificatesFileUrl { get; set; }
        public string? CountryCity { get; set; }
        public string? VetSpecialization { get; set; }
        public string? ClinicsWorkedAt { get; set; }
        public string? VetBio { get; set; }
        public bool ConfirmAccuracy { get; set; }


        public virtual User User { get; set; } = null!;
        public virtual ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
    }
}
