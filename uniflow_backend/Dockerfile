# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS publish
WORKDIR /src

# Копіюємо файли проектів для відновлення залежностей
COPY ["uniflow_backend/uniflow_backend.csproj", "uniflow_backend/"]
COPY ["DataAccess/DataAccess.csproj", "DataAccess/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["DTOs/DTOs.csproj", "DTOs/"]
COPY ["Hubs/Hubs.csproj", "Hubs/"]
COPY ["Services/Services.csproj", "Services/"]

# Відновлюємо залежності
RUN dotnet restore "uniflow_backend/uniflow_backend.csproj"

# Копіюємо весь вихідний код
COPY . .

# Публікуємо додаток
WORKDIR "/src/uniflow_backend"
RUN dotnet publish "uniflow_backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Railway та інші PaaS передають порт через змінну PORT
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

ENTRYPOINT ["dotnet", "uniflow_backend.dll"]
