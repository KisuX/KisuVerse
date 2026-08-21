using System.Text.Json;
using KisuVerse.Api.Configuration;
using KisuVerse.Api.Dtos.Tmdb;
using Microsoft.Extensions.Options;

namespace KisuVerse.Api.Services;

public class TmdbService
{
    private readonly HttpClient _httpClient;
    private readonly TmdbOptions _tmdbOptions;
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public TmdbService(HttpClient httpClient, IOptions<TmdbOptions> tmdbOptions)
    {
        _httpClient = httpClient;
        _tmdbOptions = tmdbOptions.Value;
    }

    public async Task<TmdbMovieDto?> TestConnection()
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/157336?api_key={_tmdbOptions.ApiKey}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var movie = JsonSerializer.Deserialize<TmdbMovieDto>(json, _jsonOptions);

        return movie;
    }

    public async Task<TmdbSearchResponseDto?> SearchMovies(string query)
    {
        var url = $"{_tmdbOptions.BaseUrl}search/movie?api_key={_tmdbOptions.ApiKey}&query={query}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var movies = JsonSerializer.Deserialize<TmdbSearchResponseDto>(json, _jsonOptions);

        return movies;
    }

    public async Task<TmdbMovieDetailDto?> GetMovieDetails(int id)
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/{id}?api_key={_tmdbOptions.ApiKey}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var movie = JsonSerializer.Deserialize<TmdbMovieDetailDto>(json, _jsonOptions);

        return movie;
    }

    public async Task<TmdbCreditsDto?> GetMovieCredits(int id)
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/{id}/credits?api_key={_tmdbOptions.ApiKey}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var credits = JsonSerializer.Deserialize<TmdbCreditsDto>(json, _jsonOptions);

        return credits;
    }

    public async Task<TmdbVideosDto?> GetMovieVideos(int id)
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/{id}/videos?api_key={_tmdbOptions.ApiKey}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var videos = JsonSerializer.Deserialize<TmdbVideosDto>(json, _jsonOptions);

        return videos;
    }

    public async Task<TmdbPersonDetailDto?> GetPersonDetails(int tmdbId)
    {
        var url = $"{_tmdbOptions.BaseUrl}person/{tmdbId}?api_key={_tmdbOptions.ApiKey}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var person = JsonSerializer.Deserialize<TmdbPersonDetailDto>(json, _jsonOptions);

        return person;
    }
    public async Task<TmdbSearchResponseDto?> GetSimilarMovies(int tmdbId)
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/{tmdbId}/similar?api_key={_tmdbOptions.ApiKey}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var similar = JsonSerializer.Deserialize<TmdbSearchResponseDto>(json, _jsonOptions);

        return similar;
    }
    public async Task<TmdbSearchResponseDto?> GetPopularMovies(int page)
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/popular?api_key={_tmdbOptions.ApiKey}&page={page}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var movies = JsonSerializer.Deserialize<TmdbSearchResponseDto>(json, _jsonOptions);

        return movies;
    }

    public async Task<TmdbSearchResponseDto?> GetTopRatedMovies(int page)
    {
        var url = $"{_tmdbOptions.BaseUrl}movie/top_rated?api_key={_tmdbOptions.ApiKey}&page={page}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var movies = JsonSerializer.Deserialize<TmdbSearchResponseDto>(json, _jsonOptions);

        return movies;
    }

    public async Task<TmdbSearchResponseDto?> DiscoverMoviesByGenre(int genreTmdbId, int page)
    {
        var url = $"{_tmdbOptions.BaseUrl}discover/movie?api_key={_tmdbOptions.ApiKey}&with_genres={genreTmdbId}&page={page}&sort_by=popularity.desc";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var movies = JsonSerializer.Deserialize<TmdbSearchResponseDto>(json, _jsonOptions);

        return movies;
    }

}