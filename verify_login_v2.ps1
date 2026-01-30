$ErrorActionPreference = "Continue"

Write-Host "Testing login for mohamed200031921@gmail.com..."
$body = @{
    email = "mohamed200031921@gmail.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/account/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "STATUS: $($response.StatusCode)"
    Write-Host "CONTENT: $($response.Content)"
} catch {
    Write-Host "REQUEST FAILED"
    Write-Host "STATUS: $($_.Exception.Response.StatusCode)"
    
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "ERROR BODY: $($reader.ReadToEnd())"
    }
}
