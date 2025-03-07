export const extractPlaylistId = (url) => {
  const regex =
    /^https?:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(\?.*)?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
