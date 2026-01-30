$ErrorActionPreference = "Stop"

try {
    Write-Host "Testing login for mohamed200031921@gmail.com..."
    $body = @{
        email = "mohamed200031921@gmail.com"
        password = "Password123!"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/account/login" -Method Post -Body $body -ContentType "application/json"
        Write-Host "LOGIN SUCCESSFUL!"
        Write-Host "Token received (truncated): $($loginResponse.token.Substring(0, 20))..."
    } catch {
        Write-Host "Login Failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response: $($reader.ReadToEnd())"
        }
    }
} catch {
    Write-Error $_
}
