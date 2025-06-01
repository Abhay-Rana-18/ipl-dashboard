"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teamData } from "@/lib/team-data";
import type { Match } from "@/lib/supabase";

interface TeamWinsMapProps {
  matches: Match[];
}

export function TeamWinsMap({ matches }: TeamWinsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string>("All");
  const [seasons, setSeasons] = useState<string[]>([]);

  // Extract seasons from matches
  useEffect(() => {
    if (matches && matches.length > 0) {
      const uniqueSeasons = Array.from(
        new Set(matches.map((match) => match.season))
      )
        .filter(Boolean)
        .sort((a, b) => String(b).localeCompare(String(a)));
      setSeasons(uniqueSeasons);
    }
  }, [matches]);

  // Filter matches by selected season
  const filteredMatches =
    selectedSeason === "All"
      ? matches
      : matches.filter((match) => match.season === selectedSeason);

  // Calculate wins per team from filtered matches
  const teamWins = filteredMatches.reduce((acc, match) => {
    if (match.winner && match.winner !== "No Result") {
      acc[match.winner] = (acc[match.winner] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const loadMapbox = async () => {
      if (typeof window !== "undefined" && !(window as any).mapboxgl) {
        // Load Mapbox CSS
        const link = document.createElement("link");
        link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        // Load Mapbox JS
        const script = document.createElement("script");
        script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
        script.onload = () => {
          setMapboxLoaded(true);
        };
        document.head.appendChild(script);
      } else if ((window as any).mapboxgl) {
        setMapboxLoaded(true);
      }
    };

    loadMapbox();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !mapboxLoaded) return;

    const MAPBOX_TOKEN =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN";

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "YOUR_MAPBOX_ACCESS_TOKEN") {
      // Fallback display when no Mapbox token
      const fallbackHTML = `
        <div class="flex items-center justify-center h-full bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm max-w-md w-full text-center border">
            <div class="text-3xl sm:text-4xl mb-3 sm:mb-4">🗺️</div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Map Setup Required</h3>
            <div class="text-xs sm:text-sm text-gray-600 space-y-2">
              <p>To display the interactive map:</p>
              <ol class="text-left list-decimal list-inside space-y-1">
                <li>Get a Mapbox token from <a href="https://account.mapbox.com/" target="_blank" class="text-blue-600 hover:underline">mapbox.com</a></li>
                <li>Add it to your environment variables</li>
                <li>Or replace the token in the code</li>
              </ol>
            </div>
            <div class="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded border">
              <p class="text-xs text-gray-500">
                Teams: ${teamData
                  ?.slice(0, 5)
                  .map((t) => t.shortName)
                  .join(", ")}...
              </p>
            </div>
          </div>
        </div>
      `;
      mapContainerRef.current.innerHTML = fallbackHTML;
      setLoading(false);
      return;
    }
    (window as any).mapboxgl.accessToken = MAPBOX_TOKEN;

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    try {
      const map = new (window as any).mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [77.5946, 20.9648], // Center of India
        zoom:
          window.innerWidth < 640 ? 3.5 : window.innerWidth < 1024 ? 4 : 4.5,
      });

      // Add navigation controls
      map.addControl(
        new (window as any).mapboxgl.NavigationControl(),
        "top-right"
      );

      mapRef.current = map;

      map.on("load", () => {
        setLoading(false);
      });

      map.on("error", (e: any) => {
        console.log("Map error:", e);
        setError(
          "Failed to load map. Please check your Mapbox token and internet connection."
        );
        setLoading(false);
      });
    } catch (err) {
      console.log("Error initializing map:", err);
      setError("Failed to initialize map");
      setLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mapboxLoaded]);

  useEffect(() => {
    if (!mapRef.current || !teamData.length || !mapboxLoaded || loading) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each team
    teamData.forEach((team) => {
      if (
        typeof team.longitude !== "number" ||
        typeof team.latitude !== "number"
      ) {
        return;
      }

      const wins = teamWins[team.name] || 0;
      const maxWins = Math.max(...Object.values(teamWins), 1);
      const baseSize =
        window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 25 : 30;
      let size = Math.max(baseSize * 0.7, (wins / maxWins) * baseSize);

      if (wins === 0) {
        return; 
      }

      // Create marker element
      const el = document.createElement("div");
      el.className = "team-marker";
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background-color: ${team.color || "#3b82f6"};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(8, size / 3)}px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
      `;
      el.textContent = wins.toString();


      // Create popup
      const popup = new (window as any).mapboxgl.Popup({
        offset: size / 2 + 5,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div class="p-2 sm:p-3">
          <h3 class="font-semibold text-sm sm:text-base text-gray-900">${
            team.name
          }</h3>
          <p class="text-xs sm:text-sm text-gray-600 mt-1">${
            team.homeGround || "Home Ground"
          }</p>
          <p class="text-xs sm:text-sm mt-1"><strong>Wins: ${wins}</strong></p>
          ${
            selectedSeason !== "All"
              ? `<p class="text-xs text-gray-500 mt-1">Season: ${selectedSeason}</p>`
              : ""
          }
        </div>
      `);

      try {
        const marker = new (window as any).mapboxgl.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat([team.longitude, team.latitude])
          .setPopup(popup)
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      } catch (err) {
        console.log(`Error adding marker for ${team.name}:`, err);
      }
    });
  }, [mapboxLoaded, teamWins, loading, selectedSeason]);

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Team Wins by Home Ground
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Interactive map showing IPL team wins at their home venues
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Season:
            </span>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px]">
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Seasons</SelectItem>
                {seasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    IPL {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg lg:text-xl">
              Team Wins by Home Ground
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Interactive map showing IPL team wins at their home venues
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-red-600 font-medium text-sm sm:text-base">
                  Map Error
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-2">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Season Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Team Wins by Home Ground
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Interactive map showing IPL team wins at their home venues
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600">
            Season:
          </span>
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px]">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Seasons</SelectItem>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  IPL {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg lg:text-xl">
            Team Wins by Home Ground
            {selectedSeason !== "All" && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - IPL {selectedSeason}
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Interactive map showing IPL team wins at their home venues. Circle
            size represents number of wins.
            {selectedSeason !== "All" &&
              ` Filtered for ${selectedSeason} season.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border"
              style={{ minHeight: "300px" }}
            />
            {(loading || (!mapboxLoaded && !error)) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2 sm:mb-4"></div>
                  <p className="text-sm sm:text-base font-medium text-gray-700">
                    Loading map...
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Legend */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">
            Team Performance Summary
            {selectedSeason !== "All" && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - IPL {selectedSeason}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {teamData?.map((team) => (
              <div
                key={team.shortName}
                className="flex items-center gap-2 p-2 sm:p-3 bg-white rounded border hover:shadow-sm transition-shadow duration-200"
              >
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: team.color || "#3b82f6" }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 block truncate">
                    {team.shortName}
                  </span>
                  <span className="text-xs text-gray-600">
                    {teamWins[team.name] || 0} wins
                  </span>
                </div>
              </div>
            ))}
          </div>
          {selectedSeason !== "All" && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded border">
              <p className="text-xs text-gray-600 text-center">
                Showing data for IPL {selectedSeason} season • Total matches:{" "}
                {filteredMatches.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
