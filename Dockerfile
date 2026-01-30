# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["ArabianHorseSystem/ArabianHorseSystem.csproj", "ArabianHorseSystem/"]
RUN dotnet restore "ArabianHorseSystem/ArabianHorseSystem.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/ArabianHorseSystem"
RUN dotnet build "ArabianHorseSystem.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "ArabianHorseSystem.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "ArabianHorseSystem.dll"]
