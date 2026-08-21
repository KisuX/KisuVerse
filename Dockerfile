FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY KisuVerse.Api/KisuVerse.Api.csproj KisuVerse.Api/
RUN dotnet restore KisuVerse.Api/KisuVerse.Api.csproj

COPY KisuVerse.Api/ KisuVerse.Api/
RUN dotnet publish KisuVerse.Api/KisuVerse.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_ENVIRONMENT=Production
# Disables the config-file watcher: avoids a crash on containers with a low
# inotify instance limit (common on small hosting plans), and isn't needed
# since production config comes from environment variables, not file edits.
ENV DOTNET_hostBuilder__reloadConfigOnChange=false
ENTRYPOINT ["dotnet", "KisuVerse.Api.dll"]
