import "dotenv/config";
import express from "express";
import cors from "cors";
import { getNowPlaying } from "./utils";

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const nowPlaying = await getNowPlaying();
    return res.json({
      name: nowPlaying.item.name,
      artists: nowPlaying.item.artists.map((artist: any) => artist.name),
      album: nowPlaying.item.album.name,
      albumImageUrl: nowPlaying.item.album.images[0].url,
      previewUrl: nowPlaying.item.preview_url,
      url: nowPlaying.item.external_urls.spotify,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
