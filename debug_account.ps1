$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param($Uri, $Method="Get", $Body=$null)
    Write-Host "Testing $Uri..."
    try {
        if ($Body) {
            $response = Invoke-WebRequest -Uri $Uri -Method $Method -Body $Body -ContentType "application/json"
        } else {
            $response = Invoke-WebRequest -Uri $Uri -Method $Method
        }
        Write-Host "SUCCESS: $($response.StatusCode)"
        $response.Content
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)"
        if ($_.Exception.Response) {
             $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
             $body = $reader.ReadToEnd()
             Write-Host "ERROR BODY: $body"
        }
    }
    Write-Host "--------------------------------"
}

Test-Endpoint -Uri "http://localhost:5000/api/account/check?email=mohamed200031921@gmail.com"

$loginBody = @{
    email = "mohamed200031921@gmail.com"
    password = "Password123!"
} | ConvertTo-Json

Test-Endpoint -Uri "http://localhost:5000/api/account/login" -Method "Post" -Body $loginBody
