export interface SpotifyImage {
    url: string
    height: number
    width: number
}

export interface SpotifyArtist {
    id: string
    name: string
}

export interface SpotifyAlbum {
    id: string
    name: string
    images: SpotifyImage[]
}

export interface SpotifyTrack {
    id: string
    name: string
    preview_url: string
    album: SpotifyAlbum
    artists: SpotifyArtist[]
}
