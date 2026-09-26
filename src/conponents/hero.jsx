import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Eye,
  User,
  ChevronRight,
  ChevronLeft,
  Truck,
  Headphones,
  ShieldCheck,
  Star,
} from "lucide-react";

const PRODUCTS_API_URL = "http://localhost:3300/api/v1/products";

/**
 * E-Commerce homepage — recreated from the provided mockup.
 * Single-file React component, Tailwind utility classes only.
 * Drop into any React + Tailwind project. Uses lucide-react for icons.
 */

// ---------- Placeholder product data ----------
const flashSale = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    old: 160,
    discount: 40,
    rating: 5,
    reviews: 88,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3N3ns3pqBRK9ESc1ajeXBuuA-dtlHTdd-zPlsVo0QMBFBgIX_4g0cLgEx&s=10",
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    price: 960,
    old: 1160,
    discount: 35,
    rating: 4,
    reviews: 75,
    img: "https://i.ebayimg.com/images/g/Z9cAAeSwpwNo1EUb/s-l1600.webp",
  },
  {
    id: 3,
    name: "IPS LCD Gaming Monitor",
    price: 370,
    old: 400,
    discount: 30,
    rating: 5,
    reviews: 99,
    img: "https://misura.s11.cdn-upgates.com/_cache/7/4/74796ed354e0dba5f20da286391c7bd3-1-8-1505.jpg",
  },
  {
    id: 4,
    name: "S-Series Comfort Chair",
    price: 375,
    old: 400,
    discount: 25,
    rating: 4,
    reviews: 50,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ9k8i79LTDECg4rO80JqNEQDBJoq_0J7ET4Fc3UziaulLo4Qo5JExurgu&s=10",
  },
];

const categories = [
  { id: 1, name: "Phones", icon: "📱" },
  { id: 2, name: "Computers", icon: "💻" },
  { id: 3, name: "SmartWatch", icon: "⌚" },
  { id: 4, name: "Camera", icon: "📷" },
  { id: 5, name: "Headphones", icon: "🎧" },
  { id: 6, name: "Gaming", icon: "🎮" },
];

const bestSelling = [
  {
    id: 1,
    name: "The Dandy Chair",
    price: 120,
    old: 160,
    rating: 5,
    reviews: 65,
    img: "https://cdn.mohd.it/cache/image/width=800,format=webp/media/catalog/product/d/a/dandy-chair-3-colico.jpg",
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    price: 960,
    old: 1160,
    rating: 4,
    reviews: 75,
    img: "https://i.ebayimg.com/images/g/mJEAAOSwkKFjL6Nz/s-l1600.webp",
  },
  {
    id: 3,
    name: "RGB liquid CPU Cooler",
    price: 160,
    rating: 4,
    reviews: 41,
    img: "https://www.amazon.in/VAYOLIN%C2%AE-Cooler-Cooling-evaporative-portable/dp/B0GHNRJQVK",
  },
  {
    id: 4,
    name: "Vertical Leather Jacket",
    price: 100,
    rating: 5,
    reviews: 35,
    img: "https://i.ebayimg.com/images/g/nYwAAeSwV2dpirSB/s-l1600.webp",
  },
];

const exploreProducts = [
  {
    id: 1,
    name: "Breed Dry Dog Food",
    price: 100,
    rating: 3,
    reviews: 35,
    img: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/11/4512024/1.jpg?1243",
  },
  {
    id: 2,
    name: "CANON EOS DSLR Camera",
    price: 360,
    rating: 4,
    reviews: 95,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkJO1YlVbn8nhfuq4aie-dQy4ha_kGjt1pa5-9VHbnCbLTgQajqx2849E&s=10",
  },
  {
    id: 3,
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    rating: 5,
    reviews: 325,
    img: "https://i5.walmartimages.com/seo/HP-15-6-Ryzen-5-8GB-256GB-Laptop-Rose-Gold_36809cf3-480b-47a5-94f0-e1d5e70c58c0_3.fcc0d6494b0e279a13c32c80c28abfa3.jpeg",
    isNew: true,
  },
  {
    id: 4,
    name: "Curology Product Set",
    price: 500,
    rating: 4,
    reviews: 145,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvjsO3ZClcdVxvU2LVNlgIGc3hGVwzjJA7-Bs-mJIYUJnIvekC9XNqm48&s=10",
  },
  {
    id: 5,
    name: "Kids Electric Car",
    price: 960,
    old: 1160,
    rating: 5,
    reviews: 65,
    img: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/78/1218204/1.jpg?5181",
  },
  {
    id: 6,
    name: "Jr. Zoom Soccer Cleats",
    price: 1160,
    rating: 5,
    reviews: 35,
    img: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/78/1218204/1.jpg?5181",
  },
  {
    id: 7,
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    rating: 4.5,
    reviews: 55,
    img: "https://geprc.com/wp-content/uploads/2023/01/GEPRC-Naked-Camera-GP11-4-1200x1200.jpg",
    isNew: true,
  },
  {
    id: 8,
    name: "Quilted Satin Jacket",
    price: 660,
    rating: 4.5,
    reviews: 55,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQapaRkZ-Z5zBOfN_GtCS_Kaska1c84jU2HfPgqP_UJp6_KQERr23kNBbA&s=10",
  },
];

const fallbackProducts = [...flashSale, ...bestSelling, ...exploreProducts];

function normalizeProduct(product) {
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    old: product.oldPrice,
    discount: product.discount,
    rating: product.rating,
    reviews: product.ratingsCount,
    currency: product.currency || "NGN",
    category: product.category,
    stock: product.stock,
    img: product.image || product.images?.[0],
  };
}

function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

// ---------- Small reusable bits ----------
function Stars({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function SectionTag({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-8 w-5 rounded bg-red-500" />
      <span className="text-sm font-semibold text-red-500">{children}</span>
    </div>
  );
}

function ProductCard({ product }) {
  const {
    name,
    price,
    old,
    rating,
    reviews,
    img,
    discount,
    isNew,
    currency,
    category,
  } = product;
  const image = img || `https://picsum.photos/seed/${product.id}/500/500`;
  return (
    <div className="group relative">
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-md bg-neutral-100">
        {discount && (
          <span className="absolute left-3 top-3 z-10 rounded bg-red-500 px-2 py-0.5 text-xs text-white">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="absolute left-3 top-3 z-10 rounded bg-emerald-500 px-2 py-0.5 text-xs text-white">
            NEW
          </span>
        )}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-neutral-900 hover:text-white">
            <Heart size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-neutral-900 hover:text-white">
            <Eye size={15} />
          </button>
        </div>
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <button className="absolute inset-x-0 bottom-0 translate-y-full bg-neutral-900 py-2 text-center text-xs font-medium text-white transition duration-200 group-hover:translate-y-0">
          Add To Cart
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-neutral-800">{name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-red-500">
            {formatPrice(price, currency)}
          </span>
          {old && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(old, currency)}
            </span>
          )}
        </div>
        {category && <p className="text-xs text-neutral-400">{category}</p>}
        <div className="flex items-center gap-1.5">
          <Stars rating={rating} />
          <span className="text-xs text-neutral-400">({reviews})</span>
        </div>
      </div>
    </div>
  );
}

function CountdownBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-neutral-900 sm:h-14 sm:w-14 sm:text-base">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] text-neutral-500 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

function ViewAllButton({ children = "View All Products" }) {
  return (
    <button className="mx-auto mt-10 block rounded bg-red-500 px-10 py-3 text-sm font-medium text-white transition hover:bg-red-600">
      {children}
    </button>
  );
}

// ---------- Header ----------
function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="bg-neutral-900 py-2 text-center text-xs text-white">
        Summer Sale For All Suits and Free Express Delivery — OFF 50%!{" "}
        <span className="ml-1 underline">Shop Now</span>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="text-xl font-bold tracking-tight text-neutral-900">
          eShop
        </span>
        <nav className="hidden gap-8 text-sm text-neutral-700 md:flex">
          <a
            href="#"
            className="border-b-2 border-neutral-900 pb-1 font-medium text-neutral-900"
          >
            Home
          </a>
          <a href="#" className="hover:text-neutral-900">
            Contact
          </a>
          <a href="#" className="hover:text-neutral-900">
            About
          </a>
          <a href="#" className="hover:text-neutral-900">
            Sign Up
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded bg-neutral-100 px-3 py-1.5 sm:flex">
            <input
              placeholder="Search"
              className="w-32 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
            <Search size={16} className="text-neutral-500" />
          </div>
          <Heart size={20} className="cursor-pointer text-neutral-700" />
          <ShoppingCart size={20} className="cursor-pointer text-neutral-700" />
          <User size={20} className="cursor-pointer text-neutral-700" />
        </div>
      </div>
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
      <aside className="hidden flex-col gap-3 border-r border-neutral-200 pr-6 text-sm text-neutral-600 md:flex">
        {[
          "Woman's Fashion",
          "Men's Fashion",
          "Electronics",
          "Home & Lifestyle",
          "Medicine",
          "Sports & Outdoor",
          "Baby's & Toys",
          "Groceries & Pets",
          "Health & Beauty",
        ].map((c) => (
          <a
            key={c}
            href="#"
            className="flex items-center justify-between hover:text-neutral-900"
          >
            {c}
            {(c === "Woman's Fashion" || c === "Men's Fashion") && (
              <ChevronRight size={14} />
            )}
          </a>
        ))}
      </aside>
      <div className="relative flex items-center justify-between overflow-hidden rounded-lg bg-neutral-900 px-8 py-10 text-white sm:px-14">
        <div className="max-w-xs">
          <div className="mb-4 flex items-center gap-3 text-sm text-neutral-300">
            <span>Apple iPhone 16 Series</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Up to 10%
            <br />
            off Voucher
          </h1>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 border-b border-white pb-1 text-sm"
          >
            Shop Now <ChevronRight size={14} />
          </a>
        </div>
        <img
          src="https://i.ebayimg.com/images/g/em4AAeSwTVFqOP4l/s-l1600.webp"
          alt="Featured product"
          className="hidden h-40 w-40 rounded-xl object-cover sm:block"
        />
      </div>
    </section>
  );
}

// ---------- Flash Sales ----------
function FlashSales({ products }) {
  const [time, setTime] = useState({ d: 3, h: 23, m: 19, s: 56 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((t) => {
        let { d, h, m, s } = t;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
            else {
              h = 23;
              if (d > 0) d--;
            }
          }
        }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionTag>Today's</SectionTag>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Flash Sales
        </h2>
        <div className="flex items-center gap-3 sm:gap-6">
          <CountdownBlock label="Days" value={time.d} />
          <span className="text-red-500">:</span>
          <CountdownBlock label="Hours" value={time.h} />
          <span className="text-red-500">:</span>
          <CountdownBlock label="Minutes" value={time.m} />
          <span className="text-red-500">:</span>
          <CountdownBlock label="Seconds" value={time.s} />
        </div>
        <div className="hidden gap-2 sm:flex">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">
            <ChevronLeft size={16} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <ViewAllButton />
    </section>
  );
}

// ---------- Categories ----------
function Categories() {
  return (
    <section className="mx-auto max-w-6xl border-b border-neutral-200 px-4 pb-14">
      <SectionTag>Categories</SectionTag>
      <h2 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Browse By Category
      </h2>
      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {categories.map((c) => (
          <button
            key={c.id}
            className="flex flex-col items-center justify-center gap-3 rounded-md border border-neutral-200 py-6 text-sm text-neutral-700 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
          >
            <span className="text-2xl">{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>
    </section>
  );
}

// ---------- Best Selling ----------
function BestSelling({ products }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionTag>This Month</SectionTag>
      <div className="mt-4 flex items-end justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Best Selling Products
        </h2>
        <button className="rounded bg-red-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-600">
          View All
        </button>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

// ---------- Promo banner ----------
function PromoBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="relative flex flex-col items-start justify-center overflow-hidden rounded-lg bg-neutral-900 px-8 py-16 text-white sm:flex-row sm:items-center sm:justify-between sm:px-16">
        <div className="max-w-sm">
          <span className="text-sm font-medium text-emerald-400">
            Categories
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-snug sm:text-4xl">
            Enhance Your Music Experience
          </h2>
          <div className="mt-6 flex gap-3">
            {["23", "05", "59", "35"].map((v, i) => (
              <div
                key={i}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-neutral-900"
              >
                {v}
              </div>
            ))}
          </div>
          <button className="mt-8 rounded bg-emerald-500 px-8 py-3 text-sm font-medium hover:bg-emerald-600">
            Buy Now!
          </button>
        </div>
        <img
          src="https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/52/3272604/1.jpg?3302"
          alt="Speaker"
          className="mt-8 hidden h-44 w-56 rounded-lg object-cover sm:block"
        />
      </div>
    </section>
  );
}

// ---------- Explore products ----------
function Explore({ products }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionTag>Our Products</SectionTag>
      <div className="mt-4 flex items-end justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Explore Our Products
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <ViewAllButton children="View All Products" />
    </section>
  );
}

// ---------- New arrival ----------
function NewArrival() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionTag>Featured</SectionTag>
      <h2 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        New Arrival
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
        <div className="relative row-span-2 overflow-hidden rounded-lg">
          <img
            src="https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/37/4215014/1.jpg?6935"
            alt="Console"
            className="h-full min-h-[300px] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <p className="text-lg font-semibold">PlayStation 5</p>
            <p className="mt-1 text-xs text-neutral-200">
              Black and White version of the PS5 coming out on sale.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src="https://i.ebayimg.com/images/g/9xYAAeSw5Jpp6wtZ/s-l1600.webp"
            alt="Perfume"
            className="h-full min-h-[140px] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
            <p className="font-semibold">Women's Collection</p>
            <p className="text-xs text-neutral-200">
              Featured woman collections
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src="https://i.ebayimg.com/images/g/ESUAAeSwtAZqLEh8/s-l1600.webp"
              alt="Speaker"
              className="h-full min-h-[140px] w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <p className="text-sm font-semibold">Speakers</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR8dtntjNNMAmwOh8YMom6e4OkO1hs094-5VjjffZ27gEt3WM_fsGMedIw&s=10"
              alt="Perfume bottle"
              className="h-full min-h-[140px] w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <p className="text-sm font-semibold">Perfume</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Features ----------
function Features() {
  const items = [
    {
      icon: Truck,
      title: "Free and Fast Delivery",
      text: "Free delivery for all orders over $140",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Service",
      text: "Friendly 24/7 customer support",
    },
    {
      icon: ShieldCheck,
      title: "Money Back Guarantee",
      text: "We return money within 30 days",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white ring-8 ring-neutral-200">
              <Icon size={26} />
            </div>
            <p className="mt-4 text-sm font-semibold text-neutral-900">
              {title}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 text-sm sm:grid-cols-5">
        <div>
          <p className="text-lg font-semibold text-white">eShop</p>
          <p className="mt-4 text-neutral-400">Subscribe</p>
          <p className="mt-1 text-xs text-neutral-500">
            Get 10% off your first order
          </p>
        </div>
        <div>
          <p className="mb-4 font-medium text-white">Support</p>
          <ul className="space-y-2 text-neutral-400">
            <li>111 Lagos, Nigeria</li>
            <li>[email protected]</li>
            <li>+224661615859</li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-medium text-white">Account</p>
          <ul className="space-y-2 text-neutral-400">
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-medium text-white">Quick Link</p>
          <ul className="space-y-2 text-neutral-400">
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-medium text-white">Download App</p>
          <div className="h-20 w-28 rounded bg-neutral-800" />
        </div>
      </div>
      <div className="border-t border-neutral-800 py-5 text-center text-xs text-neutral-500">
        © 2026 eShop. All rights reserved.
      </div>
    </footer>
  );
}

// ---------- Page ----------
export default function ECommerceHome() {
  const [apiProducts, setApiProducts] = useState([]);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(PRODUCTS_API_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Products request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        const products = Array.isArray(data)
          ? data
          : data.value || data.products;
        if (!Array.isArray(products)) {
          throw new Error("Products response is not an array");
        }
        setApiProducts(products.map(normalizeProduct));
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setApiError(
            "Showing featured products while the catalog is unavailable.",
          );
        }
      });

    return () => controller.abort();
  }, []);

  const products = apiProducts.length ? apiProducts : fallbackProducts;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <Header />
      <Hero />
      {apiError && (
        <p className="mx-auto max-w-6xl px-4 text-xs text-neutral-500">
          {apiError}
        </p>
      )}
      <FlashSales products={products} />
      <Categories />
      <BestSelling products={products} />
      <PromoBanner />
      <Explore products={products} />
      <NewArrival />
      <Features />
      <Footer />
    </div>
  );
}
