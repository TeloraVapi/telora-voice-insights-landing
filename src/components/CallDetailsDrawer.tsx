import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  Download,
  Copy,
  Check,
  FileText,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Call } from "@/services/callsApi";
import { audioApi } from "@/services/audioApi";

interface CallDetailsDrawerProps {
  call: Call | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "transcript" | "summary" | "audio";
}

type TabType = "transcript" | "summary" | "audio";

const CallDetailsDrawer: React.FC<CallDetailsDrawerProps> = ({
  call,
  isOpen,
  onClose,
  initialTab = "transcript",
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes in seconds
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);

  // Reset active tab when drawer opens with new call
  React.useEffect(() => {
    if (isOpen && call) {
      setActiveTab(initialTab);
    }
  }, [isOpen, call, initialTab]);

  // Fetch audio URL from backend when call changes
  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (!call) {
        return;
      }

      // Reset states
      setAudioLoading(false);
      setAudioError(null);
      setAudioUrl(null);

      // If no audio URL is available, don't try to fetch anything
      if (!call.audioUrl) {
        setAudioError("No audio recording available for this call");
        return;
      }

      // Try to get audio URL from backend
      setAudioLoading(true);

      try {
        const callId = call.id;
        const fetchedAudioUrl = await audioApi.getAudioUrl(callId);
        setAudioUrl(fetchedAudioUrl);

        try {
          // Create audio element
          const audio = new Audio(fetchedAudioUrl);
          audio.addEventListener("loadedmetadata", () => {
            setDuration(Math.floor(audio.duration));
          });
          audio.addEventListener("timeupdate", () => {
            setCurrentTime(Math.floor(audio.currentTime));
          });
          audio.addEventListener("ended", () => {
            setIsPlaying(false);
            setCurrentTime(0);
          });
          audio.addEventListener("error", () => {
            setAudioError("Failed to load audio file");
          });
          setAudioElement(audio);
        } catch (audioError) {
          setAudioError("Failed to create audio player");
        }
      } catch (error) {
        console.error("Failed to get audio URL:", error);

        // Determine error message based on the error type
        let errorMessage = "Failed to load audio";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        setAudioError(errorMessage);

        // Fallback to original URL if available
        if (call.audioUrl) {
          setAudioUrl(call.audioUrl);
          setAudioError(null); // Clear error since we have a fallback

          try {
            // Create audio element for fallback URL
            const audio = new Audio(call.audioUrl);
            audio.addEventListener("loadedmetadata", () => {
              setDuration(Math.floor(audio.duration));
            });
            audio.addEventListener("timeupdate", () => {
              setCurrentTime(Math.floor(audio.currentTime));
            });
            audio.addEventListener("ended", () => {
              setIsPlaying(false);
              setCurrentTime(0);
            });
            audio.addEventListener("error", () => {
              setAudioError("Failed to load audio file");
            });
            setAudioElement(audio);
          } catch (audioError) {
            setAudioError("Failed to create audio player");
          }
        }
      } finally {
        setAudioLoading(false);
      }
    };

    fetchAudioUrl();
  }, [call]);

  // Cleanup audio element when component unmounts or call changes
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
        setAudioElement(null);
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
  }, [audioElement]);

  if (!call) return null;

  const handlePlayPause = () => {
    if (!audioElement) {
      return;
    }

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play().catch(() => {
        setAudioError("Failed to play audio");
      });
      setIsPlaying(true);
    }
  };

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(call.transcript);
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    } catch (err) {
      console.error("Failed to copy transcript:", err);
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(call.summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (err) {
      console.error("Failed to copy summary:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioElement) {
      audioElement.playbackRate = speed;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled":
        return "bg-violet-100 text-violet-800 border-violet-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderTranscriptAsChat = (transcript: string) => {
    if (!transcript || transcript === "No transcript available") {
      return (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No transcript available</p>
        </div>
      );
    }

    // Split transcript into conversation parts
    // This assumes the transcript has some structure like "Speaker: message" or similar
    const lines = transcript.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          // Try to detect if it's a speaker line (contains ":" and starts with a name/role)
          const speakerMatch = trimmedLine.match(/^([^:]+):\s*(.+)$/);

          if (speakerMatch) {
            const [, speaker, message] = speakerMatch;
            const isAssistant =
              speaker.toLowerCase().includes("assistant") ||
              speaker.toLowerCase().includes("bot") ||
              speaker.toLowerCase().includes("ai");

            return (
              <div
                key={index}
                className={`flex ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isAssistant
                      ? "bg-white border border-gray-200 text-gray-800"
                      : "bg-violet-500 text-white"
                  }`}
                >
                  <div
                    className={`text-xs font-medium mb-1 ${
                      isAssistant ? "text-gray-500" : "text-violet-100"
                    }`}
                  >
                    {speaker}
                  </div>
                  <div className="text-sm leading-relaxed">{message}</div>
                </div>
              </div>
            );
          } else {
            // If no speaker detected, treat as a general message
            return (
              <div key={index} className="flex justify-center">
                <div className="max-w-[90%] bg-gray-100 rounded-xl px-4 py-2 text-sm text-gray-600 text-center">
                  {trimmedLine}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const tabs = [
    {
      id: "transcript" as TabType,
      label: "Transcript",
      icon: FileText,
    },
    {
      id: "summary" as TabType,
      label: "Summary",
      icon: MessageSquare,
    },
    {
      id: "audio" as TabType,
      label: "Audio",
      icon: Headphones,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "transcript":
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Call Transcript
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTranscript}
                className="text-gray-600 hover:text-gray-900"
              >
                {copiedTranscript ? (
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copiedTranscript ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-[calc(100vh-400px)] overflow-y-auto">
              {renderTranscriptAsChat(call.transcript)}
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Summary</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                className="text-gray-600 hover:text-gray-900"
              >
                {copiedSummary ? (
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copiedSummary ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {call.summary}
              </p>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Audio Recording
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Audio Player */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {audioLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading audio...</p>
                  </div>
                </div>
              ) : audioError ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-amber-500 mb-2">⚠️</div>
                    <p className="text-amber-600 text-sm font-medium mb-2">
                      {audioError}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Audio recording may not be available for this call
                    </p>
                  </div>
                </div>
              ) : !audioUrl ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Headphones className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No audio available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Waveform Visualization (Mock) */}
                  <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                    <div className="flex items-end space-x-1 h-16">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            i < (currentTime / duration) * 50
                              ? "bg-gradient-to-t from-violet-500 to-purple-600"
                              : "bg-gray-300"
                          }`}
                          style={{
                            height: `${Math.random() * 60 + 10}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handlePlayPause}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div
                        className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                        onClick={(e) => {
                          if (audioElement && duration > 0) {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const percentage = clickX / rect.width;
                            const newTime = percentage * duration;
                            audioElement.currentTime = newTime;
                            setCurrentTime(Math.floor(newTime));
                          }
                        }}
                      >
                        <div
                          className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              duration > 0 ? (currentTime / duration) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-gray-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) =>
                          handleVolumeChange(parseFloat(e.target.value))
                        }
                        className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                            volume * 100
                          }%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Playback Speed */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Speed:</span>
                      <div className="flex space-x-1">
                        {[
                          { label: "0.5x", value: 0.5 },
                          { label: "1x", value: 1 },
                          { label: "1.25x", value: 1.25 },
                          { label: "1.5x", value: 1.5 },
                          { label: "2x", value: 2 },
                        ].map((speed) => (
                          <button
                            key={speed.label}
                            onClick={() => handleSpeedChange(speed.value)}
                            className={`px-2 py-1 text-xs rounded-md transition-colors ${
                              playbackSpeed === speed.value
                                ? "bg-violet-100 text-violet-700"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {speed.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {call.duration || "N/A"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[700px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Call Details
              </h2>
              <p className="text-sm text-gray-600">
                {call.customerName} • {call.productName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-white/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Call Info Summary */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Order ID
                </label>
                <p className="font-medium text-violet-600 mt-1">
                  #{call.orderId}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Assistant
                </label>
                <p className="font-medium text-gray-900 mt-1">
                  {call.assistantName}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      call.status
                    )}`}
                  >
                    {call.status === "in_progress"
                      ? "In Progress"
                      : call.status.charAt(0).toUpperCase() +
                        call.status.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Phone
                </label>
                <p className="font-medium text-gray-900 mt-1">
                  {call.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "border-violet-500 text-violet-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
        </div>
      </div>
    </>
  );
};

export default CallDetailsDrawer;
