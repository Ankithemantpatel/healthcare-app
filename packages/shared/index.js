const { sharedUiCopy: CONSTANTS } = require("./uiText");

const seedUsers = [
  {
    id: "u1",
    username: "admin",
    password: "admin123",
    name: "Ava Morgan",
    email: "ava.morgan@medsync.ai",
    phone: "+1-555-0101",
    address: "245 Harbor View Drive, San Francisco, CA 94107",
    condition: "Hypertension",
  },
  {
    id: "u2",
    username: "patient1",
    password: "patient123",
    name: "Liam Chen",
    email: "liam.chen@medsync.ai",
    phone: "+1-555-0102",
    address: "89 Cedar Lane, Seattle, WA 98109",
    condition: "Asthma",
  },
];

const seedDoctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Cardiology",
    availability: "Mon-Fri",
    experienceYears: 14,
    rating: 4.8,
    consultationFee: 120,
    hospital: "Metro Heart Institute",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialty: "Dermatology",
    availability: "Tue-Thu",
    experienceYears: 9,
    rating: 4.6,
    consultationFee: 90,
    hospital: "City Skin Clinic",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Dr. Michael Johnson",
    specialty: "Neurology",
    availability: "Mon-Wed-Fri",
    experienceYears: 18,
    rating: 4.9,
    consultationFee: 150,
    hospital: "NeuroCare Center",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    name: "Dr. Sarah Williams",
    specialty: "Pediatrics",
    availability: "Daily",
    experienceYears: 11,
    rating: 4.7,
    consultationFee: 95,
    hospital: "Sunrise Children Hospital",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
  },
];

const seedAppointments = [
  {
    id: "a1",
    userId: "u1",
    doctor: "Dr. John Doe",
    date: "2026-04-18",
    time: "10:30",
    type: "Follow-up",
    reason: "Blood pressure review",
    status: "Confirmed",
  },
  {
    id: "a2",
    userId: "u1",
    doctor: "Dr. Jane Smith",
    date: "2026-04-22",
    time: "14:00",
    type: "Consultation",
    reason: "Skin allergy evaluation",
    status: "Pending",
  },
];

const seedPrescriptions = [
  {
    id: "pr1",
    userId: "u1",
    doctor: "Dr. John Doe",
    date: "2026-03-01",
    diagnosis: "Stage 1 hypertension follow-up",
    medicines: ["Telmisartan 40mg", "Amlodipine 5mg"],
    notes: "Continue low-sodium diet and daily BP log.",
  },
  {
    id: "pr2",
    userId: "u1",
    doctor: "Dr. Jane Smith",
    date: "2026-02-12",
    diagnosis: "Seasonal eczema flare",
    medicines: ["Cetirizine 10mg", "Hydrocortisone cream"],
    notes: "Apply cream twice daily for 7 days.",
  },
  {
    id: "pr3",
    userId: "u2",
    doctor: "Dr. Sarah Williams",
    date: "2026-01-20",
    diagnosis: "Mild asthma episode",
    medicines: ["Montelukast 10mg", "Salbutamol inhaler"],
    notes: "Use inhaler as needed; review in 4 weeks.",
  },
];

const seedOrders = [
  {
    id: "ord1",
    userId: "u1",
    items: [
      {
        medicine: {
          id: "med001",
          name: "Paracetamol 250mg",
          brand: "HealthPlus",
          category: "Fever & Pain",
          price: 4.0,
          packSize: "10 tablets",
          requiresPrescription: false,
          inStock: true,
          image:
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=60",
        },
        quantity: 2,
      },
    ],
    totalAmount: 8.0,
    status: "Out for Delivery",
    placedAt: "2026-04-10T09:30:00.000Z",
    eta: "Today, 6:00 PM",
  },
  {
    id: "ord2",
    userId: "u1",
    items: [
      {
        medicine: {
          id: "med012",
          name: "Atorvastatin 500mg",
          brand: "NovaCure",
          category: "Cardiac Care",
          price: 23.47,
          packSize: "15 tablets",
          requiresPrescription: true,
          inStock: true,
          image:
            "https://images.unsplash.com/photo-1631549916768-4119b4123a46?auto=format&fit=crop&w=300&q=60",
        },
        quantity: 1,
      },
    ],
    totalAmount: 23.47,
    status: "Delivered",
    placedAt: "2026-03-29T14:12:00.000Z",
    eta: "Delivered",
  },
];

const medicineIngredients = [
  "Paracetamol",
  "Azithromycin",
  "Amoxicillin",
  "Ibuprofen",
  "Cetirizine",
  "Levocetirizine",
  "Montelukast",
  "Atorvastatin",
  "Rosuvastatin",
  "Metformin",
  "Glimepiride",
  "Telmisartan",
  "Amlodipine",
  "Losartan",
  "Pantoprazole",
  "Rabeprazole",
  "Domperidone",
  "Ondansetron",
  "Dolo",
  "Calcium",
  "Vitamin D3",
  "Vitamin B12",
  "Iron Folic",
  "Zinc",
  "ORS",
  "Cough Syrup",
  "Antacid",
  "Probiotic",
  "Multivitamin",
  "Omega 3",
  "Biotin",
  "Collagen",
  "Loratadine",
  "Fexofenadine",
  "Aspirin",
  "Clopidogrel",
  "Thyroxine",
  "Insulin",
  "Salbutamol",
  "Budesonide",
  "Levamisole",
  "Piperazine",
  "Mebendazole",
  "Albendazole",
  "Nitazoxanide",
  "Cimetidine",
  "Famotidine",
  "Omeprazole",
  "Lansoprazole",
  "Esomeprazole",
  "Ranitidine",
  "Sucralfate",
  "Misoprostol",
  "Bisacodyl",
  "Lactulose",
  "Sorbitol",
  "Docusate",
  "Senna",
  "Psyllium",
  "Loperamide",
  "Diphenoxylate",
  "Atropine",
  "Morphine",
  "Codeine",
  "Tramadol",
  "Paracetamol-Tramadol",
  "Diclofenac",
  "Ketorolac",
  "Meloxicam",
  "Piroxicam",
  "Indomethacin",
  "Naproxen",
  "Nimesulide",
  "Celecoxib",
  "Rofecoxib",
  "Etoricoxib",
  "Lumiracoxib",
  "Amtolmetin",
  "Aceclofenac",
  "Tiaprofenic",
  "Suprofen",
  "Fenoprofen",
  "Flurbiprofen",
  "Ibuprofen-Paracetamol",
  "Ibuprofen-Codeine",
  "Acetaminophen",
  "Aspirin-Paracetamol",
  "Aspirin-Caffeine",
  "Cafergot",
  "Ergotamine",
  "Methysergide",
  "Sumatriptan",
  "Zolmitriptan",
  "Naratriptan",
  "Rizatriptan",
  "Almotriptan",
  "Eletriptan",
  "Frovatriptan",
  "Propranolol",
  "Metoprolol",
  "Atenolol",
  "Bisoprolol",
  "Carvedilol",
  "Labetalol",
  "Nebivolol",
  "Acebutolol",
  "Pindolol",
  "Timolol",
  "Diltiazem",
  "Verapamil",
  "Nifedipine",
  "Amlodipine-Atorvastatin",
  "Lisinopril",
  "Enalapril",
  "Ramipril",
  "Perindopril",
  "Quinapril",
  "Captopril",
];

const medicineStrengths = [
  "50mg",
  "100mg",
  "150mg",
  "200mg",
  "250mg",
  "300mg",
  "400mg",
  "500mg",
  "600mg",
  "650mg",
  "750mg",
  "800mg",
  "1000mg",
  "5mg",
  "10mg",
  "15mg",
  "20mg",
  "25mg",
  "30mg",
  "40mg",
];
const medicineBrands = [
  "HealthPlus",
  "MediCore",
  "NovaCure",
  "ZenRx",
  "BioTrust",
  "CareMeds",
  "PulsePharma",
  "WellnessLab",
  "ApolloCare",
  "PrimeAid",
];
const medicineCategories = [
  "Fever & Pain",
  "Antibiotics",
  "Allergy",
  "Cardiac Care",
  "Diabetes Care",
  "Supplements",
  "Digestive Care",
  "Respiratory Care",
  "Immunity",
  "Hydration",
];
const medicinePackSizes = [
  "10 tablets",
  "15 tablets",
  "20 tablets",
  "30 tablets",
  "60ml syrup",
  "1 inhaler",
];
const medicineImages = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=60",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=60",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=300&q=60",
  "https://images.unsplash.com/photo-1631549916768-4119b4123a46?auto=format&fit=crop&w=300&q=60",
  "https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?auto=format&fit=crop&w=300&q=60",
  "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=300&q=60",
];
const prescriptionCategories = new Set([
  "Antibiotics",
  "Cardiac Care",
  "Diabetes Care",
  "Respiratory Care",
]);

const generateMedicinesCatalog = () => {
  const medicines = [];
  const totalMedicines = 2000;

  for (let idNum = 1; idNum <= totalMedicines; idNum += 1) {
    const ingredientIndex = (idNum - 1) % medicineIngredients.length;
    const strengthIndex =
      Math.floor((idNum - 1) / medicineIngredients.length) %
      medicineStrengths.length;

    const category =
      medicineCategories[
        (ingredientIndex + strengthIndex) % medicineCategories.length
      ];
    const priceBase = 4 + ((ingredientIndex * 7 + strengthIndex * 5) % 42);
    const price = Number((priceBase + strengthIndex * 0.49).toFixed(2));

    medicines.push({
      id: `med${String(idNum).padStart(4, "0")}`,
      name: `${medicineIngredients[ingredientIndex]} ${medicineStrengths[strengthIndex]}`,
      brand:
        medicineBrands[
          (ingredientIndex + strengthIndex) % medicineBrands.length
        ],
      category,
      price,
      packSize:
        medicinePackSizes[
          (ingredientIndex * 2 + strengthIndex) % medicinePackSizes.length
        ],
      requiresPrescription: prescriptionCategories.has(category),
      inStock: idNum % 11 !== 0,
      image:
        medicineImages[
          (ingredientIndex + strengthIndex) % medicineImages.length
        ],
    });
  }

  return medicines;
};

const getMedicineCategories = (medicines) => [
  "All",
  ...Array.from(new Set(medicines.map((medicine) => medicine.category))),
];

const filterMedicinesCatalog = (
  medicines,
  searchQuery,
  activeCategory,
  sortBy,
) => {
  const query = searchQuery.trim().toLowerCase();
  const filtered = medicines.filter((medicine) => {
    const inCategory =
      activeCategory === "All" || medicine.category === activeCategory;
    const matchesSearch =
      query.length === 0 ||
      medicine.name.toLowerCase().includes(query) ||
      medicine.brand.toLowerCase().includes(query) ||
      medicine.category.toLowerCase().includes(query);

    return inCategory && matchesSearch;
  });

  if (sortBy === "priceAsc") {
    return [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy === "priceDesc") {
    return [...filtered].sort((a, b) => b.price - a.price);
  }

  return filtered;
};

module.exports = {
  seedUsers,
  seedDoctors,
  seedAppointments,
  seedPrescriptions,
  seedOrders,
  generateMedicinesCatalog,
  getMedicineCategories,
  filterMedicinesCatalog,
  sharedUiCopy: CONSTANTS,
};
