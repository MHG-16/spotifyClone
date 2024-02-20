import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  return (
    <div className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h2 className="text-white text-3xl font-semibold">
            Welcome back
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem image="/images/liked.png" name="Liked songs" href="liked"/>
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-white text-2xl font-semibold">
            Newest songs
          </h3>
        </div>
        <div>
          {songs.map((song) => <div key={song.id}>{song.title}</div>)}
        </div>
      </div>
    </div>
  );
}
