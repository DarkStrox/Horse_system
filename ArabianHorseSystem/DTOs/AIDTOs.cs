namespace ArabianHorseSystem.DTOs
{
    public class BreedPredictionRequest
    {
        public double Height_cm { get; set; }
        public double Weight_kg { get; set; }
        public string? Head_Profile { get; set; } // Dished, Roman, Straight
        public string? Tail_Carriage { get; set; } // High, Low, Medium
        public string? Neck_Arch { get; set; } // High, Low, Medium
        public int Rib_Count { get; set; } // 17, 18
        public string? Back_Length { get; set; } // Short, Long
        public bool IsAdvanced { get; set; }
        public string? ImageData { get; set; } // Base64
    }

    public class BreedPredictionResponse
    {
        public string? Breed { get; set; }
        public string? BreedArabic { get; set; }
        public string? AdvancedFeedback { get; set; }
        public bool Matches { get; set; } = true;
        public string? Status { get; set; }
        public string? Error { get; set; }
    }
}
