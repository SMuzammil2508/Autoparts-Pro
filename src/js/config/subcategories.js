// Auto Parts Sub-Category Taxonomy & Drill-Down Configuration
// High-precision sub-types for filters, brakes, suspension, ignition, electrical, cooling, belts & body

export const SUB_CATEGORIES_CONFIG = {
  "filters": [
    { id: "oil-filter", name: "Oil Filter", icon: "droplet", desc: "Engine lube oil filter elements & spin-on canisters", keywords: ["oil filter", "of-", "lube filter"] },
    { id: "air-filter", name: "Air Filter", icon: "wind", desc: "Engine air intake filter elements", keywords: ["air filter", "af-", "intake"] },
    { id: "cabin-ac-filter", name: "AC / Cabin Filter", icon: "fan", desc: "HVAC cabin pollen & dust filter", keywords: ["cabin", "ac filter", "cabin filter", "cf-"] },
    { id: "fuel-filter", name: "Fuel / Petrol Filter", icon: "fuel", desc: "In-line petrol & gas fuel filters", keywords: ["fuel filter", "petrol filter", "ff-"] },
    { id: "diesel-filter", name: "Diesel Fuel Filter", icon: "filter", desc: "High-pressure diesel sedimenter & filter", keywords: ["diesel filter", "diesel", "water separator"] },
    { id: "transmission-filter", name: "Transmission Filter", icon: "settings", desc: "Automatic & manual gearbox fluid filter", keywords: ["transmission", "gearbox filter"] }
  ],
  "brakes": [
    { id: "brake-pad", name: "Front / Rear Brake Pads", icon: "disc", desc: "Ceramic & metallic disc brake pads", keywords: ["brake pad", "disc pad", "bp-"] },
    { id: "brake-disc", name: "Brake Disc Rotors", icon: "circle-dot", desc: "Ventilated & solid disc rotors", keywords: ["brake disc", "rotor", "br-"] },
    { id: "brake-shoe", name: "Brake Shoes (Drum)", icon: "circle", desc: "Rear drum brake shoe sets", keywords: ["brake shoe", "bs-", "drum brake"] },
    { id: "brake-caliper", name: "Caliper & Wheel Cylinder", icon: "wrench", desc: "Hydraulic calipers & master cylinders", keywords: ["caliper", "cylinder", "master cylinder", "brake oil"] },
    { id: "brake-fluid", name: "Brake Fluid (DOT 3/4)", icon: "droplet", desc: "DOT 3 & DOT 4 hydraulic brake fluid", keywords: ["dot 3", "dot 4", "brake fluid"] }
  ],
  "suspension": [
    { id: "shock-absorber", name: "Shock Absorbers / Struts", icon: "activity", desc: "Front & rear gas/hydraulic shockups", keywords: ["shock absorber", "strut", "shockup", "sa-", "sk-"] },
    { id: "coil-spring", name: "Coil Springs & Buffers", icon: "sliders", desc: "Suspension coil springs & rubber pads", keywords: ["spring", "coil spring", "buffer"] },
    { id: "control-arm", name: "Lower Control Arm", icon: "git-commit", desc: "Suspension wishbone arms & bushes", keywords: ["control arm", "wishbone", "ca-", "arm"] },
    { id: "wheel-bearing", name: "Wheel Bearing & Hub", icon: "circle", desc: "Front & rear wheel hub bearings", keywords: ["wheel bearing", "hub assembly", "wb-", "bearing"] },
    { id: "tie-rod-balljoint", name: "Tie Rod & Ball Joints", icon: "link", desc: "Steering rack ends, tie rods & link rods", keywords: ["tie rod", "ball joint", "link rod", "stabilizer"] }
  ],
  "ignition": [
    { id: "spark-plug", name: "Spark Plugs (Iridium/Copper)", icon: "flame", desc: "High ignition spark plugs & packs", keywords: ["spark plug", "sp-", "iridium", "copper"] },
    { id: "ignition-coil", name: "Ignition Coils & Packs", icon: "zap", desc: "12V Electronic ignition coils", keywords: ["ignition coil", "coil pack", "ic-"] },
    { id: "glow-plug", name: "Diesel Glow Plugs", icon: "sun", desc: "Cold start diesel heater plugs", keywords: ["glow plug", "heater plug"] },
    { id: "fuel-pump", name: "Fuel Pump / Injectors", icon: "gauge", desc: "Electric fuel pump & rail injectors", keywords: ["fuel pump", "fp-", "injector"] }
  ],
  "electrical": [
    { id: "battery", name: "Battery & Alternator", icon: "battery-charging", desc: "12V starter batteries & alternators", keywords: ["battery", "alternator", "dynamo"] },
    { id: "starter-motor", name: "Starter Motor", icon: "power", desc: "Engine self starter assembly", keywords: ["starter motor", "self starter"] },
    { id: "bulbs-led", name: "Headlights & LED Bulbs", icon: "lightbulb", desc: "H4, H7, LED projector bulbs", keywords: ["bulb", "headlight", "led", "fog light"] },
    { id: "sensors", name: "Sensors (O2, ABS, MAP)", icon: "radio", desc: "Electronic sensors & ECU relays", keywords: ["sensor", "abs sensor", "oxygen", "map sensor"] }
  ],
  "clutch": [
    { id: "clutch-plate", name: "Clutch Friction Plate", icon: "disc", desc: "Clutch friction disc assembly", keywords: ["clutch plate", "friction disc"] },
    { id: "clutch-cover", name: "Clutch Pressure Plate", icon: "shield", desc: "Diaphragm clutch cover assembly", keywords: ["pressure plate", "clutch cover"] },
    { id: "release-bearing", name: "Clutch Release Bearing", icon: "circle", desc: "Hydraulic & mechanical throwout bearing", keywords: ["release bearing", "throwout bearing"] }
  ],
  "cooling": [
    { id: "radiator", name: "Radiator Assembly", icon: "wind", desc: "Aluminum coolant radiator core", keywords: ["radiator", "intercooler"] },
    { id: "water-pump", name: "Engine Water Pump", icon: "droplet", desc: "Coolant circulating water pump", keywords: ["water pump", "coolant pump"] },
    { id: "thermostat", name: "Thermostat Valve", icon: "thermometer", desc: "Coolant temperature thermostat valve", keywords: ["thermostat", "housing"] },
    { id: "fan-motor", name: "Radiator Cooling Fan", icon: "fan", desc: "12V Electric radiator fan & shroud", keywords: ["fan motor", "cooling fan"] }
  ],
  "belts": [
    { id: "timing-belt", name: "Timing Belt / Chain Kit", icon: "rotate-cw", desc: "Camshaft timing belt & tensioner kit", keywords: ["timing belt", "timing chain"] },
    { id: "fan-belt", name: "Serpentine / Fan Belt", icon: "repeat", desc: "Alternator & AC compressor belt", keywords: ["fan belt", "serpentine", "alternator belt", "v-belt"] },
    { id: "tensioner", name: "Belt Tensioner Pulley", icon: "disc", desc: "Automatic belt tensioner & idler", keywords: ["tensioner", "idler pulley"] }
  ],
  "body": [
    { id: "wiper-blades", name: "Frameless Wiper Blades", icon: "wrench", desc: "All-weather silicone wiper blades", keywords: ["wiper", "wiper blade", "windshield", "wp-"] },
    { id: "mirrors-glass", name: "Side Mirrors & Glass", icon: "square", desc: "Door rearview mirror glass & assembly", keywords: ["mirror", "side mirror", "glass"] }
  ]
};
