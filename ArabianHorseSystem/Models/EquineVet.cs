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

        public virtual User User { get; set; } = null!;
        public virtual ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
    }
}
