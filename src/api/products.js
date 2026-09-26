const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3300/api/v1"
).replace(/\/$/, "");

function getProductImage(product) {
  const suppliedImage = product.image || product.images?.[0];
  if (suppliedImage) return suppliedImage;

  const name = product.name?.toLowerCase() || "";
  if (name.includes("keyboard")) return "/products/wired-keyboard.jpg";
  if (
    product.brand?.toLowerCase().includes("hithium") ||
    product.category?.toLowerCase().includes("power station")
  ) {
    return "/products/hithium-heroee-2.png";
  }
  return "";
}

export async function getProducts(signal) {
  const response = await fetch(`${API_BASE_URL}/products`, { signal });
  if (!response.ok)
    throw new Error(`Impossible de charger les produits (${response.status}).`);
  const payload = await response.json();
  const products = Array.isArray(payload)
    ? payload
    : payload.products || payload.value;
  if (!Array.isArray(products))
    throw new Error("La réponse du catalogue n'est pas valide.");
  return products.map((product) => ({
    ...product,
    id: product._id || product.id,
    image: getProductImage(product),
    currency: product.currency || "NGN",
  }));
}
