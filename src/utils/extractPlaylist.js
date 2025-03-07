export function extractPlaylist(spotifyData) {
  return spotifyData.items.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    image: playlist.images.length > 0 ? playlist.images[0].url : null,
    owner: playlist.owner.display_name
  }));
}
