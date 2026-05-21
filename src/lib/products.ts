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
import kitPmaBmwMotosportJeans from "@/assets/kit-pma-bmw-motosport-jeans.png";
import kitPmaBmwMotosportCinza1 from "@/assets/kit-pma-bmw-motosport-cinza-1.png";
import kitPmaBmwMotosportCinza2 from "@/assets/kit-pma-bmw-motosport-cinza-2.png";
import kitNkAcademySlideBone from "@/assets/kit-nk-academy-slide-bone.png";
import kitTommyVelejadorVermelho from "@/assets/kit-tommy-velejador-vermelho.png";
import kitHilfigerNavy1 from "@/assets/kit-hilfiger-navy-1.png";
import kitHilfigerNavy2 from "@/assets/kit-hilfiger-navy-2.png";
import boneTommyVermelho1 from "@/assets/bone-tommy-vermelho-1.png";
import boneTommyVermelho2 from "@/assets/bone-tommy-vermelho-2.png";
import kitNkSportswearLacoste1 from "@/assets/kit-nk-sportswear-lacoste-1.png";
import kitNkSportswearLacoste2 from "@/assets/kit-nk-sportswear-lacoste-2.png";
import jaquetaTommyVelejador1 from "@/assets/jaqueta-tommy-velejador-1.png";
import jaquetaTommyModeloAntigo1 from "@/assets/jaqueta-tommy-modelo-antigo-1.png";
import jaquetaTommyModeloAntigo2 from "@/assets/jaqueta-tommy-modelo-antigo-2.png";
import jaquetaTommyModeloAntigo3 from "@/assets/jaqueta-tommy-modelo-antigo-3.png";
import jaquetaTommyModeloAntigo4 from "@/assets/jaqueta-tommy-modelo-antigo-4.png";
import jaquetaTommyBranca1 from "@/assets/jaqueta-tommy-branca-1.png";
import jaquetaTommyBranca2 from "@/assets/jaqueta-tommy-branca-2.png";
import jaquetaTommyBranca3 from "@/assets/jaqueta-tommy-branca-3.png";
import jaquetaTommyBranca4 from "@/assets/jaqueta-tommy-branca-4.png";
import jaquetaTommyVermelha1 from "@/assets/jaqueta-tommy-vermelha-1.png";
import jaquetaTommyVermelha2 from "@/assets/jaqueta-tommy-vermelha-2.png";
import jaquetaTommyVermelha3 from "@/assets/jaqueta-tommy-vermelha-3.png";
import jaquetaTommyVermelha4 from "@/assets/jaqueta-tommy-vermelha-4.png";
import jaquetaTommyVelejador2 from "@/assets/jaqueta-tommy-velejador-2.png";
import boneTommyBigLogo from "@/assets/bone-tommy-big-logo.png";
import boneTommySince1985_1 from "@/assets/bone-tommy-since-1985-1.png";
import boneTommySince1985_2 from "@/assets/bone-tommy-since-1985-2.png";
import kit5CamisetasNk1 from "@/assets/kit-5-camisetas-nk-1.png";
import kit5CamisetasNk2 from "@/assets/kit-5-camisetas-nk-2.png";

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
  { slug: "slide-lcst-nuvem-branco", title: "Slide Lcst Nuvem Branco", price: "5,00", oldPrice: "349,99", installment: "0,50", off: "69% OFF", kind: "footwear", category: "slides", sold: 8523, stock: 7, img: "https://visionariostore.com.br/cdn/shop/files/71E96DDB-DFE6-4E3E-91DE-A27B21911C46.jpg?v=1774982966&width=1200" },
  { slug: "combo-kit-3-blusas-zip-tommy", title: "Jaqueta Tommy Velejador Sustainable", price: "149,99", oldPrice: "899,99", installment: "14,97", off: "83% OFF", kind: "clothing", category: "jaquetas-e-moletons", sold: 2110, stock: 12, img: jaquetaTommyVelejador1, images: [jaquetaTommyVelejador1, jaquetaTommyVelejador2] },
  { slug: "kit-completo-lcst-sportswear", title: "Kit Completo Lcst Sportswear", price: "149,99", oldPrice: "749,99", installment: "14,97", off: "80% OFF", kind: "kit", category: "kits-completos", sold: 3421, stock: 9, img: kitLcstSportswear },
  { slug: "kit-tommy-velejador-2026-v3", title: "Jaqueta branca Tommy Velejador Modelo Antigo", price: "159,99", oldPrice: "664,99", installment: "15,97", off: "76% OFF", kind: "kit", category: "kits-completos", sold: 4188, stock: 6, img: jaquetaTommyBranca1, images: [jaquetaTommyBranca1, jaquetaTommyBranca2, jaquetaTommyBranca3, jaquetaTommyBranca4] },
  { slug: "jaqueta-nasa", title: "Jaqueta Nasa - A do Momento", price: "99,99", oldPrice: "", installment: "9,98", off: "", kind: "clothing", category: "jaquetas-e-moletons", sold: 1722, stock: 14, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6555_1f76a074-c8eb-40b2-abb6-828a13e3b0cd.png?v=1775623906&width=1200" },
  { slug: "shorts-nk-praia", title: "Shorts Nk Praia", price: "99,99", oldPrice: "289,99", installment: "9,98", off: "66% OFF", kind: "clothing", category: "bermudas-e-shorts", sold: 2603, stock: 18, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  { slug: "kit-3-bones-pma-bmw", title: "Kit 3 Bonés Pma BMW Motosport", price: "129,99", oldPrice: "259,99", installment: "12,98", off: "50% OFF", kind: "accessory", category: "acessorios", sold: 980, stock: 22, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "jaqueta-tommy-velejador", title: "Jaqueta Tommy Velejador Modelo Antigo", price: "139,99", oldPrice: "999,00", installment: "13,97", off: "86% OFF", kind: "clothing", category: "jaquetas-e-moletons", sold: 3088, stock: 8, img: jaquetaTommyModeloAntigo1, images: [jaquetaTommyModeloAntigo1, jaquetaTommyModeloAntigo2, jaquetaTommyModeloAntigo3, jaquetaTommyModeloAntigo4] },
  { slug: "kit-tommy-velejador-2026", title: "Kit Completo hilfiger  Velejador 2026", price: "179,99", oldPrice: "1.350,00", installment: "17,97", off: "87% OFF", kind: "kit", category: "kits-completos", sold: 1455, stock: 5, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6622.png?v=1775625999&width=1200" },
  { slug: "kit-completo-lcst", title: "Kit Completo Pma BMW Motosport", price: "139,99", oldPrice: "899,00", installment: "13,97", off: "84% OFF", kind: "kit", category: "kits-completos", sold: 1899, stock: 7, img: kitPmaBmwMotosportJeans },
  { slug: "kit-pma-bmw-m-4-pecas", title: "Kit Completo Pma BMW Motosport", price: "139,99", oldPrice: "999,00", installment: "13,97", off: "86% OFF", kind: "kit", category: "kits-completos", sold: 2244, stock: 10, img: kitPmaBmwMotosportCinza1, images: [kitPmaBmwMotosportCinza1, kitPmaBmwMotosportCinza2] },
  { slug: "kit-nk-academy-slide-bone", title: "Kit NK Academy Completo com Slide e Boné", price: "99,99", oldPrice: "499,00", installment: "9,98", off: "80% OFF", kind: "kit", category: "kits-completos", sold: 3501, stock: 11, img: kitNkAcademySlideBone },
  { slug: "camiseta-nk-worldtour", title: "Camiseta NK Worldtour", price: "59,99", oldPrice: "240,00", installment: "5,99", off: "76% OFF", kind: "clothing", category: "camisetas", sold: 1500, stock: 20, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  { slug: "calca-jeans-city-denim", title: "Calça Jeans City Denim", price: "79,99", oldPrice: "300,00", installment: "7,99", off: "80% OFF", kind: "clothing", category: "calcas", sold: 900, stock: 15, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6615.png?v=1775625469&width=1200" },
  { slug: "sandalia-croc-classic", title: "Sandália Croc Classic", price: "59,90", oldPrice: "190,00", installment: "5,98", off: "70% OFF", kind: "footwear", category: "crocs", sold: 4200, stock: 25, img: "https://visionariostore.com.br/cdn/shop/files/71E96DDB-DFE6-4E3E-91DE-A27B21911C46.jpg?v=1774982966&width=1200" },
  { slug: "chinelo-nk-victori-one", title: "Chinelo NK Slide Victori One", price: "59,99", oldPrice: "190,00", installment: "5,99", off: "70% OFF", kind: "footwear", category: "slides", sold: 3300, stock: 18, img: "https://visionariostore.com.br/cdn/shop/files/71E96DDB-DFE6-4E3E-91DE-A27B21911C46.jpg?v=1774982966&width=1200" },
  { slug: "kit-nk-academy", title: "Jaqueta vermelha Tommy Velejador Modelo Antigo", price: "99,99", oldPrice: "199,99", installment: "9,99", off: "50% OFF", kind: "kit", category: "kits-completos", sold: 2100, stock: 14, img: jaquetaTommyVermelha1, images: [jaquetaTommyVermelha1, jaquetaTommyVermelha2, jaquetaTommyVermelha3, jaquetaTommyVermelha4] },
  { slug: "bone-lcst-miami-open", title: "Boné Lcst Miami Open 2026", price: "99,99", oldPrice: "299,99", installment: "9,99", off: "67% OFF", kind: "accessory", category: "acessorios", sold: 980, stock: 25, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "bone-pma-motosport-bmw", title: "Boné Pma Motosport BMW", price: "99,99", oldPrice: "199,99", installment: "9,99", off: "50% OFF", kind: "accessory", category: "acessorios", sold: 760, stock: 18, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6607.png?v=1775624965&width=1200" },
  { slug: "bone-tommy-plaquinha", title: "Boné Tommy Plaquinha", price: "89,99", oldPrice: "299,99", installment: "8,99", off: "70% OFF", kind: "accessory", category: "acessorios", sold: 1200, stock: 30, img: boneTommyVermelho1, images: [boneTommyVermelho1, boneTommyVermelho2] },
  
  { slug: "kit-5-camisetas-nk-academy", title: "Kit 5 Camisetas NK Academy Dri-Fit", price: "99,99", oldPrice: "899,99", installment: "9,99", off: "89% OFF", kind: "clothing", category: "camisetas", sold: 3400, stock: 22, img: kit5CamisetasNk1, images: [kit5CamisetasNk1, kit5CamisetasNk2] },
  { slug: "kit-4-camisas-nk-academy", title: "Kit 4 Camisas NK Academy", price: "59,99", oldPrice: "299,99", installment: "5,99", off: "80% OFF", kind: "clothing", category: "camisetas", sold: 4200, stock: 30, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6605.png?v=1775624827&width=1200" },
  
  { slug: "tenis-pma-caven-ferrari", title: "Tênis Pma Caven Ferrari", price: "139,99", oldPrice: "549,99", installment: "13,99", off: "75% OFF", kind: "footwear", category: "sneakers", sold: 2800, stock: 8, img: tenisPmaCavenFerrari, images: [tenisPmaCavenFerrari, tenisPmaCavenFerrari2] },
  { slug: "tenis-nk-court-borough-low-2", title: "Tênis NK Court Borough Low 2", price: "139,99", oldPrice: "449,99", installment: "13,99", off: "69% OFF", kind: "footwear", category: "sneakers", sold: 3100, stock: 11, img: tenisNkCourtBorough1, images: [tenisNkCourtBorough1, tenisNkCourtBorough2, tenisNkCourtBorough3, tenisNkCourtBorough4] },
  { slug: "tenis-pma-ca-pro", title: "Tênis Pma CA Pro", price: "159,99", oldPrice: "599,99", installment: "15,99", off: "73% OFF", kind: "footwear", category: "sneakers", sold: 2200, stock: 9, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6555_1f76a074-c8eb-40b2-abb6-828a13e3b0cd.png?v=1775623906&width=1200" },
  { slug: "jaqueta-tommy-azul-royal", title: "Boné Tommy Big Logo", price: "139,99", oldPrice: "799,99", installment: "13,99", off: "82% OFF", kind: "accessory", category: "acessorios", sold: 1100, stock: 7, img: boneTommyBigLogo },
  { slug: "jaqueta-tommy-corta-vento", title: "Boné Tommy Since 1985", price: "149,99", oldPrice: "799,99", installment: "14,99", off: "81% OFF", kind: "accessory", category: "acessorios", sold: 1340, stock: 6, img: boneTommySince1985_1, images: [boneTommySince1985_1, boneTommySince1985_2] },
  { slug: "kit-completo-nk-sportswear", title: "Kit Completo NK Sportswear", price: "149,99", oldPrice: "799,99", installment: "14,97", off: "81% OFF", kind: "kit", category: "kits-completos", sold: 1620, stock: 8, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6603.png?v=1775624725&width=1200" },
  { slug: "kit-completo-nk-academy-4-pecas", title: "Kit Completo NK Academy 4 Peças", price: "159,99", oldPrice: "699,99", installment: "15,97", off: "77% OFF", kind: "kit", category: "kits-completos", sold: 1480, stock: 7, img: "https://visionariostore.com.br/cdn/shop/files/IMG_6618.png?v=1775625574&width=1200" },
  { slug: "kit-completo-nk-sportswear-lacoste", title: "KIT COMPLETO NK SPORTSWEAR", price: "159,99", oldPrice: "749,99", installment: "15,97", off: "78% OFF", kind: "kit", category: "kits-completos", sold: 1200, stock: 10, img: kitNkSportswearLacoste1, images: [kitNkSportswearLacoste1, kitNkSportswearLacoste2] },
  
  { slug: "bone-lcst-sport-diamante", title: "Boné Lcst Sport Diamante (Modelo Novo)", price: "99,99", oldPrice: "299,99", installment: "9,99", off: "67% OFF", kind: "accessory", category: "acessorios", sold: 860, stock: 18, img: boneLcstSportDiamante },
];

export const tommyProducts = products.filter(p => /tommy/i.test(p.title));
import conjuntoNkAcademy1 from "@/assets/conjunto-nk-academy-1.png";
import conjuntoNkAcademy2 from "@/assets/conjunto-nk-academy-2.png";
import conjuntoNkAcademy3 from "@/assets/conjunto-nk-academy-3.png";
import conjuntoNkAcademy2025 from "@/assets/conjunto-nk-academy-2025.png";
export const nikeAcademy = products.filter(p => /nk academy|academy/i.test(p.title)).map((p) => {
  if (p.slug === "kit-4-camisas-nk-academy") {
    return {
      ...p,
      slug: "kit-4-camisas-nk-academy-nike",
      title: "Conjunto NK Academy",
      img: conjuntoNkAcademy1,
      images: [conjuntoNkAcademy1, conjuntoNkAcademy2, conjuntoNkAcademy3],
    };
  }
  if (p.slug === "kit-completo-nk-academy-4-pecas") {
    return {
      ...p,
      slug: "kit-completo-nk-academy-4-pecas-nike",
      title: "Conjunto NK Academy Modelo 2025",
      img: conjuntoNkAcademy2025,
      images: [conjuntoNkAcademy2025],
    };
  }
  return p;
});
import boneLcst2Faixas1 from "@/assets/bone-lcst-2-faixas-1.png";
import boneLcst2Faixas2 from "@/assets/bone-lcst-2-faixas-2.png";
import boneLcst2Faixas3 from "@/assets/bone-lcst-2-faixas-3.png";
import boneLcstSport1 from "@/assets/bone-lcst-sport-1.png";
import boneLcstSport2 from "@/assets/bone-lcst-sport-2.png";
import boneLcstSport3 from "@/assets/bone-lcst-sport-3.png";
import boneLcstSport4 from "@/assets/bone-lcst-sport-4.png";
import boneLcstSport5 from "@/assets/bone-lcst-sport-5.png";
import boneLcstSport6 from "@/assets/bone-lcst-sport-6.png";
import bonePmaBmw1 from "@/assets/bone-pma-bmw-1.png";
import bonePmaBmw2 from "@/assets/bone-pma-bmw-2.png";
import boneLcstSportPreto1 from "@/assets/bone-lcst-sport-preto-1.png";
import boneLcstSportPreto2 from "@/assets/bone-lcst-sport-preto-2.png";
import boneLcstSportPreto3 from "@/assets/bone-lcst-sport-preto-3.png";
import boneLcstSportPreto4 from "@/assets/bone-lcst-sport-preto-4.png";
import boneLcstSportPreto5 from "@/assets/bone-lcst-sport-preto-5.png";
export const bones = products.filter(p => /bon[ée]/i.test(p.title)).map((p) => {
  if (p.slug === "kit-nk-academy-slide-bone") {
    return {
      ...p,
      slug: "kit-nk-academy-slide-bone-bones",
      title: "Boné Lcst Sport preto",
      img: boneLcstSportPreto1,
      images: [boneLcstSportPreto1, boneLcstSportPreto2, boneLcstSportPreto3, boneLcstSportPreto4, boneLcstSportPreto5],
    };
  }
  if (p.slug === "kit-3-bones-pma-bmw") {
    return {
      ...p,
      slug: "kit-3-bones-pma-bmw-bones",
      title: "Boné Pma BMW Motosport",
      img: bonePmaBmw1,
      images: [bonePmaBmw1, bonePmaBmw2],
    };
  }
  if (p.slug === "bone-lcst-miami-open") {
    return {
      ...p,
      slug: "bone-lcst-miami-open-bones",
      title: "Boné Lcst Sport 2 Faixas Original (Peça única)",
      img: boneLcst2Faixas1,
      images: [boneLcst2Faixas1, boneLcst2Faixas2, boneLcst2Faixas3],
    };
  }
  if (p.slug === "bone-pma-motosport-bmw") {
    return {
      ...p,
      slug: "bone-pma-motosport-bmw-bones",
      title: "Boné Lcst Sport (Peça única)",
      img: boneLcstSport1,
      images: [boneLcstSport1, boneLcstSport2, boneLcstSport3, boneLcstSport4, boneLcstSport5, boneLcstSport6],
    };
  }
  return p;
});
import tenisPmaCaven2_1 from "@/assets/tenis-pma-caven-2-1.png";
import tenisPmaCaven2_2 from "@/assets/tenis-pma-caven-2-2.png";
import tenisCaProCaven3 from "@/assets/tenis-ca-pro-caven-3.png";
import tenisPmaCavenBmw1 from "@/assets/tenis-pma-caven-bmw-1.png";
import tenisPmaCavenBmw2 from "@/assets/tenis-pma-caven-bmw-2.png";
const tenisPmaCavenBmw: Product = {
  slug: "tenis-pma-caven-bmw-sneakers",
  title: "Tênis Pma Caven BMW",
  price: "139,99",
  oldPrice: "549,99",
  installment: "13,97",
  off: "75% OFF",
  kind: "footwear",
  category: "sneakers",
  sold: 4334,
  stock: 12,
  img: tenisPmaCavenBmw1,
  images: [tenisPmaCavenBmw1, tenisPmaCavenBmw2],
};
export const sneakers = [...products.filter(p => p.category === "sneakers").map((p) => {
  if (p.slug === "tenis-nk-court-borough-low-2") {
    return {
      ...p,
      slug: "tenis-nk-court-borough-low-2-sneakers",
      title: "Tênis Pma Caven 2.0 Ferrari",
      img: tenisPmaCaven2_1,
      images: [tenisPmaCaven2_1, tenisPmaCaven2_2],
    };
  }
  if (p.slug === "tenis-pma-ca-pro") {
    return {
      ...p,
      slug: "tenis-pma-ca-pro-sneakers",
      img: tenisCaProCaven3,
      images: [tenisCaProCaven3],
    };
  }
  return p;
}), tenisPmaCavenBmw];

const FEATURED_EXTRA_SLUGS = [
  "tenis-pma-caven-ferrari",
  "bone-lcst-sport-diamante",
  "tenis-nk-court-borough-low-2",
];

export const featured = [
  ...products.slice(0, 8).map((p) => {
    if (p.slug === "kit-completo-lcst-sportswear") {
      return { ...p, slug: "kit-completo-lcst-sportswear-featured", img: kitLcstFeatured };
    }
    if (p.slug === "combo-kit-3-blusas-zip-tommy") {
      return {
        ...p,
        slug: "combo-kit-3-blusas-zip-tommy-featured",
        title: "Combo Kit 3 Blusas Meio Zíper Tommy",
        img: "https://visionariostore.com.br/cdn/shop/files/IMG_6553.png?v=1775623742&width=1200",
        images: undefined,
      };
    }
    if (p.slug === "jaqueta-tommy-velejador") {
      return {
        ...p,
        slug: "jaqueta-tommy-velejador-featured",
        title: "Jaqueta Tommy Velejador Sustainable",
        img: "https://visionariostore.com.br/cdn/shop/files/IMG_6615.png?v=1775625469&width=1200",
        images: undefined,
      };
    }
    if (p.slug === "kit-tommy-velejador-2026-v3") {
      return {
        ...p,
        slug: "kit-tommy-velejador-2026-v3-featured",
        title: "KIT COMPLETO TOMMY VELEJADOR 2026",
        img: kitHilfigerNavy1,
        images: [kitHilfigerNavy1, kitHilfigerNavy2],
      };
    }
    return p;
  }),
  ...FEATURED_EXTRA_SLUGS
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p)),
];
export const kits = products.filter((p) => p.kind === "kit").map((p) => {
  if (p.slug === "kit-tommy-velejador-2026-v3") {
    return { ...p, slug: "kit-tommy-velejador-2026-v3-kits", title: "KIT COMPLETO TOMMY VELEJADOR 2026", img: kitHilfigerNavy1, images: [kitHilfigerNavy1, kitHilfigerNavy2] };
  }
  if (p.slug === "kit-nk-academy") {
    return { ...p, slug: "kit-nk-academy-kits", title: "KIT COMPLETO TOMMY VELEJADOR 2026", img: kitTommyVelejadorVermelho, images: undefined };
  }
  return p;
});

export const SHOE_SIZES = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43"];
export const CLOTHING_SIZES = ["P", "M", "G", "GG"];

export function getProduct(slug: string) {
  return [...featured, ...products, ...sneakers, ...kits].find((p) => p.slug === slug);
}
