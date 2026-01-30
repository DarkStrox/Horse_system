using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class Owner
    {
        [Key, ForeignKey("User")]
        public int OwnerId { get; set; }

        public string? Preferences { get; set; } // Map to JSONB in DbContext
        public DateTime Since { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
        public virtual ICollection<HorseProfile> Horses { get; set; } = new List<HorseProfile>();
    }
}
