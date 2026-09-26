import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Mail,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { getProducts } from "../api/products.js";

function readSaved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function formatPrice(value, currency = "NGN") {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `${currency} ${Number(value || 0).toLocaleString("en-NG")}`;
  }
}
function readRoute() {
  const path = window.location.hash.replace(/^#/, "") || "/";
  const match = path.match(/^\/product\/([^/]+)$/);
  return match
    ? { page: "product", productId: match[1] }
    : { page: path.slice(1) || "home" };
}
function ProductVisual({ product, large = false }) {
  return (
    <div className={`product-visual${large ? " product-visual-large" : ""}`}>
      {product.image ? (
        <img src={product.image} alt={product.name} />
      ) : (
        <>
          <span className="visual-mark">
            <Package size={large ? 54 : 38} strokeWidth={1.25} />
          </span>
          <span className="visual-caption">
            {product.brand || "MAKK SELECT"}
          </span>
        </>
      )}
    </div>
  );
}
function ProductCard({ product, onOpen, onAdd, onFavorite, favorite }) {
  const hasOldPrice = Number(product.oldPrice) > Number(product.price);
  return (
    <article className="product-card">
      <div className="product-card-media" onClick={() => onOpen(product.id)}>
        {product.discount > 0 && (
          <span className="discount-tag">-{product.discount}%</span>
        )}
        <button
          className={`icon-button favorite-button${favorite ? " is-favorite" : ""}`}
          type="button"
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite(product.id);
          }}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
        <ProductVisual product={product} />
      </div>
      <div className="product-card-info">
        <p className="eyebrow">
          {product.brand || product.category || "Sélection"}
        </p>
        <button
          className="product-name"
          type="button"
          onClick={() => onOpen(product.id)}
        >
          {product.name}
        </button>
        <div className="product-price-row">
          <strong>{formatPrice(product.price, product.currency)}</strong>
          {hasOldPrice && (
            <span className="old-price">
              {formatPrice(product.oldPrice, product.currency)}
            </span>
          )}
          {!hasOldPrice && Number(product.oldPrice) > 0 && (
            <span className="reference-price">
              Réf. {formatPrice(product.oldPrice, product.currency)}
            </span>
          )}
        </div>
        <div className="product-card-facts">
          <span>
            {product.stock > 0
              ? `${product.stock} en stock`
              : "Rupture de stock"}
          </span>
          {product.shippingFrom != null && (
            <span>
              Départ {formatPrice(product.shippingFrom, product.currency)}
            </span>
          )}
          {product.shipping != null && (
            <span>
              Livraison {formatPrice(product.shipping, product.currency)}
            </span>
          )}
          {product.location && (
            <span className="product-location">{product.location}</span>
          )}
        </div>
        {product.options?.length > 0 && (
          <div className="product-options-preview">
            {product.options.map((option) => (
              <span key={option._id}>
                {option.name} · {formatPrice(option.price, product.currency)} ·{" "}
                {option.stock} en stock
              </span>
            ))}
          </div>
        )}
        <div className="product-card-bottom">
          <span className="rating">
            ★ {Number(product.rating || 0).toFixed(1)}{" "}
            <small>({product.ratingsCount || 0})</small>
          </span>
          <button
            className="add-button"
            type="button"
            disabled={!product.stock}
            onClick={() => onAdd(product)}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
function EmptyState({ title, text, action, onAction }) {
  return (
    <div className="empty-state">
      <ShoppingBag size={34} strokeWidth={1.4} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="primary-button" type="button" onClick={onAction}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [route, setRoute] = useState(readRoute);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes les catégories");
  const [cart, setCart] = useState(() => readSaved("makk-cart", []));
  const [favorites, setFavorites] = useState(() =>
    readSaved("makk-favorites", []),
  );
  const [notice, setNotice] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const updateRoute = () => {
      setRoute(readRoute());
      setSelectedOption("");
    };
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal)
      .then(setProducts)
      .catch((requestError) => {
        if (requestError.name !== "AbortError")
          setError(requestError.message || "Le catalogue est indisponible.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);
  useEffect(() => {
    localStorage.setItem("makk-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("makk-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const categories = useMemo(
    () => [
      "Toutes les catégories",
      ...new Set(products.map((item) => item.category).filter(Boolean)),
    ],
    [products],
  );
  const filteredProducts = useMemo(
    () =>
      products.filter((item) => {
        const text =
          `${item.name} ${item.brand || ""} ${item.category || ""}`.toLowerCase();
        return (
          text.includes(query.trim().toLowerCase()) &&
          (category === "Toutes les catégories" || item.category === category)
        );
      }),
    [products, query, category],
  );
  const currentProduct = products.find((item) => item.id === route.productId);
  const favoriteProducts = products.filter((item) =>
    favorites.includes(item.id),
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function navigate(path) {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function retryProducts() {
    setLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  }
  function addToCart(product, option) {
    const key = option?._id || product.id;
    const item = {
      key,
      productId: product.id,
      name: option?.name ? `${product.name} · ${option.name}` : product.name,
      price: Number(option?.price ?? product.price),
      currency: product.currency,
      stock: Number(option?.stock ?? product.stock ?? 99),
    };
    setCart((current) => {
      const existing = current.find((entry) => entry.key === key);
      if (existing)
        return current.map((entry) =>
          entry.key === key
            ? { ...entry, quantity: Math.min(entry.quantity + 1, item.stock) }
            : entry,
        );
      return [...current, { ...item, quantity: 1 }];
    });
    setNotice("Produit ajouté au panier");
    window.setTimeout(() => setNotice(""), 2200);
  }
  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }
  function changeQuantity(key, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(item.stock, item.quantity + amount),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }
  function productGrid(items) {
    if (!items.length)
      return (
        <EmptyState
          title="Aucun produit trouvé"
          text="Essayez une autre recherche ou une autre catégorie."
          action="Effacer les filtres"
          onAction={() => {
            setQuery("");
            setCategory("Toutes les catégories");
          }}
        />
      );
    return (
      <div className="product-grid">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={(id) => navigate(`/product/${id}`)}
            onAdd={addToCart}
            onFavorite={toggleFavorite}
            favorite={favorites.includes(product.id)}
          />
        ))}
      </div>
    );
  }
  function catalogState(items) {
    if (loading)
      return <div className="loading-state">Chargement du catalogue…</div>;
    if (error)
      return (
        <div className="error-state">
          <p>{error}</p>
          <button type="button" onClick={retryProducts}>
            Réessayer
          </button>
        </div>
      );
    return productGrid(items);
  }
  function renderHome() {
    return (
      <>
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">La sélection du moment</p>
            <h1>
              Le quotidien,
              <br />
              <em>en mieux.</em>
            </h1>
            <p>Des essentiels choisis avec soin, livrés depuis Lagos.</p>
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/products")}
            >
              Explorer la boutique <ArrowRight size={17} />
            </button>
          </div>
          <div className="hero-product" aria-hidden="true">
            <span>MAKK</span>
            <Package size={96} strokeWidth={0.8} />
          </div>
          <div className="hero-meta">
            <span>01 / ÉLECTRONIQUE</span>
            <span>Qualité sélectionnée · NGN</span>
          </div>
        </section>
        <section className="content-section home-products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalogue synchronisé</p>
              <h2>Tous les produits</h2>
            </div>
            <span className="result-count">
              {products.length} article{products.length === 1 ? "" : "s"}
            </span>
          </div>
          {categories.length > 1 && (
            <div
              className="home-categories"
              aria-label="Catégories de produits"
            >
              {categories.slice(1).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    navigate("/products");
                  }}
                >
                  {item}
                  <ArrowRight size={14} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setCategory("Toutes les catégories");
                  navigate("/products");
                }}
              >
                Toutes les catégories
                <ArrowRight size={14} />
              </button>
            </div>
          )}
          {catalogState(products)}
        </section>
        <section className="service-strip">
          <div>
            <Truck size={22} />
            <span>
              <strong>Livraison locale</strong>
              <small>Frais selon l’article</small>
            </span>
          </div>
          <div>
            <Check size={22} />
            <span>
              <strong>Stock vérifié</strong>
              <small>Catalogue synchronisé</small>
            </span>
          </div>
          <div>
            <MapPin size={22} />
            <span>
              <strong>Lekki-Ajah</strong>
              <small>Expédition depuis Lagos</small>
            </span>
          </div>
        </section>
      </>
    );
  }
  function renderCatalog() {
    return (
      <main className="content-section page-content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">La boutique</p>
            <h1>Tous les produits</h1>
          </div>
          <span className="result-count">
            {filteredProducts.length} article
            {filteredProducts.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="catalog-controls">
          <label className="select-wrap">
            <span>Catégorie</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="search-field">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher dans le catalogue"
            />
          </label>
        </div>
        {catalogState(filteredProducts)}
      </main>
    );
  }
  function renderProduct() {
    if (loading)
      return (
        <main className="page-content loading-state">
          Chargement du produit…
        </main>
      );
    if (!currentProduct)
      return (
        <main className="page-content">
          <EmptyState
            title="Produit introuvable"
            text={
              error || "Ce produit n’est plus disponible dans le catalogue."
            }
            action="Retour au catalogue"
            onAction={() => navigate("/products")}
          />
        </main>
      );
    const option = currentProduct.options?.find(
      (item) => item._id === selectedOption,
    );
    const price = option?.price ?? currentProduct.price;
    const stock = option?.stock ?? currentProduct.stock;
    return (
      <main className="content-section page-content">
        <button
          className="back-link"
          type="button"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={16} /> Retour aux produits
        </button>
        <div className="detail-layout">
          <ProductVisual product={currentProduct} large />
          <div className="detail-copy">
            <p className="eyebrow">
              {currentProduct.brand} · {currentProduct.category}
            </p>
            <h1>{currentProduct.name}</h1>
            <div className="detail-rating">
              <span className="rating">
                ★ {Number(currentProduct.rating || 0).toFixed(1)}
              </span>
              <span>{currentProduct.ratingsCount || 0} avis</span>
              <span className="stock-status">
                {stock > 0 ? `${stock} en stock` : "Rupture de stock"}
              </span>
            </div>
            <div className="detail-price">
              {formatPrice(price, currentProduct.currency)}
              {Number(currentProduct.oldPrice) > price && (
                <del>
                  {formatPrice(
                    currentProduct.oldPrice,
                    currentProduct.currency,
                  )}
                </del>
              )}
              {Number(currentProduct.oldPrice) > 0 &&
                Number(currentProduct.oldPrice) <= price && (
                  <span className="reference-price-detail">
                    Prix de référence :{" "}
                    {formatPrice(
                      currentProduct.oldPrice,
                      currentProduct.currency,
                    )}
                  </span>
                )}
            </div>
            {currentProduct.options?.length > 0 && (
              <label className="option-select">
                <span>Choisir une option</span>
                <select
                  value={selectedOption}
                  onChange={(event) => setSelectedOption(event.target.value)}
                >
                  <option value="">
                    Option standard ·{" "}
                    {formatPrice(currentProduct.price, currentProduct.currency)}
                  </option>
                  {currentProduct.options.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} ·{" "}
                      {formatPrice(item.price, currentProduct.currency)} ·{" "}
                      {item.stock} en stock
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button
              className="primary-button detail-add"
              type="button"
              disabled={!stock}
              onClick={() => addToCart(currentProduct, option)}
            >
              <ShoppingCart size={17} /> Ajouter au panier
            </button>
            <div className="detail-facts">
              <p>
                <Truck size={18} />
                <span>
                  <strong>Expédition</strong>Depuis{" "}
                  {currentProduct.location || "Lagos"}. Frais indicatifs :{" "}
                  {formatPrice(
                    currentProduct.shippingFrom ?? 0,
                    currentProduct.currency,
                  )}
                  . Livraison :{" "}
                  {formatPrice(
                    currentProduct.shipping ?? 0,
                    currentProduct.currency,
                  )}
                  .
                </span>
              </p>
              <p>
                <Package size={18} />
                <span>
                  <strong>Disponibilité</strong>
                  {stock > 0
                    ? `${stock} unité(s) disponible(s)`
                    : "Actuellement indisponible"}
                  .
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  function renderCart() {
    return (
      <main className="content-section page-content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Votre sélection</p>
            <h1>Panier</h1>
          </div>
          <span className="result-count">
            {cartCount} article{cartCount === 1 ? "" : "s"}
          </span>
        </div>
        {!cart.length ? (
          <EmptyState
            title="Votre panier est vide"
            text="Parcourez le catalogue et ajoutez vos trouvailles."
            action="Voir les produits"
            onAction={() => navigate("/products")}
          />
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cart.map((item) => (
                <article className="cart-row" key={item.key}>
                  <div className="cart-thumb">
                    <Package size={24} />
                  </div>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price, item.currency)}</span>
                  </div>
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label="Retirer une unité"
                      onClick={() => changeQuantity(item.key, -1)}
                    >
                      <Minus size={15} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Ajouter une unité"
                      disabled={item.quantity >= item.stock}
                      onClick={() => changeQuantity(item.key, 1)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <strong className="line-total">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </strong>
                  <button
                    className="icon-button remove-button"
                    type="button"
                    aria-label="Supprimer du panier"
                    onClick={() =>
                      setCart((items) =>
                        items.filter((entry) => entry.key !== item.key),
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              ))}
            </div>
            <aside className="order-summary">
              <h2>Résumé</h2>
              <div>
                <span>Sous-total</span>
                <strong>{formatPrice(cartTotal, cart[0]?.currency)}</strong>
              </div>
              <div>
                <span>Livraison</span>
                <span>À confirmer</span>
              </div>
              <div className="summary-total">
                <span>Total estimé</span>
                <strong>{formatPrice(cartTotal, cart[0]?.currency)}</strong>
              </div>
              <button className="primary-button" type="button" disabled>
                Continuer vers le paiement
              </button>
              <p>
                Le backend ne fournit pas encore de route de commande ou de
                paiement.
              </p>
            </aside>
          </div>
        )}
      </main>
    );
  }
  function renderFavorites() {
    return (
      <main className="content-section page-content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">À garder sous la main</p>
            <h1>Favoris</h1>
          </div>
        </div>
        {favoriteProducts.length ? (
          productGrid(favoriteProducts)
        ) : (
          <EmptyState
            title="Pas encore de favoris"
            text="Utilisez le cœur sur un produit pour le retrouver ici."
            action="Découvrir les produits"
            onAction={() => navigate("/products")}
          />
        )}
      </main>
    );
  }
  function renderStaticPage(page) {
    if (page === "contact")
      return (
        <main className="content-section page-content text-page">
          <p className="eyebrow">Nous contacter</p>
          <h1>Parlons de ce qu’il vous faut.</h1>
          <p>
            Notre boutique est basée à Lekki-Ajah, Lagos. Le backend fourni ne
            publie pas de service de messagerie ni de coordonnées de support.
          </p>
          <div className="contact-note">
            <Mail size={20} />
            <span>
              Les demandes ne sont pas envoyées depuis cette interface tant
              qu’une route de contact n’est pas disponible.
            </span>
          </div>
        </main>
      );
    return (
      <main className="content-section page-content text-page">
        <p className="eyebrow">À propos de Makk</p>
        <h1>Des essentiels, choisis simplement.</h1>
        <p>
          Makk rassemble un catalogue sélectionné et des informations de stock
          synchronisées avec notre service. Les prix et disponibilités affichés
          proviennent directement du backend.
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => navigate("/products")}
        >
          Voir le catalogue <ArrowRight size={16} />
        </button>
      </main>
    );
  }

  const page = route.page;
  const pageTitle =
    {
      products: "Produits",
      cart: "Panier",
      favorites: "Favoris",
      contact: "Contact",
      about: "À propos",
      product: "Produit",
      home: "Accueil",
    }[page] || "Page";
  const knownPages = [
    "home",
    "products",
    "product",
    "cart",
    "favorites",
    "about",
    "contact",
  ];
  return (
    <div className="storefront">
      <div className="announcement">
        <span>MAKK / BOUTIQUE EN LIGNE</span>
        <span>Livraison depuis Lagos · Prix en NGN</span>
      </div>
      <header className="site-header">
        <button
          className="brand-mark"
          type="button"
          onClick={() => navigate("/")}
          aria-label="Makk, accueil"
        >
          makk<span>.</span>
        </button>
        <nav className="main-nav" aria-label="Navigation principale">
          <button
            className={page === "home" ? "nav-active" : ""}
            type="button"
            onClick={() => navigate("/")}
          >
            Accueil
          </button>
          <button
            className={
              page === "products" || page === "product" ? "nav-active" : ""
            }
            type="button"
            onClick={() => navigate("/products")}
          >
            Produits
          </button>
          <button
            className={page === "about" ? "nav-active" : ""}
            type="button"
            onClick={() => navigate("/about")}
          >
            À propos
          </button>
          <button
            className={page === "contact" ? "nav-active" : ""}
            type="button"
            onClick={() => navigate("/contact")}
          >
            Contact
          </button>
        </nav>
        <div className="header-actions">
          <form
            className="header-search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/products");
            }}
          >
            <input
              aria-label="Rechercher un produit"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher"
            />
            <button type="submit" aria-label="Lancer la recherche">
              <Search size={17} />
            </button>
          </form>
          <button
            className="header-icon"
            type="button"
            aria-label={`Favoris, ${favorites.length}`}
            onClick={() => navigate("/favorites")}
          >
            <Heart size={19} />
          </button>
          <button
            className="header-icon cart-shortcut"
            type="button"
            aria-label={`Panier, ${cartCount} articles`}
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={19} />
            <span>{cartCount}</span>
          </button>
        </div>
      </header>
      <div className="page-context">
        <span>{pageTitle}</span>
        <span>Accueil / {pageTitle}</span>
      </div>
      {page === "home" && renderHome()}
      {page === "products" && renderCatalog()}
      {page === "product" && renderProduct()}
      {page === "cart" && renderCart()}
      {page === "favorites" && renderFavorites()}
      {(page === "about" || page === "contact") && renderStaticPage(page)}
      {!knownPages.includes(page) && (
        <main className="page-content">
          <EmptyState
            title="Page introuvable"
            text="Cette adresse ne correspond à aucune page."
            action="Retour à l’accueil"
            onAction={() => navigate("/")}
          />
        </main>
      )}
      <footer className="site-footer">
        <button
          className="brand-mark footer-brand"
          type="button"
          onClick={() => navigate("/")}
        >
          makk<span>.</span>
        </button>
        <p>Une sélection utile, depuis Lagos.</p>
        <div>
          <button type="button" onClick={() => navigate("/about")}>
            À propos
          </button>
          <button type="button" onClick={() => navigate("/contact")}>
            Contact
          </button>
          <button type="button" onClick={() => navigate("/products")}>
            Catalogue
          </button>
        </div>
        <small>© 2026 Makk. Tous droits réservés.</small>
      </footer>
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
