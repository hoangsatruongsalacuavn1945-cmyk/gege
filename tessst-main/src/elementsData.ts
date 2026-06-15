import { ElementData } from './types';

export interface TableElement extends ElementData {
  row: number; // 1-7, lanthanides & actinides row 8 & 9
  col: number; // 1-18
}

// Full array of all 118 elements with correct symbol, English IUPAC name, mass, group/row coordinates, category, and properties.
const RAW_ELEMENTS_SPECS: {
  z: number;
  symbol: string;
  name: string;
  mass: string;
  category: string;
  phase: 'solid' | 'liquid' | 'gas' | 'synthetic';
  en?: number; // Electronegativity
  density?: string;
  mp?: string; // Melting point
  summary: string;
  config: string;
}[] = [
  { z: 1, symbol: 'H', name: 'Hydrogen', mass: '1.008', category: 'reactive-nonmetal', phase: 'gas', en: 2.20, density: '0.00008988', mp: '-259.16 °C', summary: 'The most abundant chemical substance in the Universe.', config: '1s1' },
  { z: 2, symbol: 'He', name: 'Helium', mass: '4.0026', category: 'noble-gas', phase: 'gas', en: undefined, density: '0.0001785', mp: '-272.20 °C', summary: 'Colorless, odorless, inert gas; second lightest element.', config: '1s2' },
  { z: 3, symbol: 'Li', name: 'Lithium', mass: '6.94', category: 'alkali-metal', phase: 'solid', en: 0.98, density: '0.534', mp: '180.54 °C', summary: 'Lightest alkali metal, highly reactive, crucial for modern rechargeable batteries.', config: '[He] 2s1' },
  { z: 4, symbol: 'Be', name: 'Beryllium', mass: '9.0122', category: 'alkaline-earth', phase: 'solid', en: 1.57, density: '1.85', mp: '1287 °C', summary: 'Strong, lightweight alkaline earth metal used in spacecraft and X-ray windows.', config: '[He] 2s2' },
  { z: 5, symbol: 'B', name: 'Boron', mass: '10.81', category: 'metalloid', phase: 'solid', en: 2.04, density: '2.08', mp: '2075 °C', summary: 'A low-abundance metalloid used in fiberglass, borosilicate glassware, and agriculture.', config: '[He] 2s2 2p1' },
  { z: 6, symbol: 'C', name: 'Carbon', mass: '12.011', category: 'reactive-nonmetal', phase: 'solid', en: 2.55, density: '2.267', mp: '3550 °C', summary: 'Nonmetal base of organic life, forming allotropes like graphite, diamonds, and graphene.', config: '[He] 2s2 2p2' },
  { z: 7, symbol: 'N', name: 'Nitrogen', mass: '14.007', category: 'reactive-nonmetal', phase: 'gas', en: 3.04, density: '0.0012506', mp: '-210.00 °C', summary: 'Diatomic gas forms about 78% of Earth\'s atmosphere; vital for proteins and DNA.', config: '[He] 2s2 2p3' },
  { z: 8, symbol: 'O', name: 'Oxygen', mass: '15.999', category: 'reactive-nonmetal', phase: 'gas', en: 3.44, density: '0.001429', mp: '-218.79 °C', summary: 'Highly reactive oxidizer essential for cellular respiration and combustion.', config: '[He] 2s2 2p4' },
  { z: 9, symbol: 'F', name: 'Fluorine', mass: '18.998', category: 'halogen', phase: 'gas', en: 3.98, density: '0.001696', mp: '-219.67 °C', summary: 'Pale yellow toxic halogen; the most electronegative and chemically reactive of all elements.', config: '[He] 2s2 2p5' },
  { z: 10, symbol: 'Ne', name: 'Neon', mass: '20.180', category: 'noble-gas', phase: 'gas', en: undefined, density: '0.0009002', mp: '-248.59 °C', summary: 'Glows reddish-orange in high-voltage vacuum discharge tubes, widely used in neon signs.', config: '[He] 2s2 2p6' },
  
  { z: 11, symbol: 'Na', name: 'Sodium', mass: '22.990', category: 'alkali-metal', phase: 'solid', en: 0.93, density: '0.968', mp: '97.794 °C', summary: 'Soft, highly reactive alkali metal; reacts violently with water and forms table salt with chlorine.', config: '[Ne] 3s1' },
  { z: 12, symbol: 'Mg', name: 'Magnesium', mass: '24.305', category: 'alkaline-earth', phase: 'solid', en: 1.31, density: '1.738', mp: '650 °C', summary: 'Light, strong alkaline earth metal used in structural alloys and fireworks.', config: '[Ne] 3s2' },
  { z: 13, symbol: 'Al', name: 'Aluminium', mass: '26.982', category: 'post-transition-metal', phase: 'solid', en: 1.61, density: '2.70', mp: '660.32 °C', summary: 'Silver-white, lightweight, corrosion-resistant post-transition metal.', config: '[Ne] 3s2 3p1' },
  { z: 14, symbol: 'Si', name: 'Silicon', mass: '28.085', category: 'metalloid', phase: 'solid', en: 1.90, density: '2.3290', mp: '1414 °C', summary: 'Hard, shiny, semiconductor metalloid that powers our computers.', config: '[Ne] 3s2 3p2' },
  { z: 15, symbol: 'P', name: 'Phosphorus', mass: '30.974', category: 'reactive-nonmetal', phase: 'solid', en: 2.19, density: '1.823', mp: '44.15 °C', summary: 'Highly reactive nonmetal existing in red (matches) and white (glows in dark) forms.', config: '[Ne] 3s2 3p3' },
  { z: 16, symbol: 'S', name: 'Sulfur', mass: '32.06', category: 'reactive-nonmetal', phase: 'solid', en: 2.58, density: '2.07', mp: '115.21 °C', summary: 'Bright yellow crystalline nonmetal; famously smells foul when in hydrogen sulfide.', config: '[Ne] 3s2 3p4' },
  { z: 17, symbol: 'Cl', name: 'Chlorine', mass: '35.45', category: 'halogen', phase: 'gas', en: 3.16, density: '0.0032', mp: '-101.5 °C', summary: 'Disinfectant green halogen gas used to clean pools and sanitize water systems.', config: '[Ne] 3s2 3p5' },
  { z: 18, symbol: 'Ar', name: 'Argon', mass: '39.948', category: 'noble-gas', phase: 'gas', en: undefined, density: '0.001784', mp: '-189.34 °C', summary: 'Inert noble gas used to create protective shields in welding and lightbulbs.', config: '[Ne] 3s2 3p6' },

  { z: 19, symbol: 'K', name: 'Potassium', mass: '39.098', category: 'alkali-metal', phase: 'solid', en: 0.82, density: '0.862', mp: '63.5 °C', summary: 'Soft alkali metal that reacts with water and is essential to cellular nervous function.', config: '[Ar] 4s1' },
  { z: 20, symbol: 'Ca', name: 'Calcium', mass: '40.078', category: 'alkaline-earth', phase: 'solid', en: 1.00, density: '1.55', mp: '842 °C', summary: 'Highly vital nutrient for teeth and bones; main component of limestone.', config: '[Ar] 4s2' },
  { z: 21, symbol: 'Sc', name: 'Scandium', mass: '44.956', category: 'transition-metal', phase: 'solid', en: 1.36, density: '2.989', mp: '1541 °C', summary: 'Rare transition metal used to produce high-strength aerospace alloys.', config: '[Ar] 3d1 4s2' },
  { z: 22, symbol: 'Ti', name: 'Titanium', mass: '47.867', category: 'transition-metal', phase: 'solid', en: 1.54, density: '4.506', mp: '1668 °C', summary: 'Boasts high power-to-weight ratio; highly corrosion-resistant and bio-compatible.', config: '[Ar] 3d2 4s2' },
  { z: 23, symbol: 'V', name: 'Vanadium', mass: '50.942', category: 'transition-metal', phase: 'solid', en: 1.63, density: '6.11', mp: '1910 °C', summary: 'Durable steel alloy additive used to strengthen jet engines and high-grade tools.', config: '[Ar] 3d3 4s2' },
  { z: 24, symbol: 'Cr', name: 'Chromium', mass: '51.996', category: 'transition-metal', phase: 'solid', en: 1.66, density: '7.19', mp: '1907 °C', summary: 'Lustrous, corrosion resistant chrome used to protect stainless steel and add shine.', config: '[Ar] 3d5 4s1' },
  { z: 25, symbol: 'Mn', name: 'Manganese', mass: '54.938', category: 'transition-metal', phase: 'solid', en: 1.55, density: '7.21', mp: '1246 °C', summary: 'Vital industrial material used to alloy iron to enhance steel strength.', config: '[Ar] 3d5 4s2' },
  { z: 26, symbol: 'Fe', name: 'Iron', mass: '55.845', category: 'transition-metal', phase: 'solid', en: 1.83, density: '7.874', mp: '1538 °C', summary: 'Most used metal on Earth; core component of steel, structural columns, and hemoglobin.', config: '[Ar] 3d6 4s2' },
  { z: 27, symbol: 'Co', name: 'Cobalt', mass: '58.933', category: 'transition-metal', phase: 'solid', en: 1.88, density: '8.90', mp: '1495 °C', summary: 'Hard blue transition metal, core magnetic active material in rechargeable lithium state battery cells.', config: '[Ar] 3d7 4s2' },
  { z: 28, symbol: 'Ni', name: 'Nickel', mass: '58.693', category: 'transition-metal', phase: 'solid', en: 1.91, density: '8.908', mp: '1455 °C', summary: 'Corrosion resistant transition metal famously used in coins, wires, and nickel plating.', config: '[Ar] 3d8 4s2' },
  { z: 29, symbol: 'Cu', name: 'Copper', mass: '63.546', category: 'transition-metal', phase: 'solid', en: 1.90, density: '8.96', mp: '1084.62 °C', summary: 'Ductile high-conductivity metal used for electric power wiring and heat sinks.', config: '[Ar] 3d10 4s1' },
  { z: 30, symbol: 'Zn', name: 'Zinc', mass: '65.38', category: 'transition-metal', phase: 'solid', en: 1.65, density: '7.14', mp: '419.53 °C', summary: 'Common metal used to galvanize other steels/metals from oxidation.', config: '[Ar] 3d10 4s2' },
  
  { z: 31, symbol: 'Ga', name: 'Gallium', mass: '69.723', category: 'post-transition-metal', phase: 'solid', en: 1.81, density: '5.91', mp: '29.76 °C', summary: 'Melts in physical hands, used in semiconductor fabrication.', config: '[Ar] 3d10 4s2 4p1' },
  { z: 32, symbol: 'Ge', name: 'Germanium', mass: '72.630', category: 'metalloid', phase: 'solid', en: 2.01, density: '5.323', mp: '938.25 °C', summary: 'Semiconductor used in night-vision thermal lenses and fiber optics.', config: '[Ar] 3d10 4s2 4p2' },
  { z: 33, symbol: 'As', name: 'Arsenic', mass: '74.922', category: 'metalloid', phase: 'solid', en: 2.18, density: '5.727', mp: '817 °C', summary: 'Famous poisonous metalloid used in wood preservatives and semiconductor doping.', config: '[Ar] 3d10 4s2 4p3' },
  { z: 34, symbol: 'Se', name: 'Selenium', mass: '78.971', category: 'reactive-nonmetal', phase: 'solid', en: 2.55, density: '4.81', mp: '221 °C', summary: 'Photoconductive reactive-nonmetal used in glass manufacturing and photo sensors.', config: '[Ar] 3d10 4s2 4p4' },
  { z: 35, symbol: 'Br', name: 'Bromine', mass: '79.904', category: 'halogen', phase: 'liquid', en: 2.96, density: '3.1028', mp: '-7.2 °C', summary: 'Fuming reddish halogen liquid element used as flame retardant.', config: '[Ar] 3d10 4s2 4p5' },
  { z: 36, symbol: 'Kr', name: 'Krypton', mass: '83.798', category: 'noble-gas', phase: 'gas', en: 3.00, density: '0.003733', mp: '-157.36 °C', summary: 'Neon-light glower used in highly sophisticated camera flashes.', config: '[Ar] 3d10 4s2 4p6' },

  { z: 37, symbol: 'Rb', name: 'Rubidium', mass: '85.468', category: 'alkali-metal', phase: 'solid', en: 0.82, density: '1.53', mp: '39.31 °C', summary: 'Highly active alkali metal used in laser-cooling and physical vapors.', config: '[Kr] 5s1' },
  { z: 38, symbol: 'Sr', name: 'Strontium', mass: '87.62', category: 'alkaline-earth', phase: 'solid', en: 0.95, density: '2.64', mp: '777 °C', summary: 'Burns crimson red, widely used in signal flares and fireworks.', config: '[Kr] 5s2' },
  { z: 39, symbol: 'Y', name: 'Yttrium', mass: '88.906', category: 'transition-metal', phase: 'solid', en: 1.22, density: '4.472', mp: '1526 °C', summary: 'Sought-after metal used in superconductors and ceramic alloys.', config: '[Kr] 4d1  5s2' },
  { z: 40, symbol: 'Zr', name: 'Zirconium', mass: '91.224', category: 'transition-metal', phase: 'solid', en: 1.33, density: '6.52', mp: '1855 °C', summary: 'Lustrous grayish metal with excellent thermal and nuclear properties.', config: '[Kr] 4d2 5s2' },
  { z: 41, symbol: 'Nb', name: 'Niobium', mass: '92.906', category: 'transition-metal', phase: 'solid', en: 1.6, density: '8.57', mp: '2477 °C', summary: 'Superconducting refractory metal used in particle accelerators.', config: '[Kr] 4d4 5s1' },
  { z: 42, symbol: 'Mo', name: 'Molybdenum', mass: '95.95', category: 'transition-metal', phase: 'solid', en: 2.16, density: '10.28', mp: '2623 °C', summary: 'Extremely high melting point; used to strengthen robust aircraft parts.', config: '[Kr] 4d5 5s1' },
  { z: 43, symbol: 'Tc', name: 'Technetium', mass: '98', category: 'transition-metal', phase: 'synthetic', en: 1.9, density: '11.5', mp: '2157 °C', summary: 'The lightest element that is entirely radioactive and synthetic.', config: '[Kr] 4d5 5s2' },
  { z: 44, symbol: 'Ru', name: 'Ruthenium', mass: '101.07', category: 'transition-metal', phase: 'solid', en: 2.2, density: '12.45', mp: '2334 °C', summary: 'Noble transition metal used to durable wear electrical contacts.', config: '[Kr] 4d7 5s1' },
  { z: 45, symbol: 'Rh', name: 'Rhodium', mass: '102.91', category: 'transition-metal', phase: 'solid', en: 2.28, density: '12.41', mp: '1964 °C', summary: 'Precious corrosion resistant metal; highly expensive global luxury item.', config: '[Kr] 4d8 5s1' },
  { z: 46, symbol: 'Pd', name: 'Palladium', mass: '106.42', category: 'transition-metal', phase: 'solid', en: 2.20, density: '12.02', mp: '1554.9 °C', summary: 'Used in jewelry and catalytic exhaust systems to absorb hydrogen.', config: '[Kr] 4d10' },
  { z: 47, symbol: 'Ag', name: 'Silver', mass: '107.87', category: 'transition-metal', phase: 'solid', en: 1.93, density: '10.49', mp: '961.78 °C', summary: 'The absolute champion of electric and thermal conductivity.', config: '[Kr] 4d10 5s1' },
  { z: 48, symbol: 'Cd', name: 'Cadmium', mass: '112.41', category: 'transition-metal', phase: 'solid', en: 1.69, density: '8.65', mp: '321.07 °C', summary: 'Heavy metal used in nickel-cadmium batteries and blue dyes.', config: '[Kr] 4d10 5s2' },
  { z: 49, symbol: 'In', name: 'Indium', mass: '114.82', category: 'post-transition-metal', phase: 'solid', en: 1.78, density: '7.31', mp: '156.6 °C', summary: 'Very soft metal crucial for clear touch screens (Indium Tin Oxide).', config: '[Kr] 4d10 5s2 5p1' },
  { z: 50, symbol: 'Sn', name: 'Tin', mass: '118.71', category: 'post-transition-metal', phase: 'solid', en: 1.96, density: '7.287', mp: '231.93 °C', summary: 'Classic alloying compound used to manufacture brass, bronze, and food cans.', config: '[Kr] 4d10 5s2 5p2' },
  { z: 51, symbol: 'Sb', name: 'Antimony', mass: '121.76', category: 'metalloid', phase: 'solid', en: 2.05, density: '6.697', mp: '630.63 °C', summary: 'Lustrous gray metalloid compound used historically in Egyptian cosmetics.', config: '[Kr] 4d10 5s2 5p3' },
  { z: 52, symbol: 'Te', name: 'Tellurium', mass: '127.60', category: 'metalloid', phase: 'solid', en: 2.1, density: '6.24', mp: '449.51 °C', summary: 'Rare brittle metalloid used in highly responsive solar energy cells.', config: '[Kr] 4d10 5s2 5p4' },
  { z: 53, symbol: 'I', name: 'Iodine', mass: '126.90', category: 'halogen', phase: 'solid', en: 2.66, density: '4.933', mp: '113.7 °C', summary: 'Lustrous purple iodine solid used to disinfect flesh and regulate hormones.', config: '[Kr] 4d10 5s2 5p5' },
  { z: 54, symbol: 'Xe', name: 'Xenon', mass: '131.29', category: 'noble-gas', phase: 'gas', en: 2.60, density: '0.005887', mp: '-111.7 °C', summary: 'Dense gas glowing light blue; powers deep space ion thrusters.', config: '[Kr] 4d10 5s2 5p6' },

  { z: 55, symbol: 'Cs', name: 'Caesium', mass: '132.91', category: 'alkali-metal', phase: 'solid', en: 0.79, density: '1.93', mp: '28.44 °C', summary: 'Liquid on a hot day, it powers the global standard of exact seconds in atomic clocks.', config: '[Xe] 6s1' },
  { z: 56, symbol: 'Ba', name: 'Barium', mass: '137.33', category: 'alkaline-earth', phase: 'solid', en: 0.89, density: '3.62', mp: '727 °C', summary: 'Soft reactive alkaline earth, absorbs X-rays well for stomach medical scans.', config: '[Xe] 6s2' },
  
  // Lanthanides Group (Placed in Row 8 for display)
  { z: 57, symbol: 'La', name: 'Lanthanum', mass: '138.91', category: 'lanthanide', phase: 'solid', en: 1.10, density: '6.162', mp: '920 °C', summary: 'Found in rare-earth mineral deposits, catalyst for modern fuel refining.', config: '[Xe] 5d1 6s2' },
  { z: 58, symbol: 'Ce', name: 'Cerium', mass: '140.12', category: 'lanthanide', phase: 'solid', en: 1.12, density: '6.77', mp: '795 °C', summary: 'Sparkly rare-earth metal alloyed inside fire steel and lighters.', config: '[Xe] 4f1 5d1 6s2' },
  { z: 59, symbol: 'Pr', name: 'Praseodymium', mass: '140.91', category: 'lanthanide', phase: 'solid', en: 1.13, density: '6.77', mp: '931 °C', summary: 'Soft rare metal utilized to color intense yellow-green goggles.', config: '[Xe] 4f3 6s2' },
  { z: 60, symbol: 'Nd', name: 'Neodymium', mass: '144.24', category: 'lanthanide', phase: 'solid', en: 1.14, density: '7.01', mp: '1021 °C', summary: 'Super-strong permanent magnets used inside motors, phones and MRI machines.', config: '[Xe] 4f4 6s2' },
  { z: 61, symbol: 'Pm', name: 'Promethium', mass: '145', category: 'lanthanide', phase: 'synthetic', en: 1.13, density: '7.26', mp: '1042 °C', summary: 'Extremely rare radioactive element used in miniature nuclear state cell cores.', config: '[Xe] 4f5 6s2' },
  { z: 62, symbol: 'Sm', name: 'Samarium', mass: '150.36', category: 'lanthanide', phase: 'solid', en: 1.17, density: '7.52', mp: '1072 °C', summary: 'Rare-earth metal used inside durable magnets operating at extremely high heats.', config: '[Xe] 4f6 6s2' },
  { z: 63, symbol: 'Eu', name: 'Europium', mass: '151.96', category: 'lanthanide', phase: 'solid', en: 1.2, density: '5.24', mp: '822 °C', summary: 'Most reactive rare-earth element; utilized inside high-def red neon phosphor lights.', config: '[Xe] 4f7 6s2' },
  { z: 64, symbol: 'Gd', name: 'Gadolinium', mass: '157.25', category: 'lanthanide', phase: 'solid', en: 1.2, density: '7.9', mp: '1312 °C', summary: 'Superb MRI contrast visual agent with strong magnetic cooling cells.', config: '[Xe] 4f7 5d1 6s2' },
  { z: 65, symbol: 'Tb', name: 'Terbium', mass: '158.93', category: 'lanthanide', phase: 'solid', en: 1.2, density: '8.23', mp: '1356 °C', summary: 'Rare-earth used in green fluorescent light pigments.', config: '[Xe] 4f9 6s2' },
  { z: 66, symbol: 'Dy', name: 'Dysprosium', mass: '162.50', category: 'lanthanide', phase: 'solid', en: 1.22, density: '8.55', mp: '1412 °C', summary: 'Critical high-temperature permanent magnet additive.', config: '[Xe] 4f10 6s2' },
  { z: 67, symbol: 'Ho', name: 'Holmium', mass: '164.93', category: 'lanthanide', phase: 'solid', en: 1.23, density: '8.79', mp: '1474 °C', summary: 'Possesses one of the highest magnetic strength levels in history.', config: '[Xe] 4f11 6s2' },
  { z: 68, symbol: 'Er', name: 'Erbium', mass: '167.26', category: 'lanthanide', phase: 'solid', en: 1.24, density: '9.06', mp: '1529 °C', summary: 'Pink-colored element used as high-end laser scalpels and fiber optics.', config: '[Xe] 4f12 6s2' },
  { z: 69, symbol: 'Tm', name: 'Thulium', mass: '168.93', category: 'lanthanide', phase: 'solid', en: 1.25, density: '9.32', mp: '1545 °C', summary: 'Sought-after, scarce element used inside portable X-ray emitters.', config: '[Xe] 4f13 6s2' },
  { z: 70, symbol: 'Yb', name: 'Ytterbium', mass: '173.05', category: 'lanthanide', phase: 'solid', en: 1.1, density: '6.9', mp: '819 °C', summary: 'Highly active light emitter used inside chemical research lasers.', config: '[Xe] 4f14 6s2' },
  { z: 71, symbol: 'Lu', name: 'Lutetium', mass: '174.97', category: 'lanthanide', phase: 'solid', en: 1.27, density: '9.84', mp: '1663 °C', summary: 'Durable, hard lanthanide used to determine age of deep earth meteorites.', config: '[Xe] 4f14 5d1 6s2' },

  { z: 72, symbol: 'Hf', name: 'Hafnium', mass: '178.49', category: 'transition-metal', phase: 'solid', en: 1.3, density: '13.31', mp: '2233 °C', summary: 'Absorbs neutrons easily; vital for control rods in nuclear reactors.', config: '[Xe] 4f14 5d2 6s2' },
  { z: 73, symbol: 'Ta', name: 'Tantalum', mass: '180.95', category: 'transition-metal', phase: 'solid', en: 1.5, density: '16.65', mp: '3017 °C', summary: 'Refractory metal with near-zero chemical corrosion; makes compact capacitors for computer phones.', config: '[Xe] 4f14 5d3 6s2' },
  { z: 74, symbol: 'W', name: 'Tungsten', mass: '183.84', category: 'transition-metal', phase: 'solid', en: 2.36, density: '19.25', mp: '3422 °C', summary: 'Boasts the absolute highest melting point of all metallic material on Earth.', config: '[Xe] 4f14 5d4 6s2' },
  { z: 75, symbol: 'Re', name: 'Rhenium', mass: '186.21', category: 'transition-metal', phase: 'solid', en: 1.9, density: '21.02', mp: '3186 °C', summary: 'Resists extreme thermal stress; vital for high-performance combustion turbine engine blades.', config: '[Xe] 4f14 5d5 6s2' },
  { z: 76, symbol: 'Os', name: 'Osmium', mass: '190.23', category: 'transition-metal', phase: 'solid', en: 2.2, density: '22.59', mp: '3033 °C', summary: 'Hard, blue-colored precious element; holds record for greatest density (heaviest block).', config: '[Xe] 4f14 5d6 6s2' },
  { z: 77, symbol: 'Ir', name: 'Iridium', mass: '192.22', category: 'transition-metal', phase: 'solid', en: 2.2, density: '22.56', mp: '2446 °C', summary: 'Extreme chemical passivity, most corrosion-resistant element in the world.', config: '[Xe] 4f14 5d7 6s2' },
  { z: 78, symbol: 'Pt', name: 'Platinum', mass: '195.08', category: 'transition-metal', phase: 'solid', en: 2.28, density: '21.45', mp: '1768.3 °C', summary: 'Highly unreactive precious element used inside fine catalysts and royal jewelry.', config: '[Xe] 4f14 5d9 6s1' },
  { z: 79, symbol: 'Au', name: 'Gold', mass: '196.97', category: 'transition-metal', phase: 'solid', en: 2.54, density: '19.30', mp: '1064.18 °C', summary: 'Malleable and shiny yellow noble metal, used physically as the historic anchor of monetary value.', config: '[Xe] 4f14 5d10 6s1' },
  { z: 80, symbol: 'Hg', name: 'Mercury', mass: '200.59', category: 'transition-metal', phase: 'liquid', en: 2.00, density: '13.534', mp: '-38.83 °C', summary: 'Highly shiny silver-colored transition metal that remains liquid at room temperature.', config: '[Xe] 4f14 5d10 6s2' },
  { z: 81, symbol: 'Tl', name: 'Thallium', mass: '204.38', category: 'post-transition-metal', phase: 'solid', en: 1.62, density: '11.85', mp: '304 °C', summary: 'Extremely heavy, highly toxic post-transition metal historically used as assassination poison.', config: '[Xe] 4f14 5d10 6s2 6p1' },
  { z: 82, symbol: 'Pb', name: 'Lead', mass: '207.2', category: 'post-transition-metal', phase: 'solid', en: 2.33, density: '11.34', mp: '327.46 °C', summary: 'Heavy toxic gray metal commonly utilized to block dangerous X-ray laser radiation.', config: '[Xe] 4f14 5d10 6s2 6p2' },
  { z: 83, symbol: 'Bi', name: 'Bismuth', mass: '208.98', category: 'post-transition-metal', phase: 'solid', en: 2.02, density: '9.78', mp: '271.5 °C', summary: 'Safe heavy metal forming colorful oxide crystal stairs, active compound in anti-diarrhea medicines.', config: '[Xe] 4f14 5d10 6s2 6p3' },
  { z: 84, symbol: 'Po', name: 'Polonium', mass: '209', category: 'metalloid', phase: 'solid', en: 2.0, density: '9.196', mp: '254 °C', summary: 'Highly radioactive and toxic metal discovered by Marie Curie.', config: '[Xe] 4f14 5d10 6s2 6p4' },
  { z: 85, symbol: 'At', name: 'Astatine', mass: '210', category: 'halogen', phase: 'solid', en: 2.2, density: '6.4', mp: '302 °C', summary: 'Rarest naturally occurring element; total Earth crust amount measures under a few grams!', config: '[Xe] 4f14 5d10 6s2 6p5' },
  { z: 86, symbol: 'Rn', name: 'Radon', mass: '222', category: 'noble-gas', phase: 'gas', en: 2.20, density: '0.00973', mp: '-71 °C', summary: 'Radioactive noble gas accumulating in basements, second leading cause of lung cancer worldwide.', config: '[Xe] 4f14 5d10 6s2 6p6' },

  { z: 87, symbol: 'Fr', name: 'Francium', mass: '223', category: 'alkali-metal', phase: 'solid', en: 0.79, density: '1.87', mp: '27 °C', summary: 'Extremely radioactive and fleeting alkali metal; fades within minutes.', config: '[Rn] 7s1' },
  { z: 88, symbol: 'Ra', name: 'Radium', mass: '226', category: 'alkaline-earth', phase: 'solid', en: 0.90, density: '5.5', mp: '700 °C', summary: 'Radioactive luminescent alkaline metal famously painted onto antique clock hands.', config: '[Rn] 7s2' },
  
  // Actinides Group (Placed in Row 9 for display)
  { z: 89, symbol: 'Ac', name: 'Actinium', mass: '227', category: 'actinide', phase: 'solid', en: 1.10, density: '10.07', mp: '1050 °C', summary: 'Extremely radioactive actinide that glows steel-blue in pitch darkness.', config: '[Rn] 6d1 7s2' },
  { z: 90, symbol: 'Th', name: 'Thorium', mass: '232.04', category: 'actinide', phase: 'solid', en: 1.30, density: '11.7', mp: '1750 °C', summary: 'Abundant radioactive energy metal researched globally for safe green nuclear fuel reactors.', config: '[Rn] 6d2 7s2' },
  { z: 91, symbol: 'Pa', name: 'Protactinium', mass: '231.04', category: 'actinide', phase: 'solid', en: 1.5, density: '15.37', mp: '1568 °C', summary: 'Highly active poisonous waste, radioactive intermediate element.', config: '[Rn] 5f2 6d1 7s2' },
  { z: 92, symbol: 'U', name: 'Uranium', mass: '238.03', category: 'actinide', phase: 'solid', en: 1.38, density: '19.1', mp: '1132.2 °C', summary: 'Extremely dense radioactive metal used to fission massive electrical utility grids.', config: '[Rn] 5f3 6d1 7s2' },
  { z: 93, symbol: 'Np', name: 'Neptunium', mass: '237', category: 'actinide', phase: 'solid', en: 1.36, density: '20.45', mp: '639 °C', summary: 'First transuranic synthetic actinide discovered as fission product.', config: '[Rn] 5f4 6d1 7s2' },
  { z: 94, symbol: 'Pu', name: 'Plutonium', mass: '244', category: 'actinide', phase: 'solid', en: 1.28, density: '19.84', mp: '639.4 °C', summary: 'Highly powerful synthetic radioactive actinide of nuclear weapons fame.', config: '[Rn] 5f6 7s2' },
  { z: 95, symbol: 'Am', name: 'Americium', mass: '243', category: 'actinide', phase: 'solid', en: 1.3, density: '13.67', mp: '1176 °C', summary: 'Synthetic element saving lives inside common household ionization smoke detectors.', config: '[Rn] 5f7 7s2' },
  { z: 96, symbol: 'Cm', name: 'Curium', mass: '247', category: 'actinide', phase: 'solid', en: 1.3, density: '13.51', mp: '1345 °C', summary: 'Heavy synthetic radioactive element named in honor of Marie and Pierre Curie.', config: '[Rn] 5f7 6d1 7s2' },
  { z: 97, symbol: 'Bk', name: 'Berkelium', mass: '247', category: 'actinide', phase: 'solid', en: 1.3, density: '14.78', mp: '986 °C', summary: 'Discovered at UC Berkeley, another heavy transuranic synthetic particle.', config: '[Rn] 5f9 7s2' },
  { z: 98, symbol: 'Cf', name: 'Californium', mass: '251', category: 'actinide', phase: 'solid', en: 1.3, density: '15.1', mp: '900 °C', summary: 'Extremely potent neutron emitter used to ignite high-end space engines.', config: '[Rn] 5f10 7s2' },
  { z: 99, symbol: 'Es', name: 'Einsteinium', mass: '252', category: 'actinide', phase: 'solid', en: 1.3, density: '8.84', mp: '860 °C', summary: 'Named in honor of Albert Einstein; synthesis of which occurred after early Ivy Mike H-bomb blasts.', config: '[Rn] 5f11 7s2' },
  { z: 100, symbol: 'Fm', name: 'Fermium', mass: '257', category: 'actinide', phase: 'synthetic', en: 1.3, density: 'undefined', mp: '1527 °C', summary: 'Named in honor of atomic physicist Enrico Fermi, heavy synthetic element.', config: '[Rn] 5f12 7s2' },
  { z: 101, symbol: 'Md', name: 'Mendelevium', mass: '258', category: 'actinide', phase: 'synthetic', en: 1.3, density: 'undefined', mp: '827 °C', summary: 'Synthesized in honor of the father of Periodic Table, Dmitri Mendeleev.', config: '[Rn] 5f13 7s2' },
  { z: 102, symbol: 'No', name: 'Nobelium', mass: '259', category: 'actinide', phase: 'synthetic', en: 1.3, density: 'undefined', mp: '827 °C', summary: 'Radioactive synthetic element named after dynamite inventor Alfred Nobel.', config: '[Rn] 5f14 7s2' },
  { z: 103, symbol: 'Lr', name: 'Lawrencium', mass: '262', category: 'actinide', phase: 'synthetic', en: 1.3, density: 'undefined', mp: '1627 °C', summary: 'Completes the actinide series, named after Ernest Lawrence.', config: '[Rn] 5f14 7s2 7p1' },

  { z: 104, symbol: 'Rf', name: 'Rutherfordium', mass: '267', category: 'synthetic', phase: 'synthetic', en: undefined, density: '23.2', mp: '2100 °C', summary: 'Highly radioactive transuranic synthetic element.', config: '[Rn] 5f14 6d2 7s2' },
  { z: 105, symbol: 'Db', name: 'Dubnium', mass: '268', category: 'synthetic', phase: 'synthetic', en: undefined, density: '29.3', mp: 'undefined', summary: 'Synthesized near Dubna, Russia; half life of under 30 hours.', config: '[Rn] 5f14 6d3 7s2' },
  { z: 106, symbol: 'Sg', name: 'Seaborgium', mass: '269', category: 'synthetic', phase: 'synthetic', en: undefined, density: '35.0', mp: 'undefined', summary: 'First element ever named in honor of a living person, Glenn Seaborg.', config: '[Rn] 5f14 6d4 7s2' },
  { z: 107, symbol: 'Bh', name: 'Bohrium', mass: '270', category: 'synthetic', phase: 'synthetic', en: undefined, density: '37.1', mp: 'undefined', summary: 'Named in honor of quantum pioneer Niels Bohr.', config: '[Rn] 5f14 6d5 7s2' },
  { z: 108, symbol: 'Hs', name: 'Hassium', mass: '271', category: 'synthetic', phase: 'synthetic', en: undefined, density: '41.0', mp: 'undefined', summary: 'Heavy synthetic non-reactive metal synthesized in Germany.', config: '[Rn] 5f14 6d6 7s2' },
  { z: 109, symbol: 'Mt', name: 'Meitnerium', mass: '278', category: 'synthetic', phase: 'synthetic', en: undefined, density: '37.4', mp: 'undefined', summary: 'Named in honor of female nuclear physicist Lise Meitner.', config: '[Rn] 5f14 6d7 7s2' },
  { z: 110, symbol: 'Ds', name: 'Darmstadtium', mass: '281', category: 'synthetic', phase: 'synthetic', en: undefined, density: '34.8', mp: 'undefined', summary: 'Extremely radioactive, synthetically manufactured element.', config: '[Rn] 5f14 6d8 7s2' },
  { z: 111, symbol: 'Rg', name: 'Roentgenium', mass: '282', category: 'synthetic', phase: 'synthetic', en: undefined, density: '28.7', mp: 'undefined', summary: 'Named after X-ray discoverer Wilhelm Röntgen.', config: '[Rn] 5f14 6d9 7s2' },
  { z: 112, symbol: 'Cn', name: 'Copernicium', mass: '285', category: 'transition-metal', phase: 'synthetic', en: undefined, density: '14.0', mp: '10 °C', summary: 'Highly radioactive post-transition element synthesized in lab.', config: '[Rn] 5f14 6d10 7s2' },
  { z: 113, symbol: 'Nh', name: 'Nihonium', mass: '286', category: 'synthetic', phase: 'synthetic', en: undefined, density: '16.0', mp: '430 °C', summary: 'First element ever discovered and named by Japanese scientists.', config: '[Rn] 5f14 6d10 7s2 7p1' },
  { z: 114, symbol: 'Fl', name: 'Flerovium', mass: '289', category: 'synthetic', phase: 'synthetic', en: undefined, density: '14.0', mp: '67 °C', summary: 'Very radioactive synthetic element, named after Flerov lab.', config: '[Rn] 5f14 6d10 7s2 7p2' },
  { z: 115, symbol: 'Mc', name: 'Moscovium', mass: '290', category: 'synthetic', phase: 'synthetic', en: undefined, density: '13.5', mp: '400 °C', summary: 'Highly radioactive element discovered in Dubna, Moscow region.', config: '[Rn] 5f14 6d10 7s2 7p3' },
  { z: 116, symbol: 'Lv', name: 'Livermorium', mass: '293', category: 'synthetic', phase: 'synthetic', en: undefined, density: '12.9', mp: '437 °C', summary: 'Named in honor of US Lawrence Livermore National Laboratory.', config: '[Rn] 5f14 6d10 7s2 7p4' },
  { z: 117, symbol: 'Ts', name: 'Tennessine', mass: '294', category: 'synthetic', phase: 'synthetic', en: undefined, density: '7.2', mp: '400 °C', summary: 'Second heaviest element synthesized; named after physical state of Tennessee.', config: '[Rn] 5f14 6d10 7s2 7p5' },
  { z: 118, symbol: 'Og', name: 'Oganesson', mass: '294', category: 'noble-gas', phase: 'synthetic', en: undefined, density: '4.9', mp: '80 °C', summary: 'Synthetic element with highest atomic number on Periodic Table.', config: '[Rn] 5f14 6d10 7s2 7p6' }
];

// Reconstruct coordinates properly if not specified
export const ELEMENTS_DATA: TableElement[] = RAW_ELEMENTS_SPECS.map(spec => {
  // Determine coordinate positions automatically based on chemistry properties
  let row = 1;
  let col = 1;

  if (spec.z === 1) { row = 1; col = 1; }
  else if (spec.z === 2) { row = 1; col = 18; }
  
  else if (spec.z >= 3 && spec.z <= 4) { row = 2; col = spec.z - 2; }
  else if (spec.z >= 5 && spec.z <= 10) { row = 2; col = spec.z + 8; }
  
  else if (spec.z >= 11 && spec.z <= 12) { row = 3; col = spec.z - 10; }
  else if (spec.z >= 13 && spec.z <= 18) { row = 3; col = spec.z; }
  
  else if (spec.z >= 19 && spec.z <= 36) { row = 4; col = spec.z - 18; }
  
  else if (spec.z >= 37 && spec.z <= 54) { row = 5; col = spec.z - 36; }
  
  else if (spec.z >= 55 && spec.z <= 56) { row = 6; col = spec.z - 54; }
  else if (spec.z >= 57 && spec.z <= 71) { // Lanthanides
    row = 8; 
    col = spec.z - 57 + 3; // offset: Lanthanide row in grid row 8, columns 3 to 17
  }
  else if (spec.z >= 72 && spec.z <= 86) { row = 6; col = spec.z - 72 + 4; }
  
  else if (spec.z >= 87 && spec.z <= 88) { row = 7; col = spec.z - 86; }
  else if (spec.z >= 89 && spec.z <= 103) { // Actinides
    row = 9; 
    col = spec.z - 89 + 3; // offset: Actinide row in grid row 9, columns 3 to 17
  }
  else if (spec.z >= 104 && spec.z <= 118) { row = 7; col = spec.z - 104 + 4; }

  return {
    number: spec.z,
    symbol: spec.symbol,
    name: spec.name,
    mass: spec.mass,
    category: spec.category,
    phase: spec.phase,
    electronegativity: spec.en,
    density: spec.density,
    meltingPoint: spec.mp,
    summary: spec.summary,
    electronConfiguration: spec.config,
    row,
    col
  };
});

export function getElement(symbolOrNumber: string | number): TableElement | undefined {
  if (typeof symbolOrNumber === 'number') {
    return ELEMENTS_DATA.find(e => e.number === symbolOrNumber);
  }
  const sym = symbolOrNumber.toLowerCase().trim();
  return ELEMENTS_DATA.find(e => e.symbol.toLowerCase() === sym || e.name.toLowerCase() === sym);
}
