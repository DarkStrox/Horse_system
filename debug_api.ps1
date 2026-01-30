$ErrorActionPreference = "Stop"

try {
    Write-Host "Logging in as testadmin@gmail.com..."
    $body = @{
        email = "testadmin@gmail.com"
        password = "Password123!"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/account/login" -Method Post -Body $body -ContentType "application/json"
    } catch {
        Write-Host "Login Failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response: $($reader.ReadToEnd())"
        }
        exit 1
    }
    
    $token = $loginResponse.token
    Write-Host "Token obtained."

    Write-Host "Fetching my-horses..."
    try {
        $horses = Invoke-RestMethod -Uri "http://localhost:5000/api/horse/my-horses" -Method Get -Headers @{ Authorization = "Bearer $token" }
        Write-Host "Horses Found: $($horses.Count)"
        $horses | ConvertTo-Json -Depth 5
    } catch {
       Write-Host "Fetch Failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response: $($reader.ReadToEnd())"
        }
        exit 1
    }

} catch {
    Write-Error $_
}
