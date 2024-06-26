import fs from "fs"

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken!,
    })
  })

  const data = await res.json()
  
  console.log(data)
  return data.access_token
}

export async function getNowPlaying() {
  const accessToken = await getAccessToken()

  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    }
  })

  if (res.status === 204) {
    console.log("No content")

    const data = fs.readFileSync("data.json")
    return JSON.parse(data.toString())
  }

  const data = await res.json()

  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.error(err)
      throw new Error(err.message)
    }
  })

  console.log(data)
  return data
}