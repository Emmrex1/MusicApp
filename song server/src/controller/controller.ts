import { sql } from "../config/db.js";
import TryCatch from "../TryCatch.js";
import { redisClient } from "../index.js";

export const getAllAlbums = TryCatch(async (req, res) => {
  const CACHE_KEY = "albums";
  const CACHE_EXPIRATION = 1800; // 30 minutes

  let albums;

  // Check Redis cache first
  if (redisClient.isOpen) {
    const cachedAlbums = await redisClient.get(CACHE_KEY);
    if (cachedAlbums) {
      console.log(" Data fetched from Redis cache");
      return res.status(200).json({
        success: true,
        message: "All albums (from cache)",
        albums: JSON.parse(cachedAlbums),
      });
    }
  }

  // If cache miss, fetch from DB
  console.log(" Cache miss, fetching from DB...");
  albums = await sql`SELECT * FROM albums`;

  // Save to Redis
  if (redisClient.isOpen) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRATION, JSON.stringify(albums));
    console.log("📦 Data cached in Redis");
  }

  res.status(200).json({
    success: true,
    message: "All albums (from DB)",
    albums,
  });
});


export const getAllSongs = TryCatch(async (req, res) => {
  const CACHE_KEY = "songs";
  const CACHE_EXPIRATION = 1800; 

  let songs;

  //  Check Redis cache first
  if (redisClient.isOpen) {
    const cachedSongs = await redisClient.get(CACHE_KEY);
    if (cachedSongs) {
      console.log(" Data fetched from Redis cache");
      return res.status(200).json({
        success: true,
        message: "All songs (from cache)",
        songs: JSON.parse(cachedSongs),
      });
    }
  }

  //  Cache miss → fetch from PostgreSQL
  console.log(" Cache miss, fetching from DB...");
  songs = await sql`SELECT * FROM songs`;

  //  Store in Redis for future requests
  if (redisClient.isOpen) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRATION, JSON.stringify(songs));
    console.log(" Data cached in Redis");
  }

  //  Return fresh DB data
  res.status(200).json({
    success: true,
    message: "All songs",
    songs,
  });
});


export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
  const { id } = req.params;
  const CACHE_KEY = `album:${id}:songs`; 
  const CACHE_EXPIRATION = 1800; 

  //   Check Redis cache
  if (redisClient.isOpen) {
    const cachedData = await redisClient.get(CACHE_KEY);
    if (cachedData) {
      console.log("✅ Album songs fetched from Redis cache");
      return res.status(200).json({
        success: true,
        message: "All songs of the album (from cache)",
        ...JSON.parse(cachedData),
      });
    }
  }

  //  Cache miss → Fetch album + songs from DB
  const albums = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (albums.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Album not found with this provided id",
    });
  }

  const songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;

  const responseData = { albums, songs };

  // Store in Redis
  if (redisClient.isOpen) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRATION, JSON.stringify(responseData));
    console.log("📦 Album songs cached in Redis");
  }

  //  Return response
  res.status(200).json({
    success: true,
    message: "All songs of the album",
    ...responseData,
  });
});

export const getSingleSong = TryCatch(async (req, res) => {
  const { id } = req.params;
  const CACHE_KEY = `song:${id}`;
  const CACHE_EXPIRATION = 1800; 

  // Check Redis cache
  if (redisClient.isOpen) {
    const cachedSong = await redisClient.get(CACHE_KEY);
    if (cachedSong) {
      console.log("✅ Single song fetched from Redis cache");
      return res.status(200).json({
        success: true,
        message: "Single song (from cache)",
        song: JSON.parse(cachedSong),
      });
    }
  }

  // Cache miss → Fetch from DB
  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Song not found with this provided id",
    });
  }

  // Store in Redis
  if (redisClient.isOpen) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRATION, JSON.stringify(song[0]));
    console.log("📦 Single song cached in Redis");
  }

  // Return response
  res.json({
    success: true,
    message: "Single song",
    song: song[0],
  });
});



// export const getAllAlbums=TryCatch(async(req,res)=>{
//     let albums;
    
//     albums = await sql`SELECT * FROM albums`;
//     res.status(200).json({
//         success:true,
//         message:"All albums",
//         albums
//     }) 
// })


// export const getAllSongs=TryCatch(async(req,res)=>{
//     let songs;
//     songs = await sql`SELECT * FROM songs`;
//     res.status(200).json({
//         success:true,
//         message:"All songs",
//         songs
//     }) 
// })

// export const getAllSongsOfAlbum=TryCatch(async(req,res)=>{
//     const {id} = req.params;
//     let albums, songs; 
//     albums = await sql`SELECT * FROM albums WHERE id = ${id}`;
    
//     if(albums.length === 0){
//         return res.status(404).json({
//             success:false,
//             message:"Album not found with this provided id"
//         })
//     }
//     songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;
//     res.status(200).json({
//         success:true,
//         message:"All songs of the album",
//         albums,
//         songs
//     })
// })

// export const getSingleSong = TryCatch(async (req, res)=>{
//    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
//    if(song.length === 0){
//     return res.status(404).json({
//         success:false,
//         message:"Song not found with this provided id"
//     })
//    }
//      res.json({
//     success:true,
//     message:"Single song",
//     song: song[0]
// })
// })