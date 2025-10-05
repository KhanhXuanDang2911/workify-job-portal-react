import type React from "react";

import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { initialLocationOptions } from "@/components/TalentSearchSidebar/TalentSearchSidebarMockData";

interface LocationMultiSelectProps {
  selectedLocationOptions: { id: string; name: string }[];
  setSelectedLocationOptions: (selectedLocationOptions: { id: string; name: string }[]) => void;
  placeholder?: string;
  className?: string;
}

const VIETNAM_LOCATIONS = initialLocationOptions;

export function LocationMultiSelect({ selectedLocationOptions, setSelectedLocationOptions, placeholder = "Cities, provinces", className }: LocationMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilterLocations] = useState(() => {
    return VIETNAM_LOCATIONS.map((loc) => ({
      id: loc.id,
      name: loc.name,
      isSelected: selectedLocationOptions.some((s) => s.id === loc.id),
    }));
  });
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const normalized = VIETNAM_LOCATIONS.map((loc) => ({
      id: loc.id,
      name: loc.name,
      isSelected: selectedLocationOptions.some((s) => s.id === loc.id),
    }));

    const filtered = searchQuery ? normalized.filter((loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase())) : normalized;

    setFilterLocations(filtered);
  }, [selectedLocationOptions, searchQuery]);

  const handleToggleLocation = (locationId: string) => {
    const location = VIETNAM_LOCATIONS.find((loc) => loc.id === locationId);
    if (!location) return;

    const isSelected = selectedLocationOptions.some((loc) => loc.id === locationId);
    if (isSelected) {
      setSelectedLocationOptions(selectedLocationOptions.filter((loc) => loc.id !== locationId));
    } else {
      setSelectedLocationOptions([...selectedLocationOptions, location]);
    }

    setSearchQuery("");
  };

  const handleRemoveLocation = (locationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLocationOptions(selectedLocationOptions.filter((loc) => loc.id !== locationId));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLocationOptions([]);
      setSearchQuery("");
      
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input Container */}
      <div
        className={cn(
          "relative flex min-h-12 w-full items-center gap-2 rounded-md border border-input bg-white px-3 py-2 text-sm transition-colors cursor-text",
          isOpen && "border-none ring-1 ring-[#1967d2]"
        )}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* Location Icon */}
        <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" color="#1967d2" />

        {/* Selected Tags and Input */}
        <div className="flex flex-1 flex-wrap items-center gap-1.5 max-h-16 overflow-y-auto">
          {selectedLocationOptions.map((location) => (
            <Badge key={location.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-2 py-1 text-sm font-normal">
              {location.name}
              <button type="button" onClick={(e) => handleRemoveLocation(location.id, e)} className="ml-1 rounded-full hover:bg-blue-200 p-0.5 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);  
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedLocationOptions.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Clear All Button */}
        {selectedLocationOptions.length > 0 && (
          <button type="button" onClick={handleClearAll} className="flex-shrink-0 rounded-full hover:bg-gray-100 p-1 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-[300px] overflow-y-auto">
            {filteredLocations.length > 0 ? (
              <div className="py-1">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleToggleLocation(location.id)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm hover:bg-sky-100 transition-colors",
                      selectedLocationOptions.includes(location) && "bg-blue-50 text-blue-700 font-medium",location.isSelected && "bg-sky-50"
                    )}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No locations found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
