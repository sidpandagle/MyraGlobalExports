import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type ProductSpec = { label: string; value: string }

type StaticProduct = {
  name: string
  slug: string
  category: string
  tagline: string
  shortDescription: string
  fullDescription: string
  origin: string
  emoji: string
  accentColor: string
  specs: ProductSpec[]
  grades: string[]
  packaging: string[]
  certifications: string[]
  useCases: string[]
  relatedSlugs: string[]
}

const STATIC_PRODUCTS: Record<string, StaticProduct> = {
  'basmati-rice': {
    name: 'Basmati Rice',
    slug: 'basmati-rice',
    category: 'Grains',
    tagline: 'The aristocrat of rices.',
    shortDescription: 'Premium aged basmati with distinct aroma and long grain.',
    fullDescription:
      'Sourced from the Himalayan foothills of Punjab and Haryana, our basmati rice is aged for a minimum of 12 months to enhance its characteristic floral aroma and elongated grain. Each batch is sortex-cleaned and tested for moisture, broken grain percentage, and pesticide residue to meet EU and US import standards.',
    origin: 'Punjab & Haryana, India',
    emoji: '🌾',
    accentColor: '#C8882A',
    specs: [
      { label: 'Grain Length (raw)', value: '≥ 8.0 mm' },
      { label: 'Grain Length (cooked)', value: '≥ 17.0 mm' },
      { label: 'Moisture', value: '≤ 13%' },
      { label: 'Broken grains', value: '≤ 1%' },
      { label: 'Aging', value: '12–24 months' },
      { label: 'Crop year', value: '2024–25' },
    ],
    grades: ['1121 Steam', '1121 Raw', 'Traditional Raw', 'Pusa Steam', 'Sugandha'],
    packaging: ['5 kg PP bag', '10 kg jute bag', '25 kg non-woven bag', '50 kg jute bag', 'Custom private label'],
    certifications: ['APEDA', 'FSSAI', 'ISO 22000', 'Organic (on request)', 'Halal'],
    useCases: ['Premium retail', 'HoReCa', 'Food processing', 'Biryani & pilaf specialist'],
    relatedSlugs: ['wheat', 'pulses', 'cumin'],
  },
  turmeric: {
    name: 'Turmeric',
    slug: 'turmeric',
    category: 'Spices',
    tagline: 'Gold from Erode\'s black soils.',
    shortDescription: 'High curcumin content, bright golden colour from Erode.',
    fullDescription:
      'Erode, Tamil Nadu — the "Turmeric City" — produces the world\'s finest turmeric with curcumin content consistently above 3.5%. Our supply chain connects directly with farmer cooperatives to deliver finger and bulb varieties machine-cleaned and polished to export specification.',
    origin: 'Erode, Tamil Nadu & Nizamabad, Telangana',
    emoji: '🟡',
    accentColor: '#D4A017',
    specs: [
      { label: 'Curcumin content', value: '≥ 3.5%' },
      { label: 'Moisture', value: '≤ 10%' },
      { label: 'Total ash', value: '≤ 8%' },
      { label: 'Volatile oil', value: '≥ 3.5 ml/100g' },
      { label: 'Form', value: 'Finger / Bulb / Powder' },
      { label: 'Colour', value: 'Bright golden yellow' },
    ],
    grades: ['Alleppey Finger', 'Erode Finger', 'Rajapore', 'Sangli', 'Powder (100–200 mesh)'],
    packaging: ['1 kg retail pouch', '5 kg kraft bag', '25 kg PP bag', '50 kg jute bag', 'Bulk big-bag 500 kg'],
    certifications: ['APEDA', 'FSSAI', 'ISO 22000', 'Organic', 'Kosher', 'Halal'],
    useCases: ['Nutraceuticals', 'Food colouring', 'Ayurvedic formulations', 'Curry blends', 'Cosmetics'],
    relatedSlugs: ['cumin', 'red-chilli', 'coriander'],
  },
  cumin: {
    name: 'Cumin Seeds',
    slug: 'cumin',
    category: 'Spices',
    tagline: 'The soul of Indian cuisine.',
    shortDescription: 'Aromatic cumin sourced from the farms of Rajasthan.',
    fullDescription:
      'Gujarat and Rajasthan collectively account for over 70% of global cumin production. Our cumin is machine-cleaned through multi-pass sortex lines to achieve less than 0.1% extraneous matter, delivering consistent volatile oil content that defines the signature warm, earthy aroma prized by spice blenders worldwide.',
    origin: 'Unjha, Gujarat & Rajasthan, India',
    emoji: '🌱',
    accentColor: '#8B6914',
    specs: [
      { label: 'Volatile oil', value: '≥ 2.5 ml/100g' },
      { label: 'Moisture', value: '≤ 10%' },
      { label: 'Extraneous matter', value: '≤ 0.1%' },
      { label: 'Admixture', value: '≤ 0.5%' },
      { label: 'Colour', value: 'Greenish grey-brown' },
      { label: 'Cleaning', value: 'Multi-pass sortex' },
    ],
    grades: ['Europe Quality (EQ)', 'Singapore Quality (SQ)', 'FAQ', 'Machine Cleaned'],
    packaging: ['500 g retail', '5 kg bag', '25 kg PP bag', '50 kg bag', 'Custom label'],
    certifications: ['APEDA', 'FSSAI', 'Spices Board India', 'ISO 22000', 'Organic'],
    useCases: ['Spice blending', 'Essential oil extraction', 'Retail grocery', 'Food processing', 'Medicinal'],
    relatedSlugs: ['coriander', 'turmeric', 'mustard'],
  },
  sesame: {
    name: 'Sesame Seeds',
    slug: 'sesame',
    category: 'Oil Seeds',
    tagline: 'Nature\'s perfect oil seed.',
    shortDescription: 'Export-grade white & black sesame, hull and natural.',
    fullDescription:
      'India is among the world\'s top sesame exporters. Our sesame seeds are sourced from Gujarat and Rajasthan, offered in hulled and natural variants with high oil content and low moisture. Rigorous aflatoxin and pesticide testing ensures compliance with Japanese, EU, and US standards.',
    origin: 'Gujarat, Rajasthan & Madhya Pradesh',
    emoji: '⚪',
    accentColor: '#B8860B',
    specs: [
      { label: 'Oil content', value: '≥ 50%' },
      { label: 'Moisture', value: '≤ 5%' },
      { label: 'FFA (as oleic acid)', value: '≤ 1%' },
      { label: 'Protein', value: '≥ 18%' },
      { label: 'Purity', value: '≥ 99.95%' },
      { label: 'Colour', value: 'Bright white / Natural cream' },
    ],
    grades: ['Hulled (99.95%)', 'Natural White', 'Black Sesame', 'Mixed Grade', 'Organic Hulled'],
    packaging: ['1 kg pouch', '25 kg PP bag', '50 kg jute', 'Big bag 500–1000 kg'],
    certifications: ['APEDA', 'FSSAI', 'USDA Organic', 'Non-GMO', 'Halal', 'Kosher'],
    useCases: ['Bakery toppings', 'Tahini production', 'Sesame oil', 'Health snacks', 'Confectionery'],
    relatedSlugs: ['groundnuts', 'mustard', 'soybean'],
  },
  'red-chilli': {
    name: 'Red Chilli',
    slug: 'red-chilli',
    category: 'Spices',
    tagline: 'Guntur\'s fire in every pod.',
    shortDescription: 'Bold flavour and vibrant colour from Guntur, Andhra Pradesh.',
    fullDescription:
      'Guntur district of Andhra Pradesh supplies roughly 30% of the world\'s chilli. We export whole dry red chillies, de-stemmed, crushed, and powder forms with ASTA colour values consistently exceeding industry benchmarks. Strict mycotoxin and pesticide testing keeps every consignment compliant.',
    origin: 'Guntur, Andhra Pradesh & Byadgi, Karnataka',
    emoji: '🌶',
    accentColor: '#C0392B',
    specs: [
      { label: 'ASTA colour value', value: '≥ 100 (up to 160+)' },
      { label: 'Moisture', value: '≤ 11%' },
      { label: 'Scoville Heat Units', value: '25,000–100,000 SHU (variety dependent)' },
      { label: 'Total ash', value: '≤ 8.5%' },
      { label: 'Aflatoxin', value: '< 10 ppb' },
      { label: 'Form', value: 'Whole / De-stemmed / Crushed / Powder' },
    ],
    grades: ['Teja S17', 'Byadgi', '334 Variety', 'Guntur Sannam', 'Wonder Hot'],
    packaging: ['500 g retail', '5 kg bag', '25 kg PP bag', '50 kg jute', 'Bulk big-bag'],
    certifications: ['APEDA', 'FSSAI', 'Spices Board India', 'ISO 22000', 'EU-compliant MRL'],
    useCases: ['Hot sauce manufacturing', 'Spice blending', 'Food colouring', 'Oleoresin extraction', 'Retail'],
    relatedSlugs: ['turmeric', 'cumin', 'coriander'],
  },
  groundnuts: {
    name: 'Groundnuts',
    slug: 'groundnuts',
    category: 'Oil Seeds',
    tagline: 'Aflatoxin tested. Export proven.',
    shortDescription: 'Bold & Java variety groundnuts, aflatoxin tested.',
    fullDescription:
      'India is a major global peanut exporter with Saurashtra, Gujarat being the primary hub. We supply Bold and Java varieties in-shell, shelled, blanched, and roasted forms. All consignments undergo four-stage aflatoxin testing — farm gate, aggregation, processing, and pre-shipment — to ensure B1 levels below 2 ppb for EU markets.',
    origin: 'Saurashtra, Gujarat & Anantapur, Andhra Pradesh',
    emoji: '🥜',
    accentColor: '#A0522D',
    specs: [
      { label: 'Aflatoxin B1', value: '< 2 ppb (EU standard)' },
      { label: 'Moisture', value: '≤ 8%' },
      { label: 'Oil content', value: '≥ 48%' },
      { label: 'Protein', value: '≥ 25%' },
      { label: 'Admixture', value: '≤ 0.5%' },
      { label: 'Form', value: 'In-shell / Shelled / Blanched / Roasted / HPS' },
    ],
    grades: ['Bold 40/50', 'Bold 50/60', 'Java 60/70', 'HPS (Hand Picked Selected)', 'Blanched'],
    packaging: ['25 kg mesh bag', '50 kg jute', 'Vacuum pack', '20 ft FCL bulk', 'Custom retail bag'],
    certifications: ['APEDA', 'FSSAI', 'EU Aflatoxin Compliant', 'Non-GMO', 'Kosher', 'Halal'],
    useCases: ['Peanut butter', 'Snack roasting', 'Confectionery', 'Oil milling', 'Animal feed'],
    relatedSlugs: ['sesame', 'soybean', 'mustard'],
  },
  wheat: {
    name: 'Wheat',
    slug: 'wheat',
    category: 'Grains',
    tagline: 'Consistent protein. Reliable supply.',
    shortDescription: 'Milling and durum wheat with consistent protein content.',
    fullDescription:
      'India\'s wheat belt — Uttar Pradesh, Punjab, Haryana, and Madhya Pradesh — produces wheat with protein content suitable for both bread-grade and biscuit-grade milling. We supply milling wheat and semolina with test weight, Hagberg Falling Number, and moisture certified at every consignment.',
    origin: 'Punjab, Haryana & Uttar Pradesh, India',
    emoji: '🌿',
    accentColor: '#C8882A',
    specs: [
      { label: 'Protein content', value: '10–13% (variety dependent)' },
      { label: 'Moisture', value: '≤ 13.5%' },
      { label: 'Test weight', value: '≥ 76 kg/hl' },
      { label: 'Hagberg Falling Number', value: '≥ 250 sec' },
      { label: 'Gluten (wet)', value: '≥ 28%' },
      { label: 'Admixture', value: '≤ 1%' },
    ],
    grades: ['FAQ Milling Wheat', 'Bread Grade', 'Biscuit Grade', 'Durum Wheat', 'Semolina (Suji)'],
    packaging: ['50 kg jute bag', 'Big bag 1 MT', 'Bulk container', 'Custom milled flour packs'],
    certifications: ['APEDA', 'FSSAI', 'ISO 22000', 'Non-GMO', 'Phytosanitary Certificate'],
    useCases: ['Flour milling', 'Bread & pasta manufacturing', 'Animal feed', 'Starch extraction', 'Retail atta'],
    relatedSlugs: ['basmati-rice', 'pulses', 'soybean'],
  },
  soybean: {
    name: 'Soybean Meal',
    slug: 'soybean',
    category: 'Feed',
    tagline: 'High-protein fuel for feed industries.',
    shortDescription: 'High-protein soybean meal for feed and food processing.',
    fullDescription:
      'Madhya Pradesh and Rajasthan soybean is processed into de-oiled meal with protein levels exceeding 46%. Used across poultry, aquaculture, and livestock feed industries globally, our soybean meal meets IP (Identity Preserved) non-GMO standards on request.',
    origin: 'Madhya Pradesh & Rajasthan, India',
    emoji: '🫘',
    accentColor: '#7B8B3E',
    specs: [
      { label: 'Protein (crude)', value: '≥ 46%' },
      { label: 'Moisture', value: '≤ 12%' },
      { label: 'Crude fibre', value: '≤ 6%' },
      { label: 'Crude fat', value: '≤ 1.5%' },
      { label: 'Ash', value: '≤ 7%' },
      { label: 'Urease activity', value: '≤ 0.2 delta pH' },
    ],
    grades: ['Hi-Pro Meal (48%)', 'Standard Meal (46%)', 'Full-Fat Soybean', 'Non-GMO IP', 'Toasted'],
    packaging: ['50 kg PP bag', 'Big bag 1 MT', 'Bulk vessel cargo'],
    certifications: ['APEDA', 'FSSAI', 'Non-GMO (on request)', 'Phytosanitary', 'ISO 22000'],
    useCases: ['Poultry feed', 'Aquaculture', 'Livestock nutrition', 'Food-grade protein', 'Pet food'],
    relatedSlugs: ['groundnuts', 'sesame', 'wheat'],
  },
  coriander: {
    name: 'Coriander Seeds',
    slug: 'coriander',
    category: 'Spices',
    tagline: 'Clean. Citrus-warm. Consistent.',
    shortDescription: 'Clean, machine-processed coriander with warm citrus notes.',
    fullDescription:
      'Rajasthan and Madhya Pradesh dominate India\'s coriander output. Our seeds are machine-cleaned through three passes, achieving less than 0.1% extraneous matter. Eagle-sortex and colour-sorting technology ensures uniformity in size and colour — a requirement for premium spice blenders in the EU and USA.',
    origin: 'Kota, Rajasthan & Guntur, Andhra Pradesh',
    emoji: '🌿',
    accentColor: '#5D8A3C',
    specs: [
      { label: 'Volatile oil', value: '≥ 0.3 ml/100g' },
      { label: 'Moisture', value: '≤ 10%' },
      { label: 'Extraneous matter', value: '≤ 0.1%' },
      { label: 'Admixture', value: '≤ 0.5%' },
      { label: 'Split seeds', value: '≤ 5%' },
      { label: 'Cleaning', value: 'Sortex + colour sort' },
    ],
    grades: ['Eagle Quality', 'Singapore Quality', 'FAQ', 'Powder 80 mesh', 'Powder 100 mesh'],
    packaging: ['500 g retail', '5 kg PP bag', '25 kg bag', '50 kg jute', 'Big bag'],
    certifications: ['APEDA', 'Spices Board India', 'FSSAI', 'ISO 22000', 'Organic'],
    useCases: ['Spice blending', 'Curry mixes', 'Essential oil', 'Herbal teas', 'Pickling'],
    relatedSlugs: ['cumin', 'turmeric', 'mustard'],
  },
  mustard: {
    name: 'Mustard Seeds',
    slug: 'mustard',
    category: 'Oil Seeds',
    tagline: 'Yellow. Black. Both exceptional.',
    shortDescription: 'Yellow and black mustard seeds, food-grade quality.',
    fullDescription:
      'Rajasthan leads India\'s mustard production. We export yellow (Sinapis alba) and black/brown (Brassica juncea) mustard seeds with high glucosinolate content prized by condiment manufacturers and oil millers. Moisture and admixture specs are tightly controlled for every lot.',
    origin: 'Alwar & Bharatpur, Rajasthan & Haryana',
    emoji: '🟡',
    accentColor: '#C8B400',
    specs: [
      { label: 'Oil content', value: '≥ 38–42% (variety dependent)' },
      { label: 'Moisture', value: '≤ 8%' },
      { label: 'FFA (as erucic acid)', value: '≤ 2%' },
      { label: 'Admixture', value: '≤ 1%' },
      { label: 'Colour', value: 'Bright yellow / Brown-black' },
      { label: 'Cleaning', value: 'Machine cleaned & graded' },
    ],
    grades: ['Yellow Mustard', 'Brown Mustard', 'Black Mustard', 'Low-Erucic (00-grade)', 'Organic'],
    packaging: ['25 kg PP bag', '50 kg jute', 'Big bag 1 MT', 'Bulk container'],
    certifications: ['APEDA', 'FSSAI', 'Non-GMO', 'Organic (select lots)', 'Halal'],
    useCases: ['Mustard oil milling', 'Condiment production', 'Pickling', 'Spice blending', 'Pharma'],
    relatedSlugs: ['sesame', 'groundnuts', 'cumin'],
  },
  ginger: {
    name: 'Ginger',
    slug: 'ginger',
    category: 'Spices',
    tagline: 'High oleoresin. Full-spectrum heat.',
    shortDescription: 'Fresh and dried ginger with high oleoresin content.',
    fullDescription:
      'Kerala\'s Wayanad and Northeast India\'s Meghalaya produce ginger with the highest volatile oil and oleoresin content globally. We supply fresh, dried sliced, and powder forms with gingerol content certified for nutraceutical and food-grade applications. Fumigation-free options available.',
    origin: 'Wayanad, Kerala & Meghalaya, Northeast India',
    emoji: '🫚',
    accentColor: '#C07830',
    specs: [
      { label: 'Volatile oil', value: '≥ 1.5 ml/100g (dry)' },
      { label: 'Oleoresin', value: '≥ 3.5%' },
      { label: 'Moisture (dry)', value: '≤ 12%' },
      { label: 'Total ash', value: '≤ 8%' },
      { label: 'Gingerols', value: 'High (6-gingerol certified)' },
      { label: 'Form', value: 'Fresh / Dried / Sliced / Powder' },
    ],
    grades: ['Premium Whole Dry', 'Bleached Dry', 'Sliced Dry', 'Powder 80 mesh', 'Fresh Export Grade'],
    packaging: ['5 kg carton (fresh)', '25 kg PP bag (dry)', '50 kg jute', 'Custom retail'],
    certifications: ['APEDA', 'FSSAI', 'Spices Board India', 'Organic', 'Halal', 'Kosher'],
    useCases: ['Beverages & teas', 'Bakery & confectionery', 'Nutraceuticals', 'Pharmaceutical', 'Oleoresin extraction'],
    relatedSlugs: ['turmeric', 'red-chilli', 'coriander'],
  },
  pulses: {
    name: 'Pulses & Lentils',
    slug: 'pulses',
    category: 'Pulses',
    tagline: 'From farm to fork. Every variety.',
    shortDescription: 'Toor, moong, masoor, chana — broad pulse export range.',
    fullDescription:
      'India is the world\'s largest producer and consumer of pulses. We offer a comprehensive range — toor (pigeon pea), moong (green/yellow mung), masoor (red lentil), chana (chickpea), and urad (black gram) — in whole, split, and de-husked forms. All tested for heavy metals, mycotoxins, and pesticide residue.',
    origin: 'Madhya Pradesh, Maharashtra & Rajasthan',
    emoji: '🫘',
    accentColor: '#9B6B30',
    specs: [
      { label: 'Moisture', value: '≤ 12%' },
      { label: 'Admixture', value: '≤ 0.5%' },
      { label: 'Damaged grains', value: '≤ 1%' },
      { label: 'Protein content', value: '20–28% (variety dependent)' },
      { label: 'Weevil', value: 'Nil' },
      { label: 'Processing', value: 'Machine cleaned, sortex, polished' },
    ],
    grades: ['Toor Dal (split)', 'Moong Whole/Split', 'Masoor (Red Lentil)', 'Chana Dal', 'Urad Dal'],
    packaging: ['1 kg retail', '5 kg bag', '25 kg PP bag', '50 kg jute', 'Big bag 1 MT'],
    certifications: ['APEDA', 'FSSAI', 'ISO 22000', 'Non-GMO', 'Organic (select varieties)', 'Halal'],
    useCases: ['Retail grocery', 'Restaurant supply', 'Food processing', 'Protein ingredient', 'Animal feed'],
    relatedSlugs: ['wheat', 'basmati-rice', 'soybean'],
  },
  garlic: {
    name: 'Garlic',
    slug: 'garlic',
    category: 'Spices',
    tagline: 'Strong pungency. Export-ready.',
    shortDescription: 'Fresh Indian garlic, strong pungency, export-cleaned and graded.',
    fullDescription:
      "India is among the world's top garlic exporters, with Madhya Pradesh and Rajasthan being major producing states. Our garlic is carefully graded by bulb size, cleaned and dried to export standards, and packed to withstand long-haul freight. Strong allicin content and low moisture make it ideal for food processing, condiment manufacturing, and retail markets.",
    origin: 'Madhya Pradesh & Rajasthan, India',
    emoji: '🧄',
    accentColor: '#C8882A',
    specs: [
      { label: 'Moisture', value: '≤ 65% (fresh) / ≤ 8% (dry)' },
      { label: 'Diameter', value: '45–65 mm (export grade)' },
      { label: 'Purity', value: '≥ 95%' },
      { label: 'Admixture', value: '≤ 2%' },
      { label: 'Form', value: 'Fresh bulb / Dried / Powder / Flakes' },
      { label: 'Shelf life', value: '6 months+ (cold storage)' },
    ],
    grades: ['Super A Grade (65+ mm)', 'A Grade (55–65 mm)', 'B Grade (45–55 mm)', 'Dehydrated Flakes', 'Garlic Powder'],
    packaging: ['5 kg mesh bag', '10 kg net bag', '20 kg carton', '500 g retail pack', 'Custom private label'],
    certifications: ['APEDA', 'FSSAI', 'Phytosanitary Certificate', 'Non-GMO', 'Halal'],
    useCases: ['Food processing', 'Condiment manufacturing', 'Dehydration & powder', 'Retail grocery', 'Pharmaceutical'],
    relatedSlugs: ['onion', 'ginger', 'red-chilli'],
  },
  onion: {
    name: 'Onion',
    slug: 'onion',
    category: 'Vegetables',
    tagline: 'Firm, dry, built for long-haul export.',
    shortDescription: 'Red and white onions, firm and dry, suitable for long-haul export.',
    fullDescription:
      "Maharashtra and Karnataka are India's dominant onion-growing states. We export red and white onion varieties selected for firmness, low moisture skin, and extended shelf life under ambient storage conditions. All shipments carry a phytosanitary certificate and are fumigation-treated on request for compliance with destination-country biosecurity requirements.",
    origin: 'Nashik, Maharashtra & Bangalore Rural, Karnataka',
    emoji: '🧅',
    accentColor: '#C0392B',
    specs: [
      { label: 'Moisture', value: '≤ 87%' },
      { label: 'Diameter', value: '40–70 mm (standard export)' },
      { label: 'Dry skin layers', value: '≥ 2 (good keeping quality)' },
      { label: 'Admixture', value: '≤ 2%' },
      { label: 'Sprouts', value: 'Nil' },
      { label: 'Form', value: 'Fresh / Dehydrated flakes / Powder' },
    ],
    grades: ['Export Grade (50–70 mm)', 'Medium Grade (40–60 mm)', 'Super Grade (60+ mm)', 'Dehydrated Flakes', 'Onion Powder'],
    packaging: ['10 kg mesh bag', '20 kg mesh bag', '25 kg jute bag', 'Custom retail net bag'],
    certifications: ['APEDA', 'FSSAI', 'Phytosanitary Certificate', 'Non-GMO'],
    useCases: ['Retail grocery', 'Food processing', 'Dehydration industry', 'Condiment production', 'Restaurant supply'],
    relatedSlugs: ['garlic', 'ginger', 'red-chilli'],
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const staticData = STATIC_PRODUCTS[slug]
  if (!staticData) return { title: 'Product Not Found' }
  return { title: staticData.name, description: staticData.shortDescription }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = STATIC_PRODUCTS[slug]

  if (!product) notFound()

  const firstImage = null as { url: string; alt?: string | null } | null

  const relatedProducts = product.relatedSlugs
    .map((s) => STATIC_PRODUCTS[s])
    .filter(Boolean) as StaticProduct[]

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0D3B1A 0%, #071F0D 100%)` }}
      >
        {/* Geometric pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='2' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-10">
            <Link
              href="/products"
              className="text-[11px] font-sans uppercase tracking-[0.25em] text-white/35 hover:text-white/70 transition-colors"
            >
              Products
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-brand-gold/70">
              {product.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-brand-gold/60 mb-4">
                {product.category}
              </p>
              <h1
                className="font-heading text-white font-light leading-none mb-5"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
              >
                {product.name}
              </h1>
              <p
                className="font-heading italic mb-6"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: product.accentColor }}
              >
                {product.tagline}
              </p>
              <p className="font-sans text-white/55 text-[15px] leading-relaxed max-w-[52ch]">
                {product.shortDescription}
              </p>
            </div>

            {/* Image or emoji card */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="relative w-72 h-72 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {firstImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={firstImage.url}
                    alt={firstImage.alt ?? product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <span className="text-9xl select-none" aria-hidden="true">
                      {product.emoji}
                    </span>
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${product.accentColor}20, transparent 70%)`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Origin bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-8">
            <div>
              <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Origin</p>
              <p className="font-sans text-white/70 text-sm">{product.origin}</p>
            </div>
            <div>
              <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Category</p>
              <p className="font-sans text-white/70 text-sm">{product.category}</p>
            </div>
            <div>
              <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Certifications</p>
              <p className="font-sans text-white/70 text-sm">{product.certifications.slice(0, 3).join(' · ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: details */}
          <div className="lg:col-span-2 space-y-12">

            {/* Full description */}
            <section>
              <div className="flex items-center gap-4 mb-5">
                <span className="block h-px flex-1 bg-fog" />
                <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-stone">Overview</span>
                <span className="block h-px flex-1 bg-fog" />
              </div>
              <p className="font-sans text-bark/70 text-[15px] leading-[1.9]">
                {product.fullDescription}
              </p>
            </section>

            {/* Specs table */}
            {product.specs.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-6">
                  Technical Specifications
                </h2>
                <div className="border border-fog overflow-hidden">
                  {product.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className={`flex items-stretch ${i % 2 === 0 ? 'bg-white' : 'bg-cream/60'}`}
                    >
                      <div className="w-48 shrink-0 px-5 py-4 border-r border-fog">
                        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-stone">
                          {spec.label}
                        </p>
                      </div>
                      <div className="flex-1 px-5 py-4">
                        <p className="font-sans text-bark text-[14px]">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Grades */}
            {product.grades.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Available Grades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.grades.map((grade) => (
                    <span
                      key={grade}
                      className="inline-block border border-fog bg-white px-4 py-2 text-[12px] font-sans font-medium text-bark/70 tracking-wide"
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Use cases */}
            {product.useCases.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Applications
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.useCases.map((use) => (
                    <div
                      key={use}
                      className="bg-white border border-fog px-4 py-3 flex items-start gap-2"
                    >
                      <span
                        className="block w-1 h-1 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: product.accentColor }}
                      />
                      <span className="font-sans text-[13px] text-bark/70 leading-snug">{use}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Packaging */}
            {product.packaging.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Packaging Options
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.packaging.map((pack, i) => (
                    <div key={i} className="flex items-center gap-3 border border-fog bg-white px-4 py-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="shrink-0"
                      >
                        <rect x="1" y="1" width="12" height="12" rx="1" stroke={product.accentColor} strokeWidth="1.5" />
                        <path d="M1 5h12M5 1v4" stroke={product.accentColor} strokeWidth="1" />
                      </svg>
                      <span className="font-sans text-[13px] text-bark/70">{pack}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right: sticky CTA sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* CTA card */}
              <div className="bg-brand-green p-8">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-gold/70 mb-3">
                  Export Inquiry
                </p>
                <h3 className="font-heading text-white text-2xl font-light leading-tight mb-4">
                  Request a quote for {product.name}
                </h3>
                <p className="font-sans text-white/50 text-[13px] leading-relaxed mb-6">
                  We respond within 24 hours with pricing, availability, and sample info.
                </p>
                <Link
                  href={`/get-quote?product=${encodeURIComponent(product.name)}`}
                  className="block w-full text-center py-3 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] transition-colors"
                  style={{ background: product.accentColor, color: 'white' }}
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center border border-white/20 py-3 mt-3 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/50 hover:text-white"
                >
                  Contact Us
                </Link>
              </div>

              {/* Certifications */}
              <div className="bg-white border border-fog p-6">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone mb-4">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-block border border-fog px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-[0.08em] text-bark/60"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-white border border-fog p-6 space-y-4">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone">Why Us</p>
                {[
                  '30+ export destinations',
                  'Lab tested every batch',
                  'Phytosanitary certified',
                  'Custom packaging available',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 mt-0.5">
                      <circle cx="6" cy="6" r="5" fill="none" stroke="#0D3B1A" strokeWidth="1" />
                      <path d="M3.5 6l2 2 3-3" stroke="#0D3B1A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-sans text-[13px] text-bark/65 leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-fog bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-4 mb-10">
              <span className="block h-px w-8 bg-brand-gold shrink-0" />
              <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone">Also exported by Myra</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-fog">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.slug}`}
                  className="group bg-white hover:bg-cream transition-colors p-8 flex gap-5 items-start"
                >
                  <span className="text-4xl shrink-0 mt-1" aria-hidden="true">
                    {rel.emoji}
                  </span>
                  <div>
                    <p className="text-[9px] font-sans uppercase tracking-[0.25em] text-stone mb-1">
                      {rel.category}
                    </p>
                    <h3 className="font-heading text-bark text-xl font-semibold mb-1 leading-tight">
                      {rel.name}
                    </h3>
                    <p className="font-sans text-bark/50 text-[12px] leading-relaxed line-clamp-2">
                      {rel.shortDescription}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-brand-green group-hover:text-brand-gold transition-colors">
                      View <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="border-t border-fog bg-cream py-16 text-center">
        <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-stone mb-4">Ready to source?</p>
        <h2
          className="font-heading text-brand-green font-light mb-6"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          Get a competitive export quote<br />
          <em className="italic text-brand-gold">within 24 hours.</em>
        </h2>
        <Link
          href="/get-quote"
          className="inline-block bg-brand-green px-10 py-4 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-white hover:bg-brand-green-light transition-colors"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  )
}
