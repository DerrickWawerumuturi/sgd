import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "../components/ui/popover";
import { Command, CommandList, CommandItem } from "../components/ui/command";
import type { SpotifyTrack } from "../../types";
import { Spinner } from "./ui/shadcn-io/spinner";

const SERVER_URL = "https://sgd-1.onrender.com";

const Spotify = () => {
    const [song, setSong] = useState("");
    const [results, setResults] = useState<SpotifyTrack[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);
    const [loadingLyrics, setLoadingLyrics] = useState(false);
    const [lyrics, setLyrics] = useState<string | null>(null);
    const [grading, setGrading] = useState(false);
    const [gradeResult, setGradeResult] = useState<string[] | null>(null);
    const [skipFetch, setSkipFetch] = useState(false);

    // Debounced search function
    const fetchSongs = useCallback(
        debounce(async (query: string) => {
            if (query.length > 2) {
                try {
                    const res = await axios.get(
                        `${SERVER_URL}/search?q=${encodeURIComponent(query)}`
                    );
                    setResults(res.data.tracks.items);
                    setOpen(res.data.tracks.items.length > 0);
                } catch (error) {
                    console.error("Error fetching song:", error);
                }
            } else {
                setResults([]);
                setOpen(false);
            }
        }, 400),
        []
    );

    useEffect(() => {
        if (skipFetch) {
            setSkipFetch(false);
            return;
        }
        fetchSongs(song);
    }, [song, skipFetch, fetchSongs]);

    useEffect(() => {
        const fetchLyrics = async () => {
            if (selectedSong) {
                setLoadingLyrics(true);
                try {
                    const res = await axios.get(
                        `${SERVER_URL}/lyrics?artist=${selectedSong.artists[0].name}&title=${selectedSong.name}`
                    );
                    setLyrics(res.data.lyrics);
                } catch (error) {
                    console.error("Error fetching lyrics:", error);
                } finally {
                    setLoadingLyrics(false);
                }
            } else {
                setLyrics(null);
            }
        };

        fetchLyrics();
    }, [selectedSong]);

    const handleGrade = async () => {
        if (!lyrics) return;
        setGrading(true);
        try {
            const res = await axios.post(`${SERVER_URL}/grade`, { lyrics });
            setGradeResult(res.data.results);
        } catch (error) {
            console.error("Error grading lyrics:", error);
            setGradeResult(["Failed to grade lyrics."]);
        } finally {
            setGrading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10 space-y-4">
            {/* Search Input */}
            <Popover open={open} onOpenChange={(val) => setOpen(val && results.length > 0)}>
                <PopoverTrigger asChild>
                    <div className="relative w-[600px]">
                        <input
                            type="text"
                            value={song}
                            placeholder="Search for a song"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300"
                            onChange={(e) => setSong(e.target.value)}
                        />
                        {song && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSong("");
                                    setSelectedSong(null);
                                    setLyrics(null);
                                    setGradeResult(null);
                                    setResults([]);
                                    setOpen(false);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </PopoverTrigger>

                {/* Animated Results Dropdown */}
                <PopoverContent className="w-[500px] p-0">
                    <Command>
                        <CommandList>
                            <AnimatePresence>
                                {results.length === 0 && song.length > 2 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-2 text-gray-500 text-sm text-center"
                                    >
                                        No results
                                    </motion.p>
                                )}

                                {results.map((track) => (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CommandItem
                                            value={track.name}
                                            onSelect={() => {
                                                setSkipFetch(true);
                                                setResults([]);
                                                setOpen(false);
                                                setSelectedSong(track);
                                                setSong(track.name);
                                            }}
                                            className="cursor-pointer hover:bg-gray-100 px-2 py-2 rounded-md"
                                        >
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={track.album.images[2]?.url}
                                                    alt={track.name}
                                                    className="w-8 h-8 rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">{track.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {track.artists.map((a) => a.name).join(", ")}
                                                    </p>
                                                </div>
                                            </div>
                                        </CommandItem>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected Song Display */}
            <AnimatePresence>
                {selectedSong && (
                    <motion.div
                        key="selected-song"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-2 items-center"
                    >
                        <img
                            src={selectedSong.album.images[2]?.url}
                            alt={selectedSong.name}
                            className="w-14 h-14 rounded"
                        />
                        <div>
                            <p className="font-medium">{selectedSong.name}</p>
                            <p className="text-md text-gray-500">
                                {selectedSong.artists.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Audio */}
            {selectedSong?.preview_url && (
                <motion.audio
                    key="audio"
                    controls
                    className="mt-2 w-[600px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <source src={selectedSong.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </motion.audio>
            )}

            {/* Grade Button */}
            {!gradeResult && (
                <motion.button
                    key="grade-button"
                    className="bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600 transition disabled:bg-gray-400 hover:cursor-pointer"
                    disabled={!selectedSong || grading}
                    onClick={handleGrade}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {grading ? <Spinner className="w-4 p-4 animate-spin" /> : "Grade"}
                </motion.button>
            )}

            {/* Grading Results */}
            <AnimatePresence>
                {loadingLyrics && (
                    <motion.div
                        key="loading-lyrics"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Spinner className="w-4 h-4 animate-spin mt-2" />
                    </motion.div>
                )}

                {gradeResult && (
                    <motion.div
                        key="grade-result"
                        className="mt-4 p-4 bg-green-100 rounded-md text-sm w-[600px] shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <p className="font-medium mb-2">Results:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {gradeResult.map((result, idx) => (
                                <li key={idx} className="text-gray-700">
                                    {result}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Spotify;
