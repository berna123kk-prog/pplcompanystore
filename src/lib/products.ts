import kitLcstSportswear from "@/assets/kit-lcst-sportswear.png";
import kitLcstFeatured from "@/assets/kit-lcst-featured.png";
import kitPma5Pecas from "@/assets/kit-pma-5-pecas.png";
import tenisPmaCavenFerrari from "@/assets/tenis-pma-caven-ferrari.png";
import tenisPmaCavenFerrari2 from "@/assets/tenis-pma-caven-ferrari-2.png";
import boneLcstSportDiamante from "@/assets/bone-lcst-sport-diamante.png";
import tenisNkCourtBorough1 from "@/assets/tenis-nk-court-borough-1.png";
import tenisNkCourtBorough2 from "@/assets/tenis-nk-court-borough-2.png";
import tenisNkCourtBorough3 from "@/assets/tenis-nk-court-borough-3.png";
import tenisNkCourtBorough4 from "@/assets/tenis-nk-court-borough-4.png";
import kitPmaMercedes1 from "@/assets/kit-pma-mercedes-1.png";
import kitPmaMercedes2 from "@/assets/kit-pma-mercedes-2.png";
import kitPmaBmwM1 from "@/assets/kit-pma-bmw-m-1.png";
import kitPmaBmwM2 from "@/assets/kit-pma-bmw-m-2.png";
import kitTommyHilfiger1 from "@/assets/kit-tommy-hilfiger-1.png";
import kitTommyHilfiger2 from "@/assets/kit-tommy-hilfiger-2.png";

export type ProductKind = "footwear" | "clothing" | "kit" | "accessory";

export type CategorySlug =
  | "camisetas"
  | "jaquetas-e-moletons"
  | "calcas"
  | "bermudas-e-shorts"
  | "kits-completos"
  | "slides"
  | "crocs"
  | "sneakers"
  | "acessorios"
  | "perfumes";

export type Product = {
  slug: string;
  title: string;
  price: string;
  oldPrice: string;
  installment: string;
  off: string;
  img: string;
  images?: string[];
  kind: ProductKind;
  category: CategorySlug;
  sold?: number;
  stock?: number;
};

export const CLOTHING_CATEGORIES: CategorySlug[] = [
  "camisetas",
  "jaquetas-e-moletons",
  "calcas",
  "bermudas-e-shorts",
  "kits-completos",
];

export const COLLECTIONS: Record<string, { title: string; filter: (p: Product) => boolean }> = {
  vestuario: { title: "Vestuário", filter: (p) => CLOTHING_CATEGORIES.includes(p.category) },
  camisetas: { title: "Camisetas", filter: (p) => p.category === "camisetas" },
  "jaquetas-e-moletons": { title: "Jaquetas e Moletons", filter: (p) => p.category === "jaquetas-e-moletons" },
  calcas: { title: "Calças", filter: (p) => p.category === "calcas" },
  "bermudas-e-shorts": { title: "Bermudas e Shorts", filter: (p) => p.category === "bermudas-e-shorts" },
  "kits-completos": { title: "Kits Completos", filter: (p) => p.category === "kits-completos" },
  slides: { title: "Slides", filter: (p) => p.category === "slides" },
  crocs: { title: "Crocs", filter: (p) => p.category === "crocs" },
  sneakers: { title: "Sneakers", filter: (p) => p.category === "sneakers" },
  acessorios: { title: "Acessórios", filter: (p) => p.category === "acessorios" },
  perfumes: { title: "Perfumes", filter: (p) => p.category === "perfumes" },
};

export const products: Product[] = [
  { slug: "slide-lcst-nuvem-branco", title: "Slide Lcst Nuvem Branco", price: "109,99", oldPrice: "349,99", installment: "10,98", off: "69% OFF", kind: "footwear", category: "slides", sold: 8523, stock: 7, img: "https://visionariostore.com.br/cdn/shop/files/71E96DDB-DFE6-4E3E-91DE-A27B21911C46.jpg?v=1774982966&width=1200" },
  { slug: "combo-kit-3-blusas-zip-tommy", title: "Combo Kit 3 Blusas Meio Zíper Tommy", price: "149,99", oldPrice: "899,99", installment: "14,97", off: "83% OFF", kind: "clothing", category: "jaquetas-e-moletons", sold: 2110, stock: 12, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6553.png?v=1775623742&width=1200" },
  { slug: "kit-completo-lcst-sportswear", title: "Kit Completo Lcst Sportswear", price: "149,99", oldPrice: "749,99", installment: "14,97", off: "80% OFF", kind: "kit", category: "kits-completos", sold: 3421, stock: 9, img: kitLcstSportswear },
  { slug: "kit-completo-nk-sportswear", title: "Kit Completo Nk Sportswear", price: "159,99", oldPrice: "664,99", installment: "15,97", off: "76% OFF", kind: "kit", category: "kits-completos", sold: 4188, stock: 6, img: kitTommyHilfiger1, images: [kitTommyHilfiger1, kitTommyHilfiger2] },
  { slug: "jaqueta-nasa", title: "Jaqueta Nasa - A do Momento", price: "99,99", oldPrice: "", installment: "9,98", off: "", kind: "clothing", category: "jaquetas-e-moletons", sold: 1722, stock: 14, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6555_1f76a074-c8eb-40b2-abb6-828a13e3b0cd.png?v=1775623906&width=1200" },
  { slug: "shorts-nk-praia", title: "Shorts Nk Praia", price: "99,99", oldPrice: "289,99", installment: "9,98", off: "66% OFF", kind: "clothing", category: "bermudas-e-shorts", sold: 2603, stock: 18, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  { slug: "kit-3-bones-pma-bmw", title: "Kit 3 Bonés Pma BMW Motosport", price: "129,99", oldPrice: "259,99", installment: "12,98", off: "50% OFF", kind: "accessory", category: "acessorios", sold: 980, stock: 22, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "jaqueta-tommy-velejador", title: "Jaqueta Tommy Velejador Sustainable", price: "139,99", oldPrice: "999,00", installment: "13,97", off: "86% OFF", kind: "clothing", category: "jaquetas-e-moletons", sold: 3088, stock: 8, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6615.png?v=1775625469&width=1200" },
  { slug: "kit-tommy-velejador-2026", title: "Kit Completo Tommy Velejador 2026", price: "179,99", oldPrice: "1.350,00", installment: "17,97", off: "87% OFF", kind: "kit", category: "kits-completos", sold: 1455, stock: 5, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6622.png?v=1775625999&width=1200" },
  { slug: "kit-completo-lcst", title: "Kit Completo Lcst", price: "139,99", oldPrice: "899,00", installment: "13,97", off: "84% OFF", kind: "kit", category: "kits-completos", sold: 1899, stock: 7, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6601.png?v=1775624639&width=1200" },
  { slug: "kit-pma-bmw-m-4-pecas", title: "Kit Completo Pma BMW M 4 Peças", price: "139,99", oldPrice: "999,00", installment: "13,97", off: "86% OFF", kind: "kit", category: "kits-completos", sold: 2244, stock: 10, img: kitPmaBmwM1, images: [kitPmaBmwM1, kitPmaBmwM2] },
  { slug: "kit-nk-academy-slide-bone", title: "Kit NK Academy Completo com Slide e Boné", price: "99,99", oldPrice: "499,00", installment: "9,98", off: "80% OFF", kind: "kit", category: "kits-completos", sold: 3501, stock: 11, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6618.png?v=1775625574&width=1200" },
  { slug: "camiseta-nk-worldtour", title: "Camiseta NK Worldtour", price: "59,99", oldPrice: "240,00", installment: "5,99", off: "76% OFF", kind: "clothing", category: "camisetas", sold: 1500, stock: 20, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  { slug: "calca-jeans-city-denim", title: "Calça Jeans City Denim", price: "79,99", oldPrice: "300,00", installment: "7,99", off: "80% OFF", kind: "clothing", category: "calcas", sold: 900, stock: 15, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6615.png?v=1775625469&width=1200" },
  { slug: "sandalia-croc-classic", title: "Sandália Croc Classic", price: "59,90", oldPrice: "190,00", installment: "5,98", off: "70% OFF", kind: "footwear", category: "crocs", sold: 4200, stock: 25, img: "https://visionariostore.com.br/cdn/shop/files/71E96DDB-DFE6-4E3E-91DE-A27B21911C46.jpg?v=1774982966&width=1200" },
  { slug: "chinelo-nk-victori-one", title: "Chinelo NK Slide Victori One", price: "59,99", oldPrice: "190,00", installment: "5,99", off: "70% OFF", kind: "footwear", category: "slides", sold: 3300, stock: 18, img: "https://visionariostore.com.br/cdn/shop/files/71E96DDB-DFE6-4E3E-91DE-A27B21911C46.jpg?v=1774982966&width=1200" },
  { slug: "bone-tommy-plaquinha", title: "Boné Tommy Plaquinha", price: "89,99", oldPrice: "299,99", installment: "8,99", off: "70% OFF", kind: "accessory", category: "acessorios", sold: 1200, stock: 30, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "bone-lcst-miami-open", title: "Boné Lcst Miami Open 2026", price: "99,99", oldPrice: "299,99", installment: "9,99", off: "67% OFF", kind: "accessory", category: "acessorios", sold: 980, stock: 25, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "bone-pma-motosport-bmw", title: "Boné Pma Motosport BMW", price: "99,99", oldPrice: "199,99", installment: "9,99", off: "50% OFF", kind: "accessory", category: "acessorios", sold: 760, stock: 18, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "kit-nk-academy", title: "Kit NK Academy", price: "99,99", oldPrice: "199,99", installment: "9,99", off: "50% OFF", kind: "kit", category: "kits-completos", sold: 2100, stock: 14, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6618.png?v=1775625574&width=1200" },
  { slug: "combo-4-kits-nk-academy-dri-fit-23", title: "Combo 4 Kits NK Academy Dri-Fit 23", price: "149,99", oldPrice: "999,99", installment: "14,97", off: "85% OFF", kind: "kit", category: "kits-completos", sold: 1800, stock: 9, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6603.png?v=1775624725&width=1200" },
  { slug: "kit-5-camisetas-nk-academy", title: "Kit 5 Camisetas NK Academy Dri-Fit", price: "99,99", oldPrice: "899,99", installment: "9,99", off: "89% OFF", kind: "clothing", category: "camisetas", sold: 3400, stock: 22, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  { slug: "kit-4-camisas-nk-academy", title: "Kit 4 Camisas NK Academy", price: "59,99", oldPrice: "299,99", installment: "5,99", off: "80% OFF", kind: "clothing", category: "camisetas", sold: 4200, stock: 30, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  { slug: "conjunto-nk-academy", title: "Conjunto NK Academy", price: "99,99", oldPrice: "249,99", installment: "9,99", off: "60% OFF", kind: "kit", category: "kits-completos", sold: 1500, stock: 12, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6618.png?v=1775625574&width=1200" },
  { slug: "tenis-pma-caven-ferrari", title: "Tênis Pma Caven Ferrari", price: "139,99", oldPrice: "549,99", installment: "13,99", off: "75% OFF", kind: "footwear", category: "sneakers", sold: 2800, stock: 8, img: tenisPmaCavenFerrari, images: [tenisPmaCavenFerrari, tenisPmaCavenFerrari2] },
  { slug: "tenis-nk-court-borough-low-2", title: "Tênis NK Court Borough Low 2", price: "139,99", oldPrice: "449,99", installment: "13,99", off: "69% OFF", kind: "footwear", category: "sneakers", sold: 3100, stock: 11, img: tenisNkCourtBorough1, images: [tenisNkCourtBorough1, tenisNkCourtBorough2, tenisNkCourtBorough3, tenisNkCourtBorough4] },
  { slug: "tenis-pma-ca-pro", title: "Tênis Pma CA Pro", price: "159,99", oldPrice: "599,99", installment: "15,99", off: "73% OFF", kind: "footwear", category: "sneakers", sold: 2200, stock: 9, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6555_1f76a074-c8eb-40b2-abb6-828a13e3b0cd.png?v=1775623906&width=1200" },
  { slug: "jaqueta-tommy-azul-royal", title: "Jaqueta Tommy Azul Royal", price: "139,99", oldPrice: "799,99", installment: "13,99", off: "82% OFF", kind: "clothing", category: "jaquetas-e-moletons", sold: 1100, stock: 7, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6615.png?v=1775625469&width=1200" },
  { slug: "jaqueta-tommy-corta-vento", title: "Jaqueta Tommy Corta-Vento", price: "149,99", oldPrice: "799,99", installment: "14,99", off: "81% OFF", kind: "clothing", category: "jaquetas-e-moletons", sold: 1340, stock: 6, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6615.png?v=1775625469&width=1200" },
  { slug: "kit-completo-nk-sportswear", title: "Kit Completo NK Sportswear", price: "149,99", oldPrice: "799,99", installment: "14,97", off: "81% OFF", kind: "kit", category: "kits-completos", sold: 1620, stock: 8, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6603.png?v=1775624725&width=1200" },
  { slug: "kit-completo-nk-academy-4-pecas", title: "Kit Completo NK Academy 4 Peças", price: "159,99", oldPrice: "699,99", installment: "15,97", off: "77% OFF", kind: "kit", category: "kits-completos", sold: 1480, stock: 7, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6618.png?v=1775625574&width=1200" },
  { slug: "kit-completo-tommy-gringo", title: "Kit Completo Tommy Gringo", price: "149,99", oldPrice: "799,99", installment: "14,97", off: "81% OFF", kind: "kit", category: "kits-completos", sold: 1310, stock: 9, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6622.png?v=1775625999&width=1200" },
  { slug: "bone-lcst-sport-diamante", title: "Boné Lcst Sport Diamante (Modelo Novo)", price: "99,99", oldPrice: "299,99", installment: "9,99", off: "67% OFF", kind: "accessory", category: "acessorios", sold: 860, stock: 18, img: boneLcstSportDiamante },
];

export const tommyProducts = products.filter(p => /tommy/i.test(p.title));
export const nikeAcademy = products.filter(p => /nk academy|academy/i.test(p.title));
export const bones = products.filter(p => /bon[ée]/i.test(p.title));
export const sneakers = products.filter(p => p.category === "sneakers");

const FEATURED_EXTRA_SLUGS = [
  "tenis-pma-caven-ferrari",
  "bone-lcst-sport-diamante",
  "tenis-nk-court-borough-low-2",
];

export const featured = [
  ...products.slice(0, 8).map((p) =>
    p.slug === "kit-completo-lcst-sportswear"
      ? { ...p, slug: "kit-completo-lcst-sportswear-featured", img: kitLcstFeatured }
      : p
  ),
  ...FEATURED_EXTRA_SLUGS
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p)),
];
export const kits = products.filter((p) => p.kind === "kit");

export const SHOE_SIZES = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43"];
export const CLOTHING_SIZES = ["P", "M", "G", "GG"];

export function getProduct(slug: string) {
  return [...featured, ...products].find((p) => p.slug === slug);
}
