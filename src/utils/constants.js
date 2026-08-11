// Central configuration for GJ Events website.
// B2B portal URL for the external portal experience.
export const B2B_PORTAL_URL = "https://script.google.com/macros/s/AKfycbz1-Z90D4n_ZPPraFusIzBmaE6GXGHHuz6LV_XzADAAwkxefTvz34Y_WWGItLb5IjoV1w/exec";

export const BRAND = {
  name: "GJ Events",
  tagline: "Professional Event Management",
  poweredBy: "Auctus Tech"
};

// Hero slideshow slides
export const HERO_SLIDES = [
  {
    id: "garba",
    label: "Garba Night",
    image: "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/5ca24ef02_generated_9c0696f6.png"
  },
  {
    id: "live",
    label: "Live Event",
    image: "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/0b556ac1b_generated_f3be1812.png"
  },
  {
    id: "concert",
    label: "Concert",
    image: "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/bef8cac53_generated_86f71f96.png"
  },
  {
    id: "vip",
    label: "VIP Pass",
    image: "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/ec8718005_generated_0b81c7bf.png"
  },
  {
    id: "stall",
    label: "Stall Bazaar",
    image: "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/ad31c6bfb_generated_8ac02ce9.png"
  }
];

// About imagery
export const ABOUT_IMAGE =
  "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/2bf3baf8e_generated_a1dc1946.png";

// Gallery items
export const GALLERY_ITEMS = [
  ...HERO_SLIDES.map((s) => ({
    id: `g-${s.id}`,
    src: s.image,
    alt: `GJ Events ${s.label} — premium event management`
  })),
  {
    id: "g-about",
    src: ABOUT_IMAGE,
    alt: "GJ Events luxury event setup — premium decoration"
  }
];

// Contact cards
export const CONTACTS = [
  {
    name: "Dhrumil Patel",
    role: "Pass & Stall Related Information",
    phone: "+91 9104005719",
    tel: "+919104005719"
  },
  {
    name: "Rudra Patel",
    role: "Technical Support",
    phone: "+91 9909729830",
    tel: "+919909729830"
  },
  {
    name: "Jeel Patel",
    role: "Purchase Passes / Stall",
    phone: "+91 9712428194",
    tel: "+919712428194"
  },
  {
    name: "Rudra Darji",
    role: "Purchase Passes / Stall",
    phone: "+91 9978980281",
    tel: "+919978980281"
  }
];
