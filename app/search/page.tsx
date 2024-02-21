import getSongsByTitle from "@/actions/getSongsBytitle";
import Header from "@/components/Header";
import SearchInput from "@/components/input/SearchInput";

interface SearchProps {
    searchParams: {
        title: string;
    }
}

const SearchPage = async ({ searchParams } : SearchProps) => {
    const songs = await getSongsByTitle(searchParams.title);

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h2 className="text-white text-3xl font-semibold">
                        Search
                    </h2>
                    <SearchInput />
                </div>
            </Header>
        </div>
    )
}

export default SearchPage;