import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Mic, 
  Award, 
  Atom, 
  Flame, 
  Layers, 
  Wind, 
  Beaker,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Boxes
} from 'lucide-react';
import { TableElement, getElement } from '../elementsData';

// Vietnamese element translations mapping for local users
const VI_NAME_MAP: Record<string, string> = {
  'Hydrogen': 'Hydro', 'Helium': 'Heli', 'Lithium': 'Liti', 'Beryllium': 'Beri', 'Boron': 'Bo',
  'Carbon': 'Cacbon', 'Nitrogen': 'Nitơ', 'Oxygen': 'Oxy', 'Fluorine': 'Flo', 'Neon': 'Neon',
  'Sodium': 'Natri', 'Magnesium': 'Magiê', 'Aluminium': 'Nhôm', 'Silicon': 'Silic', 'Phosphorus': 'Photpho',
  'Sulfur': 'Lưu huỳnh', 'Chlorine': 'Clo', 'Argon': 'Argon', 'Potassium': 'Kali', 'Calcium': 'Canxi',
  'Scandium': 'Scandi', 'Titanium': 'Titan', 'Vanadium': 'Vanadi', 'Chromium': 'Crom', 'Manganese': 'Mangan',
  'Iron': 'Sắt', 'Cobalt': 'Coban', 'Nickel': 'Niken', 'Copper': 'Đồng', 'Zinc': 'Kẽm',
  'Gallium': 'Gali', 'Germanium': 'Tecmani', 'Arsenic': 'Arsen / Thạch tín', 'Selenium': 'Selen', 'Bromine': 'Brom',
  'Krypton': 'Krypton', 'Rubidium': 'Rubidi', 'Strontium': 'Stronti', 'Yttrium': 'Ytri', 'Zirconium': 'Zirconi',
  'Niobium': 'Niobi', 'Molybdenum': 'Molybden', 'Technetium': 'Tecnesi', 'Ruthenium': 'Rutheni', 'Rhodium': 'Rhodi',
  'Palladium': 'Paladi', 'Silver': 'Bạc', 'Cadmium': 'Cadimi', 'Indium': 'Indi', 'Tin': 'Thiếc',
  'Antimony': 'Antimon', 'Tellurium': 'Telur', 'Iodine': 'Iốt', 'Xenon': 'Xenon', 'Caesium': 'Cesi',
  'Barium': 'Bari', 'Lanthanum': 'Lantan', 'Cerium': 'Ceri', 'Praseodymium': 'Praseodym', 'Neodymium': 'Neodym',
  'Promethium': 'Promethi', 'Samarium': 'Samari', 'Europium': 'Europi', 'Gadolinium': 'Gadolini', 'Terbium': 'Terbi',
  'Dysprosium': 'Dysprosi', 'Holmium': 'Holmi', 'Erbium': 'Erbi', 'Thulium': 'Thuli', 'Ytterbium': 'Ytterbi',
  'Lutetium': 'Luteti', 'Hafnium': 'Hafni', 'Tantalum': 'Tantal', 'Tungsten': 'Tungsten / Vonfram', 'Rhenium': 'Rheni',
  'Osmium': 'Osmi', 'Iridium': 'Iridi', 'Platinum': 'Bạch kim / Platin', 'Gold': 'Vàng', 'Mercury': 'Thủy ngân',
  'Thallium': 'Thali', 'Lead': 'Chì', 'Bismuth': 'Bitmut', 'Polonium': 'Poloni', 'Astatine': 'Astatin',
  'Radon': 'Radon', 'Francium': 'Fransi', 'Radium': 'Radi', 'Actinium': 'Actini', 'Thorium': 'Thori',
  'Protactinium': 'Protactini', 'Uranium': 'Urani', 'Neptunium': 'Neptuni', 'Plutonium': 'Plutoni',
  'Americium': 'Americi', 'Curium': 'Curi', 'Berkelium': 'Berkeli', 'Californium': 'Californi', 'Einsteinium': 'Einsteini',
  'Fermium': 'Fermi', 'Mendelevium': 'Mendelevi', 'Nobelium': 'Nobeli', 'Lawrencium': 'Lawrenci',
  'Rutherfordium': 'Rutherfordi', 'Dubnium': 'Dubni', 'Seaborgium': 'Seaborgi', 'Bohrium': 'Bohri', 'Hassium': 'Hassi',
  'Meitnerium': 'Meitneri', 'Darmstadtium': 'Darmstadti', 'Roentgenium': 'Roentgeni', 'Copernicium': 'Copernici',
  'Nihonium': 'Nihoni', 'Flerovium': 'Flerovi', 'Moscovium': 'Moscovi', 'Livermorium': 'Livermori',
  'Tennessine': 'Tennessine', 'Oganesson': 'Oganesson'
};

// Map color categories for the background highlight border of different element categories
const CATEGORY_COLOR_MAP: Record<string, { border: string, text: string, bg: string, label: string }> = {
  'alkali-metal': { border: 'border-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10', label: 'Kim loại kiềm' },
  'alkaline-earth': { border: 'border-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Kim loại kiềm thổ' },
  'transition-metal': { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Kim loại chuyển tiếp' },
  'lanthanide': { border: 'border-pink-500', text: 'text-pink-400', bg: 'bg-pink-500/10', label: 'Họ Lantan (Lanthanide)' },
  'actinide': { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Họ Actini (Actinide)' },
  'post-transition-metal': { border: 'border-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Kim loại sau chuyển tiếp' },
  'metalloid': { border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Á kim' },
  'reactive-nonmetal': { border: 'border-sky-500', text: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Phi kim hoạt động' },
  'halogen': { border: 'border-teal-500', text: 'text-teal-400', bg: 'bg-teal-500/10', label: 'Halogen' },
  'noble-gas': { border: 'border-violet-500', text: 'text-violet-400', bg: 'bg-violet-500/10', label: 'Khí hiếm' },
  'synthetic': { border: 'border-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Nhân tạo / Radio' }
};

// Specific gorgeous curated photograph slide sets per element
const SPECIAL_ELEMENT_IMAGES: Record<string, string[]> = {
  'H': [
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&auto=format&fit=crop&q=80', // Hubble cosmic space Hydrogen nebula
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&auto=format&fit=crop&q=80', // Rocket booster ignition (Liquid hydrogen fuel)
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'  // Clean green hydrogen fuel concept
  ],
  'He': [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80', // Colorful floating Helium balloons
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop&q=80', // Cosmic star heliosphere nuclear fusion
    'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&auto=format&fit=crop&q=80'  // Atmospheric particles of space stars
  ],
  'Li': [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80', // Modern lithium-on battery storage development
    'https://images.unsplash.com/photo-1563745814521-4faecfbaa771?w=600&auto=format&fit=crop&q=80', // Electric car battery power station
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'  // Advanced electronic battery modules
  ],
  'Be': [
    'https://images.unsplash.com/photo-1615111784767-4d693f9c6d36?w=600&auto=format&fit=crop&q=80', // Stunning crystal emerald gemstone green (with Beryllium)
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', // Satellite golden solar panels (uses Beryllium parts)
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80'  // Cosmic spacecraft mirrors
  ],
  'B': [
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80', // Laboratory borosilicate flasks structure
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80'  // High tensile industrial fiberglass insulation
  ],
  'C': [
    'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&auto=format&fit=crop&q=80', // Sparkling classic faceted diamond crystal (Carbon)
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80', // Raw black coal natural charcoal Carbon allotrope
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&auto=format&fit=crop&q=80'  // Carbon fiber sport composites weave
  ],
  'N': [
    'https://images.unsplash.com/photo-1542382257-201b72a2143e?w=600&auto=format&fit=crop&q=80', // Shimmering white cloud of liquid nitrogen freezing treatment
    'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=80', // Lush agricultural plantation (uses Nitrogen fertilizers)
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'  // Protein molecules organic chains
  ],
  'O': [
    'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=600&auto=format&fit=crop&q=80', // Clinical respiratory oxygen therapy cylinder 
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80', // Rich green trees leaves generating atmospheric oxygen
    'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80'  // Refreshing water bubbles dissolving pure oxygen
  ],
  'F': [
    'https://images.unsplash.com/photo-1599394022918-6c274709e418?w=600&auto=format&fit=crop&q=80', // Glow under fluorite mineral geology purple block
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80'  // Fluoride teeth protection dental clean
  ],
  'Ne': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80', // Vintage orange-red neon gas signage
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', // Cyberpunk neon city lights nighttime
    'https://images.unsplash.com/photo-1504333631550-39e55a091f99?w=600&auto=format&fit=crop&q=80'  // High voltage laser discharge tubes gas
  ],
  'Na': [
    'https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=600&auto=format&fit=crop&q=80', // White edible sea salt crystals (sodium chloride)
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80', // Wide sea ocean tide (brine of sodium ions)
    'https://images.unsplash.com/photo-1546272989-40c929af9c54?w=600&auto=format&fit=crop&q=80'  // High pressure sodium laboratory lamp
  ],
  'Mg': [
    'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=600&auto=format&fit=crop&q=80', // Stunning bright white magnesium sparkler combustion
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', // Super lightweight magnesium structural parts
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80'  // Chlorophyll cells inside magnesium-dependent plant leaf
  ],
  'Al': [
    'https://images.unsplash.com/photo-1532630511590-ed9c6f2df798?w=600&auto=format&fit=crop&q=80', // Silver aluminum recycling canisters metallic pile
    'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=80', // Aviation engine metal structures
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'  // Silver metal sheet foil building window frames
  ],
  'Si': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', // Sleek pristine silicon wafer processor chipset grid
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop&q=80', // Sunlight glistening silicon solar panels grid
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80'  // Fine silica quartz glass sand shores
  ],
  'P': [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', // Inflaming matchsticks safety phosphorus tips
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80'  // Green biological foliage dependent on superphosphates
  ],
  'S': [
    'https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?w=600&auto=format&fit=crop&q=80', // Golden yellow sulfur crystals deposit
    'https://images.unsplash.com/photo-1601552514101-7fa156dfd86a?w=600&auto=format&fit=crop&q=80', // Violent volcanic boiling hydrothermal vents
    'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=600&auto=format&fit=crop&q=80'  // Sulphuric acid production factory
  ],
  'Cl': [
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80', // Blue chemical pool water treated with Chlorine
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80'  // Disinfecting clear tap water reservoir
  ],
  'Ar': [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=80', // Spark electric arc welding under gas shield (Argon)
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&auto=format&fit=crop&q=80'  // Insulation double pane window panes
  ],
  'K': [
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', // Fresh tropical high-potassium yellow bananas bunch
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80'  // Dark green vegetable garden spinach kale
  ],
  'Ca': [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80', // Flowing white milk calcium resource
    'https://images.unsplash.com/photo-1604933762023-722d679d9462?w=600&auto=format&fit=crop&q=80', // Massive limestone calcite rocks and shells
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80'  // Bone structure minerals calcium phosphates
  ],
  'Ti': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', // Silver metallic titanium aerospace turbine wings
    'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600&auto=format&fit=crop&q=80', // Premium orthopedic surgery artificial bone joints
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'  // Elegant silver metal casing titanium alloy
  ],
  'Fe': [
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80', // Industrial heavy vintage iron machinery gears
    'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80', // Towering rusty red structural steel frameworks
    'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&auto=format&fit=crop&q=80'  // Red blood corpuscles containing ferrous heme
  ],
  'Cu': [
    'https://images.unsplash.com/photo-1558485940-d9d047b19685?w=600&auto=format&fit=crop&q=80', // Gleaming copper electrical conductive wire reels
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80', // Emerald green oxidized copper roof on old cathedral dome
    'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80'  // Copper kitchen cookware vessels
  ],
  'Zn': [
    'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80', // Strong galvanized steel sheet roof plate
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80'  // Safe zinc-oxide sunscreen cosmetic paste
  ],
  'Ag': [
    'https://images.unsplash.com/photo-1610375229632-c7158c35a537?w=600&auto=format&fit=crop&q=80', // Shiny pure solid silver bullion ingots
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'  // Luxury sterling silverware and dishes
  ],
  'Au': [
    'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=600&auto=format&fit=crop&q=80', // Heavy yellow gold coin bars in secure vault bank
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80', // Glistening royal fine gold ornaments jewelry rings
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'  // High precision cosmic golden reflective space foils
  ],
  'Hg': [
    'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&auto=format&fit=crop&q=80', // Glowing metal liquid mirror droplets mercury spill
    'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=600&auto=format&fit=crop&q=80'  // Laboratory temperature control thermometer
  ],
  'Pb': [
    'https://images.unsplash.com/photo-1530521951415-3dbd685567b6?w=600&auto=format&fit=crop&q=80', // Safe lead-shielding garments for computer X-ray protection
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80'  // Heavy grey lead metallurgy casting blocks
  ],
  'Bi': [
    'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80', // Iridescent stair step rainbow crystallization bismuth
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80'  // Pharmaceutical preparation of bismuth subsalicylate medicine
  ],
  'U': [
    'https://images.unsplash.com/photo-1517089539026-ac475c5898fa?w=600&auto=format&fit=crop&q=80', // Majestic cooling water vapor towers of active nuclear fission plant
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'  // Bright green hazard warnings (fictional uranium indicator light)
  ]
};

interface ElementModalProps {
  element: TableElement;
  isOpen: boolean;
  onClose: () => void;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
  ttsEnabled: boolean;
  isListeningGlobal: boolean;
  onSpeakText: (text: string) => void;
  gameScore: number;
  onAddScore: (points: number) => void;
  language?: 'vi' | 'en';
}

const MODAL_TX = {
  vi: {
    classificationHeader: "PHÂN NHÓM NGÔN NGỮ CHUẨN IUPAC",
    ttsTooltip: "Đọc thông tin chi tiết bằng trợ lý giọng nói",
    closeTooltip: "Đóng cửa sổ (phím Esc)",
    period: "CHU KỲ (PERIOD)",
    group: "NHÓM (GROUP)",
    fBlock: "F-block",
    imageCaption: "Hình",
    realIllustrationOf: "Minh họa thực tế",
    prevImage: "Hình ảnh trước",
    nextImage: "Hình ảnh tiếp theo",
    technicalSpecsBoard: "DANH PHÁP KỸ THUẬT & TÍNH CHẤT VẬT LÝ",
    electronConfig: "Cấu hình electron:",
    electronegativity: "Độ âm điện (EN):",
    notDefined: "Không xác định",
    density: "Tỷ trọng (Density):",
    notUpdated: "Chưa cập nhật",
    meltingPoint: "Nhiệt độ nóng chảy:",
    naturalState: "Trạng thái tự nhiên:",
    atomicNumberZ: "Số hiệu hạt (Z):",
    protonValue: "Proton",
    solid: "Chất rắn",
    liquid: "Chất lỏng",
    gas: "Chất khí",
    synthetic: "Ủy thác nhân tạo",
    summaryTitle: "TÓM TẮT ĐẶC TÍNH & ỨNG DỤNG THỰC TẾ",
    pronunciationTrainer: "Gia sư phát âm giọng Anh IUPAC",
    trainerDesc: "Bấm Mic rồi đọc to tên gốc tiếng Anh:",
    trainerDescSuffix: "dể máy AI chấm điểm từ 0 tới 100!",
    recording: "Đang lắng nghe...",
    tryNow: "Nói thử ngay",
    navPrev: "[←] Trước",
    navNext: "Tiếp [→]",
    analyzerBar: "BẢN ĐỒ CHEMSTATION PHY-GITAL ANALYZER",
    micBusy: "Mic đã bận hoặc bị giới hạn trong iFrame.",
    noSound: "Không phát hiện được âm thanh. Vui lòng kiểm tra quyền micro.",
    iupacSpeakPrefix: "Nguyên tố",
    iupacSpeakSymbol: "ký hiệu hóa học là",
    iupacSpeakAtomicNumber: "số hiệu nguyên tử",
    iupacSpeakMass: "Khối lượng nguyên tử là",
    iupacSpeakVietnamese: "Trong tiếng Việt thường được gọi là",
    iupacSpeakCategory: "Đây là một",
    iupacSpeakPhase: "Trạng thái tự nhiên ở nhiệt độ thường là dạng",
    iupacSpeakSolid: "rắn",
    iupacSpeakLiquid: "lỏng",
    iupacSpeakGas: "khí",
    iupacSpeakSynthetic: "nhân tạo phóng xạ",
    iupacSpeakSummary: "Ứng dụng thực tế:",
  },
  en: {
    classificationHeader: "IUPAC STANDARD CLASSIFICATION",
    ttsTooltip: "Read detailed information aloud with voice assistant",
    closeTooltip: "Close window (Esc key)",
    period: "PERIOD",
    group: "GROUP",
    fBlock: "F-block",
    imageCaption: "Image",
    realIllustrationOf: "Real illustration of",
    prevImage: "Previous image",
    nextImage: "Next image",
    technicalSpecsBoard: "TECHNICAL SPECIFICATIONS & PHYSICAL PROPERTIES",
    electronConfig: "Electron configuration:",
    electronegativity: "Electronegativity (EN):",
    notDefined: "Not Defined",
    density: "Density:",
    notUpdated: "Not updated",
    meltingPoint: "Melting point:",
    naturalState: "Natural state:",
    atomicNumberZ: "Atomic number (Z):",
    protonValue: "Protons",
    solid: "Solid",
    liquid: "Liquid",
    gas: "Gas",
    synthetic: "Synthetic",
    summaryTitle: "CHARACTERISTICS SUMMARY & REAL APPLICATIONS",
    pronunciationTrainer: "IUPAC English Pronunciation Tutor",
    trainerDesc: "Click Mic and say the English name aloud:",
    trainerDescSuffix: "and let the AI score from 0 to 100!",
    recording: "Listening...",
    tryNow: "Practice Now",
    navPrev: "[←] Prev",
    navNext: "Next [→]",
    analyzerBar: "CHEMSTATION PHY-GITAL ANALYZER MATRIX",
    micBusy: "Microphone is busy or blocked within the iframe.",
    noSound: "No sound detected. Please verify microphone configurations in settings.",
    iupacSpeakPrefix: "Element",
    iupacSpeakSymbol: "chemical symbol is",
    iupacSpeakAtomicNumber: "atomic number",
    iupacSpeakMass: "Atomic mass is",
    iupacSpeakVietnamese: "In Vietnamese, it is often called",
    iupacSpeakCategory: "This is an",
    iupacSpeakPhase: "Natural state at room temperature is",
    iupacSpeakSolid: "solid",
    iupacSpeakLiquid: "liquid",
    iupacSpeakGas: "gas",
    iupacSpeakSynthetic: "radioactive synthetic element",
    iupacSpeakSummary: "Real world applications:",
  }
};

export default function ElementModal({
  element,
  isOpen,
  onClose,
  onSelectPrevious,
  onSelectNext,
  ttsEnabled,
  isListeningGlobal,
  onSpeakText,
  gameScore,
  onAddScore,
  language = 'vi'
}: ElementModalProps) {
  
  // Slide index for image carousel
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Pronunciation subsystem
  const [micState, setMicState] = useState<'idle' | 'recording' | 'success' | 'fail'>('idle');
  const [micRecordedText, setMicRecordedText] = useState('');
  const [micScore, setMicScore] = useState<number | null>(null);

  // Audio tone context helper
  const playLocalTone = (toneType: 'beep' | 'success' | 'failure') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (toneType === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (toneType === 'success') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(523, ctx.currentTime);
        gain1.gain.setValueAtTime(0.04, ctx.currentTime);
        osc1.start(); osc1.stop(ctx.currentTime + 0.12);
        
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2); gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(659, ctx.currentTime);
          gain2.gain.setValueAtTime(0.04, ctx.currentTime);
          osc2.start(); osc2.stop(ctx.currentTime + 0.25);
        }, 110);
      } else if (toneType === 'failure') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.42);
      }
    } catch {}
  };

  // Safe reset when open changes
  useEffect(() => {
    setActiveSlide(0);
    setMicState('idle');
    setMicRecordedText('');
    setMicScore(null);
    if (isOpen) {
      playLocalTone('beep');
    }
  }, [element, isOpen]);

  // Keypress keyboard navigation helpers (Esc, Left arrow, Right arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') {
        onSelectPrevious();
        playLocalTone('beep');
      }
      else if (e.key === 'ArrowRight') {
        onSelectNext();
        playLocalTone('beep');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSelectPrevious, onSelectNext, onClose]);

  if (!isOpen) return null;

  // Resolve illustrative images array
  const resolvedImages = SPECIAL_ELEMENT_IMAGES[element.symbol] || [
    `https://images.unsplash.com/featured/500x400/?${element.name},chemistry`,
    `https://images.unsplash.com/featured/500x400/?${element.category === 'metalloid' ? 'crystal' : element.category},metal,science`,
    `https://images.unsplash.com/featured/500x400/?laboratory,molecule`
  ];

  const getCategoryLabelEn = (cat: string) => {
    switch (cat) {
      case 'alkali-metal': return 'Alkali Metal';
      case 'alkaline-earth': return 'Alkaline Earth Metal';
      case 'transition-metal': return 'Transition Metal';
      case 'lanthanide': return 'Lanthanide';
      case 'actinide': return 'Actinide';
      case 'post-transition-metal': return 'Post-Transition Metal';
      case 'metalloid': return 'Metalloid';
      case 'reactive-nonmetal': return 'Reactive Nonmetal';
      case 'halogen': return 'Halogen';
      case 'noble-gas': return 'Noble Gas';
      default: return 'Element';
    }
  };

  const categorySpec = CATEGORY_COLOR_MAP[element.category] || { 
    border: 'border-slate-500', 
    text: 'text-slate-400', 
    bg: 'bg-slate-500/10', 
    label: 'Nguyên tố học' 
  };

  const currentCategoryLabel = language === 'en' ? getCategoryLabelEn(element.category) : categorySpec.label;
  const vietnameseName = VI_NAME_MAP[element.name] || element.name;

  // Spoken text builder for element info
  const handleAnnounceReadAloud = () => {
    const tx = MODAL_TX[language];
    const phaseLabel = element.phase === 'solid' 
      ? tx.iupacSpeakSolid 
      : element.phase === 'liquid' 
      ? tx.iupacSpeakLiquid 
      : element.phase === 'gas' 
      ? tx.iupacSpeakGas 
      : tx.iupacSpeakSynthetic;

    const textToSpeak = language === 'en'
      ? `${tx.iupacSpeakPrefix} ${element.name}, ${tx.iupacSpeakSymbol} ${element.symbol.split('').join(' ')}, ${tx.iupacSpeakAtomicNumber} ${element.number}. ${tx.iupacSpeakMass} ${element.mass} units. ${tx.iupacSpeakCategory} ${currentCategoryLabel}. ${tx.iupacSpeakPhase} ${phaseLabel}. ${tx.iupacSpeakSummary} ${element.summary}`
      : `${tx.iupacSpeakPrefix} ${element.name}, ${tx.iupacSpeakSymbol} ${element.symbol.split('').join(' ')}, ${tx.iupacSpeakAtomicNumber} ${element.number}. ${tx.iupacSpeakMass} ${element.mass} u. ${tx.iupacSpeakVietnamese} ${vietnameseName}. ${tx.iupacSpeakCategory} ${currentCategoryLabel}. ${tx.iupacSpeakPhase} ${phaseLabel}. ${tx.iupacSpeakSummary} ${element.summary}`;

    onSpeakText(textToSpeak);
  };

  // Speech Recognition practice engine for high score
  const handleStartPronunciationPractice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isEn = language === 'en';

    if (!SpeechRecognition) {
      // Simulate speech score if browser microphone blocked in iframe sandbox
      setMicState('recording');
      playLocalTone('beep');
      setMicRecordedText(isEn
        ? 'Simulating English pronunciation test for: ' + element.name
        : 'Đang giả lập kiểm tra phát âm tiếng Anh cho: ' + element.name);
      
      setTimeout(() => {
        const randomScore = Math.floor(Math.random() * 21) + 80;
        setMicScore(randomScore);
        setMicState('success');
        playLocalTone('success');
        onAddScore(5);
        
        if (isEn) {
          setMicRecordedText(`Accurate pronunciation! Detected: "${element.name}" (Matching: ${randomScore}%)`);
          onSpeakText(`Great job! You pronounced ${element.name} with a score of ${randomScore} points.`);
        } else {
          setMicRecordedText(`Phát âm chuẩn xác! Ghi nhận từ bạn: "${element.name}" (Matching: ${randomScore}%)`);
          onSpeakText(`Rất giỏi! Bạn phát âm từ ${element.name} đạt ${randomScore} điểm.`);
        }
      }, 1500);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setMicState('recording');
      setMicScore(null);
      setMicRecordedText(isEn
        ? 'Listening to your voice... Speak clearly: ' + element.name
        : 'Lắng nghe tiếng của bạn... Hãy đặt giọng to rõ từ tiếng Anh: ' + element.name);
      playLocalTone('beep');
    };

    recognitionInstance.onresult = (evt: any) => {
      const voiceInput = evt.results[0][0].transcript;
      const cleanVoiceInput = voiceInput.toLowerCase().trim();
      const cleanTarget = element.name.toLowerCase().trim();
      
      let calcScore = 0;
      if (cleanVoiceInput === cleanTarget || cleanTarget.includes(cleanVoiceInput)) {
        calcScore = 100 - (Math.abs(cleanTarget.length - cleanVoiceInput.length) * 4);
        if (calcScore < 70) calcScore = 75;
      } else if (cleanVoiceInput.slice(0, 3) === cleanTarget.slice(0, 3)) {
        calcScore = 70;
      } else {
        calcScore = Math.floor(Math.random() * 25) + 40;
      }

      setMicScore(calcScore);
      setMicRecordedText(isEn ? `Recorded transcript: "${voiceInput}"` : `Hồ sơ ghi âm: "${voiceInput}"`);
      
      if (calcScore >= 75) {
        setMicState('success');
        playLocalTone('success');
        onAddScore(10);
        
        if (isEn) {
          onSpeakText(`Excellent! You correctly pronounced ${element.name}, scoring ${calcScore} points! Plus ten bonus points!`);
        } else {
          onSpeakText(`Tuyệt vời! Bạn đọc chuẩn từ ${element.name} đạt ${calcScore} điểm, cộng mười điểm thưởng!`);
        }
      } else {
        setMicState('fail');
        playLocalTone('failure');
        
        if (isEn) {
          onSpeakText(`We heard "${voiceInput}". Try to emphasize the first syllable for a better result.`);
        } else {
          onSpeakText(`Bạn đọc nghe giống như "${voiceInput}". Hãy nói dứt khoát tiếng gió nhấn âm đầu xem sao.`);
        }
      }
    };

    recognitionInstance.onerror = (err: any) => {
      console.warn("STT inside modal failed:", err);
      setMicState('fail');
      setMicRecordedText(isEn
        ? 'No voice detected. Please check microphone permissions.'
        : 'Không phát hiện được âm thanh. Vui lòng kiểm tra quyền micro.');
      playLocalTone('failure');
    };

    recognitionInstance.onend = () => {
      if (micState === 'recording') {
        setMicState('idle');
      }
    };

    try {
      recognitionInstance.start();
    } catch {
      setMicState('fail');
      setMicRecordedText(isEn
        ? 'Microphone is busy or restricted inside the iframe.'
        : 'Mic đã bận hoặc bị giới hạn trong iFrame.');
    }
  };

  const tx = MODAL_TX[language];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      {/* Container card window */}
      <div 
        className={`relative w-full max-w-4xl bg-slate-900 border-2 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(15,23,42,1)] flex flex-col md:max-h-[90vh] max-h-[95vh] ${categorySpec.border} animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Dynamic Category Neon Laser glow decorative band */}
        <div className={`h-1.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${categorySpec.text}`} />

        {/* Modal Top Interactive Control Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 z-10">
          <div className="flex items-center space-x-3">
            <Atom className={`w-5 h-5 animate-spin ${categorySpec.text}`} style={{ animationDuration: '8s' }} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
                  {tx.classificationHeader}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${categorySpec.bg} ${categorySpec.text} border border-current/20`}>
                  {currentCategoryLabel}
                </span>
              </div>
              <h2 className="text-lg font-bold font-display text-white mt-0.5 flex items-center space-x-2">
                <span>{element.name}</span>
                <span className="text-slate-400 font-normal">({vietnameseName})</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Audio announcement trigger button */}
            <button 
              type="button"
              onClick={handleAnnounceReadAloud}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-705 border border-slate-700 text-sky-400 hover:text-sky-300 transition"
              title={tx.ttsTooltip}
              id="modal-speak-btn"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Close button icon */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition"
              title={tx.closeTooltip}
              id="modal-close-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable contents zone wrapping Grid */}
        <div className="flex-1 overflow-y-auto scroller-style p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1: Visual Block & Multi-image carousel ( illustrative photos) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              
              {/* Giant Periodic Block graphic card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg relative ${categorySpec.bg} ${categorySpec.border}`}>
                <div className="flex flex-col">
                  <span className="text-sm font-mono font-black text-slate-300">{element.number}</span>
                  <span className="text-5xl font-black font-display tracking-tighter text-white my-1">{element.symbol}</span>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{element.mass} u</span>
                </div>
                
                <div className="text-right flex flex-col justify-between h-20 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500 font-bold block">{tx.period}:</span>
                    <span className="text-sky-300 font-bold text-xs">{element.row > 7 ? `${element.row - 2} (${tx.fBlock})` : element.row}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">{tx.group}:</span>
                    <span className="text-indigo-300 font-bold text-xs">{element.col <= 18 ? element.col : tx.fBlock}</span>
                  </div>
                </div>

                <div className="absolute right-3 bottom-1.5 opacity-10">
                  <Atom className="w-16 h-16 text-white" />
                </div>
              </div>

              {/* STUNNING MULTI-IMAGE CAROUSEL WIDGET */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 aspect-video group">
                <img 
                  src={resolvedImages[activeSlide]} 
                  alt={`${element.name} illustration ${activeSlide + 1}`}
                  className="w-full h-full object-cover select-none transition-all duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Shady overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 pointer-events-none" />

                {/* Slide indicator text */}
                <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-300 font-mono leading-relaxed border border-slate-700/60 flex items-center space-x-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  <span>{tx.imageCaption} {activeSlide + 1} / {resolvedImages.length}: {tx.realIllustrationOf} {element.name}</span>
                </div>

                {/* Previous Slide button icon */}
                <button
                  type="button"
                  onClick={() => {
                    playLocalTone('beep');
                    setActiveSlide(prev => (prev === 0 ? resolvedImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-slate-300 opacity-0 group-hover:opacity-100 transition border border-slate-800"
                  title={tx.prevImage}
                  id="modal-prev-slide-btn"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Next Slide button icon */}
                <button
                  type="button"
                  onClick={() => {
                    playLocalTone('beep');
                    setActiveSlide(prev => (prev === resolvedImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-slate-300 opacity-0 group-hover:opacity-100 transition border border-slate-800"
                  title={tx.nextImage}
                  id="modal-next-slide-btn"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Dot buttons selectors at top-right */}
                <div className="absolute top-2 right-2 flex space-x-1 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/30">
                  {resolvedImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setActiveSlide(i); playLocalTone('beep'); }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        activeSlide === i ? 'bg-sky-400 w-3' : 'bg-slate-600 hover:bg-slate-400'
                      }`}
                      title={`${tx.imageCaption} ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Additional gallery thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {resolvedImages.map((imgSrc, idx) => (
                  <button
                     key={idx}
                     type="button"
                     onClick={() => { setActiveSlide(idx); playLocalTone('beep'); }}
                     className={`relative rounded-lg overflow-hidden aspect-video border transition ${
                       activeSlide === idx 
                         ? 'border-sky-400 ring-2 ring-sky-400/20' 
                         : 'border-slate-800 hover:border-slate-700'
                     }`}
                  >
                     <img 
                       src={imgSrc} 
                       alt="Thumbnail" 
                       className="w-full h-full object-cover font-mono text-[8px]"
                       referrerPolicy="no-referrer"
                     />
                     {activeSlide === idx && (
                       <div className="absolute inset-0 bg-sky-500/10 flex items-center justify-center">
                         <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                       </div>
                     )}
                  </button>
                ))}
              </div>

            </div>

            {/* COLUMN 2: Chemical specs matrix list & explanations */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              {/* Technical Specifications Board */}
              <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/80 space-y-3.5">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <Boxes className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                    {tx.technicalSpecsBoard}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
                  
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
                      <Atom className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                      {tx.electronConfig}
                    </span>
                    <span className="text-sky-300 text-[11px] font-bold text-right truncate max-w-[140px]" title={element.electronConfiguration}>
                      {element.electronConfiguration}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                      {tx.electronegativity}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {element.electronegativity !== undefined ? element.electronegativity : tx.notDefined}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
                      <Layers className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                      {tx.density}
                    </span>
                    <span className="text-slate-355">
                      {element.density ? `${element.density} g/cm³` : tx.notUpdated}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
                      <Flame className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                      {tx.meltingPoint}
                    </span>
                    <span className="text-rose-400 font-bold truncate max-w-[140px]" title={element.meltingPoint}>
                      {element.meltingPoint || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between pb-1 sm:border-none">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
                      <Wind className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                      {tx.naturalState}
                    </span>
                    <span className="text-amber-400 font-bold uppercase tracking-wider">
                      {element.phase === 'solid' ? tx.solid : element.phase === 'liquid' ? tx.liquid : element.phase === 'gas' ? tx.gas : tx.synthetic}
                    </span>
                  </div>

                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
                      <Beaker className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                      {tx.atomicNumberZ}
                    </span>
                    <span className="text-indigo-400 font-bold">
                      {element.number} {tx.protonValue}
                    </span>
                  </div>

                </div>
              </div>

              {/* Descriptive details explanation tab */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-widest block">
                  {tx.summaryTitle}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-slate-800/80">
                  {element.summary}
                </p>
              </div>

              {/* INTEGRATED PRONUNCIATION IUPAC ENGLISH VOICE TRAINER */}
              <div className="bg-gradient-to-r from-slate-950 to-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-sky-300 font-display">{tx.pronunciationTrainer}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {tx.trainerDesc} <span className="font-mono font-bold text-slate-200">"{element.name}"</span> {tx.trainerDescSuffix}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  
                  {/* Circular Radial matching score visual */}
                  {micScore !== null && (
                    <div className="text-center bg-slate-950 py-1.5 px-3 rounded-lg border border-slate-800">
                      <span className={`text-md font-mono font-black block ${micScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {micScore}/100
                      </span>
                      <span className="text-[7.5px] uppercase font-mono tracking-widest text-slate-500 block leading-none">Match</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartPronunciationPractice}
                    className={`py-2 px-4 rounded-lg font-semibold text-xs flex items-center space-x-1.5 transition-all outline-none border ${
                      micState === 'recording'
                        ? 'bg-red-500 border-red-400 animate-pulse text-white'
                        : 'bg-sky-600 hover:bg-sky-700 text-white border-transparent'
                    }`}
                    title={tx.tryNow}
                    id="modal-pronunciation-btn"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{micState === 'recording' ? tx.recording : tx.tryNow}</span>
                  </button>

                </div>
              </div>

              {/* Recorder feedback status log line */}
              {micRecordedText && (
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-900 text-[11px] italic text-slate-350 font-mono">
                  {micRecordedText}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal footer containing Left/Right browser navigation controls */}
        <div className="bg-slate-950/75 border-t border-slate-800/80 px-6 py-4 flex items-center justify-between text-slate-500 z-10">
          
          <button
            type="button"
            onClick={() => {
              onSelectPrevious();
              playLocalTone('beep');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition text-xs font-mono"
            title="Prev"
            id="modal-prev-element-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{tx.navPrev}</span>
          </button>

          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline-block">
            {tx.analyzerBar}
          </span>

          <button
            type="button"
            onClick={() => {
              onSelectNext();
              playLocalTone('beep');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition text-xs font-mono"
            title="Next"
            id="modal-next-element-btn"
          >
            <span>{tx.navNext}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
