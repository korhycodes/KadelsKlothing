const removedProducts = new Set([
  "pink-editorial",
  "wild-shirt",
  "wild-trouser",
  "video-piece-08",
  "video-piece-09",
  "video-piece-14",
  "video-piece-15",
  "video-piece-16",
  "video-piece-18",
  "video-piece-19",
  "video-piece-21",
  "video-piece-22",
  "video-piece-24",
  "video-piece-26",
  "video-piece-27",
  "video-piece-31",
  "video-piece-32",
  "video-piece-37",
  "video-piece-39",
  "video-piece-40",
  "video-piece-42"
]);

const photos = [
  { id: "pink-signature", name: "The Signature Dress", category: "Dresses", price: 850, image: "assets/KK.jpg", badge: "Studio favourite", active: true },
  { id: "wild-set", name: "Wild at Heart Set", category: "Ready to wear", price: 680, image: "assets/1e8570cf0aa64db99db2e93bbe679c95.jpg", badge: "Easy statement", active: true },
  { id: "garden-set", name: "Garden Party Co-ord", category: "Ready to wear", price: 620, image: "assets/de2024e6b2e5493187ec3d008769c386.jpg", badge: "New in", active: true },
  { id: "green-set", name: "Sunday Best Set", category: "Ready to wear", price: 650, image: "assets/565cb912b53f408e8feda949a8bf000c.jpg", badge: "Made to move", active: true }
];

const allVideoAssets = [
  "1260dfc15242471bbedc00d78c71644d.mp4", "1479cdc6892749919b9851189c09d751.mp4",
  "1653ef6d9add480e906a10bb0748e98e.mp4",
  "4b957500be6e4b4e8731a37e90a6ae5d.mp4", "525b73ed60a0482c9e940de6d91ded9a.mp4",
  "6de78e31b3bc487da77103ddb762f05c.mp4", "9307a9a1a27146619c65543fd5034e3d.mp4",
  "974ea41af383467580d2af565c116ec9.mp4", "Abstract-print.mp4", "d8a6bc580f434ab3a678167bf2c54640.mp4",
  "e63623568f0d4dd58db34d7cd92b9d21.mp4", "ea7b94599c1a4a8a8266965f8aaccc7e.mp4",
  "IMG_5893.MOV", "KADELS WEAR.MP4", "Snapchat-714859024.mp4",
  "VID-20251023-WA0007.mp4", "VID-20251027-WA0002.mp4", "VID-20251027-WA0003.mp4",
  "VID-20251027-WA0004.mp4", "VID-20251027-WA0005.mp4", "VID-20251027-WA0006.mp4",
  "VID-20251027-WA0007.mp4", "VID-20251027-WA0008.mp4", "VID-20251027-WA0009.mp4",
  "VID-20251027-WA0010.mp4", "VID-20251027-WA0011.mp4", "VID-20251027-WA0012.mp4",
  "VID-20260209-WA0011.mp4", "VID-20260209-WA0012.mp4", "VID-20260209-WA0028.mp4",
  "VID-20260209-WA0030.mp4", "VID-20260209-WA0031.mp4", "VID-20260209-WA0032.mp4",
  "VID-20260209-WA0033.mp4", "VID-20260219-WA0065.mp4", "VID-20260219-WA0067.mp4",
  "VID-20260219-WA0068.mp4", "VID-20260314-WA0111.mp4", "lv_0_20251031071251.mp4",
  "lv_0_20251104132102.mp4", "lv_0_20251104185321.mp4", "lv_0_20251104191957.mp4"
];

const isRemovedVideo = index => removedProducts.has(`video-piece-${String(index + 1).padStart(2, "0")}`);

export const videoAssets = allVideoAssets.filter((_, index) => !isRemovedVideo(index));
const activeVideoPaths = new Set(videoAssets.map(filename => `assets/${filename}`));
const posterPathForVideo = videoPath => {
  const filename = videoPath.split("/").pop();
  return `assets/video-posters/${filename.replace(/\.[^.]+$/, ".jpg")}`;
};
const activePosterPaths = new Set(videoAssets.map(filename => posterPathForVideo(`assets/${filename}`)));

const videos = allVideoAssets.map((filename, index) => {
  const id = `video-piece-${String(index + 1).padStart(2, "0")}`;
  return {
    id,
    name: `Video Piece ${String(index + 1).padStart(2, "0")}`,
    category: "Video pieces",
    price: null,
    video: `assets/${filename}`,
    poster: `assets/video-posters/${filename.replace(/\.[^.]+$/, ".jpg")}`,
    videoProduct: true,
    badge: "Video collection",
    active: true
  };
}).filter(product => !removedProducts.has(product.id));

export const starterProducts = [...photos, ...videos].filter(product => !removedProducts.has(product.id));
export { removedProducts };

export const storageKey = "kadels-klothing-store-v1";

export function loadStore() {
  const fallback = { products: starterProducts.map(product => ({ ...product })), orders: [], requests: [], cart: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || !Array.isArray(saved.products) || !Array.isArray(saved.orders) || !Array.isArray(saved.requests)) return fallback;

    const products = saved.products
      .filter(product => !removedProducts.has(product.id))
      .map(product => {
        const starter = starterProducts.find(item => item.id === product.id);
        const migrated = { ...product };
        if (!migrated.videoProduct) delete migrated.video;
        if (migrated.videoProduct && starter) {
          if (!activeVideoPaths.has(migrated.video)) {
            migrated.video = starter.video;
            migrated.poster = starter.poster;
          } else if (!activePosterPaths.has(migrated.poster)) {
            migrated.poster = posterPathForVideo(migrated.video);
          }
        }
        return migrated;
      });

    if (saved.videoCatalogVersion !== 3) {
      starterProducts.filter(product => product.videoProduct).forEach(product => {
        if (!products.some(entry => entry.id === product.id)) products.push({ ...product });
      });
    }

    return {
      products,
      orders: saved.orders,
      requests: saved.requests,
      cart: (saved.cart || []).filter(item => !removedProducts.has(item.productId))
    };
  } catch (error) {
    console.warn("Could not read the saved studio data; using the starter collection.", error);
    return fallback;
  }
}

export function persistStore(store) {
  localStorage.setItem(storageKey, JSON.stringify({ ...store, videoCatalogVersion: 3 }));
}

export const money = amount => amount == null || amount === ""
  ? "Price on request"
  : `GHS ${Number(amount).toLocaleString("en-GH")}`;

export const dateLabel = value => new Date(value).toLocaleDateString(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric"
});

export const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
