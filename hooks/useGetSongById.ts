import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
    const [isLoading, setLoading] = useState(false);
    const [ song, setSong ] = useState<Song | undefined>(undefined)
    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        if (!id) {
            return;
        }

        setLoading(true);

        const fetchSong = async () => {
            const { data, error } = await supabaseClient
                .from("song")
                .select("*")
                .eq("id", id)
                .single();

                if (error) {
                    setLoading(false);
                    return toast.error(error.message);
                }

                setSong(data as Song);
                setLoading(false);
        }

        fetchSong();
    }, [id, supabaseClient]);

    return useMemo(() => ({
        isLoading,
        song
    }), [isLoading, song]);
}

export default useGetSongById;