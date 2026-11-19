// Hand-written seed content for FoodDash.
// Restaurant names are fictional; dishes and photos come from TheMealDB (see meals.json).

export const EXCLUDED_DISHES = [
  "Big Mac",
  "Chick-Fil-A Sandwich",
  "Pizza Express Margherita",
  "Fettucine alfredo",
  "Smoked Haddock Kedgeree",
];

export const CATEGORIES = [
  { name: "Indian", description: "Slow-cooked curries, smoky tandoor grills and fragrant biryani layered with saffron rice." },
  { name: "Italian", description: "Fresh pasta, wood-fired flavours and creamy risottos made the way Italian families cook them." },
  { name: "Chinese", description: "Wok-tossed noodles, crispy stir-fries and comforting soups with bold Sichuan and Cantonese notes." },
  { name: "Japanese", description: "Crisp katsu, glossy teriyaki, sushi and steaming bowls of udon prepared with precision." },
  { name: "Thai", description: "Fragrant curries and street-style noodles balancing sweet, sour, salty and spicy in every bite." },
  { name: "American", description: "Stacked burgers, slow-roasted brisket, mac and cheese and indulgent bakery desserts." },
  { name: "Turkish", description: "Charcoal-grilled kebabs, warm flatbreads, smoky aubergine and honey-soaked baklava." },
  { name: "Vietnamese", description: "Light, herb-packed pho, crunchy bánh mì and fresh noodle salads with zesty dressings." },
];

// city / area pairs used for restaurant locations
export const LOCATIONS = {
  Dhaka: ["Gulshan 2", "Banani", "Dhanmondi", "Uttara", "Bashundhara R/A", "Mirpur 10", "Mohammadpur"],
  Chattogram: ["GEC Circle", "Agrabad", "Khulshi"],
  Sylhet: ["Zindabazar", "Uposhohor"],
};

export const RESTAURANTS = [
  // ---------- Indian ----------
  {
    name: "Saffron Lane Kitchen", cuisine: "Indian", city: "Dhaka", area: "Gulshan 2",
    tagline: "Royal biryani and slow-cooked curries",
    description: "Saffron Lane Kitchen cooks its biryani the dum way: rice and marinated meat sealed in a heavy pot and steamed for hours until every grain carries the spices. The kitchen grinds its own garam masala each morning and finishes curries with fresh cream and coriander. Portions are generous and every order ships in sealed, leak-proof containers.",
    priceLevel: 2, avgMealPrice: 420, deliveryFee: 49, minOrder: 300, time: [30, 45], vegan: true, featured: true,
    hours: "11:30 AM – 11:00 PM",
  },
  {
    name: "Tandoor Theory", cuisine: "Indian", city: "Chattogram", area: "GEC Circle",
    tagline: "Clay-oven grills and smoky kebabs",
    description: "Everything at Tandoor Theory starts in a 480°C clay oven. Chicken is marinated overnight in yoghurt, kashmiri chilli and mustard oil, then charred until juicy inside and smoky outside. Pair the grills with buttery dal fry and fresh naan for a complete North Indian meal.",
    priceLevel: 2, avgMealPrice: 380, deliveryFee: 39, minOrder: 250, time: [25, 40], vegan: false, featured: false,
    hours: "12:00 PM – 11:30 PM",
  },
  {
    name: "Masala Junction House", cuisine: "Indian", city: "Dhaka", area: "Mirpur 10",
    tagline: "Home-style curries at everyday prices",
    description: "Masala Junction House is the neighbourhood kitchen for honest, home-style Indian food. Expect paneer simmered in tomato gravy, comforting kidney bean curry and fragrant mandi rice, all cooked fresh in small batches. A favourite with students and office teams for its fair prices and quick delivery.",
    priceLevel: 1, avgMealPrice: 260, deliveryFee: 29, minOrder: 200, time: [20, 35], vegan: true, featured: false,
    hours: "10:00 AM – 10:30 PM",
  },
  // ---------- Italian ----------
  {
    name: "Trattoria Lucca", cuisine: "Italian", city: "Dhaka", area: "Banani",
    tagline: "Fresh pasta rolled every morning",
    description: "Trattoria Lucca rolls its pasta by hand every morning using semolina and free-range eggs. The carbonara is made the Roman way with egg yolk, pecorino and black pepper, no cream, and the lasagne bakes slowly in layers of ragù and béchamel. A small, focused menu that does the classics properly.",
    priceLevel: 3, avgMealPrice: 690, deliveryFee: 69, minOrder: 500, time: [35, 50], vegan: false, featured: true,
    hours: "12:00 PM – 11:00 PM",
  },
  {
    name: "Basil & Ember", cuisine: "Italian", city: "Sylhet", area: "Zindabazar",
    tagline: "Italian comfort food with a modern twist",
    description: "Basil & Ember brings modern Italian cooking to Sylhet. Seafood linguine is tossed with chilli and garlic, the risotto is stirred to order with salmon and prawns, and the ribollita is a hearty Tuscan bread soup packed with vegetables. Desserts include a silky baked ricotta pudding.",
    priceLevel: 2, avgMealPrice: 540, deliveryFee: 49, minOrder: 400, time: [30, 45], vegan: true, featured: false,
    hours: "12:30 PM – 10:30 PM",
  },
  {
    name: "Nonna's Table", cuisine: "Italian", city: "Dhaka", area: "Uttara",
    tagline: "Generous family-style pasta bowls",
    description: "Nonna's Table cooks the way an Italian grandmother would: big bowls, rich sauces and no shortcuts. The bolognese simmers for four hours, fettuccine Alfredo is finished with real parmesan, and the potato gratin with chicken is built for sharing. Ideal for family dinners and weekend treats.",
    priceLevel: 2, avgMealPrice: 480, deliveryFee: 39, minOrder: 350, time: [30, 40], vegan: false, featured: false,
    hours: "11:00 AM – 11:00 PM",
  },
  // ---------- Chinese ----------
  {
    name: "Red Lantern Wok", cuisine: "Chinese", city: "Dhaka", area: "Dhanmondi",
    tagline: "High-heat wok cooking since day one",
    description: "Red Lantern Wok cooks every dish over a roaring wok burner to capture wok hei, the smoky 'breath of the wok'. Kung pao chicken arrives glossy with toasted peanuts and dried chillies, and the beef lo mein is tossed with crunchy vegetables in a dark soy glaze. Soups are made from a slow-simmered house stock.",
    priceLevel: 2, avgMealPrice: 360, deliveryFee: 39, minOrder: 300, time: [25, 40], vegan: true, featured: true,
    hours: "11:30 AM – 11:30 PM",
  },
  {
    name: "Golden Bamboo", cuisine: "Chinese", city: "Chattogram", area: "Agrabad",
    tagline: "Cantonese classics and comforting congee",
    description: "Golden Bamboo specialises in gentle Cantonese cooking: silky chicken congee, egg foo young and tomato egg stir-fry that tastes like home. The kitchen keeps oil and salt in check, so it is a reliable choice when you want something light but satisfying.",
    priceLevel: 1, avgMealPrice: 290, deliveryFee: 29, minOrder: 200, time: [20, 35], vegan: true, featured: false,
    hours: "10:30 AM – 10:30 PM",
  },
  {
    name: "Sichuan Alley", cuisine: "Chinese", city: "Dhaka", area: "Bashundhara R/A",
    tagline: "Fiery Sichuan heat for spice lovers",
    description: "Sichuan Alley is for diners who like it hot. Ma po tofu comes bubbling with chilli bean paste and numbing Sichuan pepper, kung po prawns are wok-fried with dried chillies, and the hot and sour soup is properly sharp. Every dish lists its heat level so you can order with confidence.",
    priceLevel: 2, avgMealPrice: 420, deliveryFee: 49, minOrder: 300, time: [30, 45], vegan: false, featured: false,
    hours: "12:00 PM – 11:00 PM",
  },
  // ---------- Japanese ----------
  {
    name: "Umami Lane", cuisine: "Japanese", city: "Dhaka", area: "Gulshan 2",
    tagline: "Katsu, teriyaki and hand-rolled sushi",
    description: "Umami Lane brings Tokyo-style comfort food to Gulshan. Pork and chicken katsu are coated in airy panko and fried to a perfect crunch, teriyaki salmon is glazed over charcoal, and sushi is rolled to order with properly seasoned rice. Packaging keeps crispy dishes separate so nothing arrives soggy.",
    priceLevel: 3, avgMealPrice: 760, deliveryFee: 69, minOrder: 600, time: [35, 50], vegan: false, featured: true,
    hours: "12:00 PM – 10:30 PM",
  },
  {
    name: "Kaze Ramen & Grill", cuisine: "Japanese", city: "Dhaka", area: "Banani",
    tagline: "Noodle bowls and Japanese grill plates",
    description: "Kaze Ramen & Grill serves thick yaki udon tossed on the teppan, karaage chicken marinated in ginger and soy, and katsu curry with a mellow, slightly sweet roux. Rice bowls come with a soft egg and pickles on the side, just like a Tokyo lunch counter.",
    priceLevel: 2, avgMealPrice: 560, deliveryFee: 49, minOrder: 400, time: [30, 45], vegan: false, featured: false,
    hours: "11:30 AM – 11:00 PM",
  },
  {
    name: "Sakura Bento Bar", cuisine: "Japanese", city: "Chattogram", area: "Khulshi",
    tagline: "Balanced bento boxes for busy days",
    description: "Sakura Bento Bar builds balanced bento boxes around steamed gohan rice, a protein such as teriyaki chicken or katsudon, and seasonal sides. It is a popular office lunch choice in Khulshi because orders are portioned, neatly packed and delivered on time.",
    priceLevel: 2, avgMealPrice: 480, deliveryFee: 39, minOrder: 350, time: [25, 40], vegan: false, featured: false,
    hours: "11:00 AM – 9:30 PM",
  },
  // ---------- Thai ----------
  {
    name: "Lemongrass Courtyard", cuisine: "Thai", city: "Dhaka", area: "Gulshan 2",
    tagline: "Aromatic curries with fresh herbs",
    description: "Lemongrass Courtyard pounds its own curry pastes from lemongrass, galangal and fresh chillies. The massaman beef is slow-braised until tender in coconut milk with peanuts and potato, and the panang chicken is rich and fragrant. Every curry comes with jasmine rice and a wedge of lime.",
    priceLevel: 3, avgMealPrice: 650, deliveryFee: 59, minOrder: 500, time: [35, 50], vegan: true, featured: true,
    hours: "12:00 PM – 11:00 PM",
  },
  {
    name: "Bangkok Street Pot", cuisine: "Thai", city: "Dhaka", area: "Dhanmondi",
    tagline: "Street-style noodles from Bangkok",
    description: "Bangkok Street Pot recreates the noodle stalls of Bangkok: pad thai with tamarind and crushed peanuts, smoky pad see ew and fiery drunken noodles with holy basil. Dishes are cooked in small batches in a carbon-steel wok for that charred street-food edge.",
    priceLevel: 1, avgMealPrice: 320, deliveryFee: 29, minOrder: 250, time: [20, 35], vegan: true, featured: false,
    hours: "11:00 AM – 11:30 PM",
  },
  {
    name: "Coconut & Chili", cuisine: "Thai", city: "Sylhet", area: "Uposhohor",
    tagline: "Thai seafood and coconut broths",
    description: "Coconut & Chili focuses on Thai seafood: spicy prawn noodles, fried rice with prawns and peas, and a comforting coconut and vegetable broth. Sauces are balanced with palm sugar, fish sauce and lime so every bowl hits that sweet-sour-spicy Thai balance.",
    priceLevel: 2, avgMealPrice: 450, deliveryFee: 39, minOrder: 300, time: [30, 45], vegan: false, featured: false,
    hours: "12:00 PM – 10:00 PM",
  },
  // ---------- American ----------
  {
    name: "Smokestack Diner", cuisine: "American", city: "Dhaka", area: "Uttara",
    tagline: "Burgers, brisket and diner classics",
    description: "Smokestack Diner smokes its brisket for twelve hours over hardwood and grinds burger patties fresh every day. The menu covers the diner favourites: halloumi chicken burgers, sloppy joes, mac and cheese and stacks of banana pancakes for late breakfasts.",
    priceLevel: 2, avgMealPrice: 520, deliveryFee: 49, minOrder: 400, time: [25, 40], vegan: false, featured: true,
    hours: "8:00 AM – 12:00 AM",
  },
  {
    name: "Liberty Grill Co.", cuisine: "American", city: "Chattogram", area: "GEC Circle",
    tagline: "Hearty roasts and grilled chicken plates",
    description: "Liberty Grill Co. serves the kind of hearty plates you want after a long day: honey balsamic chicken with crispy potatoes, a slow pot-roast of beef brisket and creamy clam chowder. Each plate is built with a protein, a vegetable and a proper side.",
    priceLevel: 2, avgMealPrice: 560, deliveryFee: 49, minOrder: 400, time: [30, 45], vegan: false, featured: false,
    hours: "12:00 PM – 11:00 PM",
  },
  {
    name: "Sweet Hollow Bakehouse", cuisine: "American", city: "Dhaka", area: "Mohammadpur",
    tagline: "Pies, brownies and late-night desserts",
    description: "Sweet Hollow Bakehouse bakes everything in-house each afternoon: chocolate raspberry brownies, pecan pie with chocolate chips, cream cheese tarts and breakfast pastries. Desserts are packed in rigid boxes so they arrive looking exactly as they left the oven.",
    priceLevel: 1, avgMealPrice: 280, deliveryFee: 29, minOrder: 200, time: [20, 30], vegan: false, featured: false,
    hours: "2:00 PM – 1:00 AM",
  },
  // ---------- Turkish ----------
  {
    name: "Anatolia Ocakbaşı", cuisine: "Turkish", city: "Dhaka", area: "Gulshan 2",
    tagline: "Charcoal kebabs from the Anatolian grill",
    description: "At Anatolia Ocakbaşı the grill is the heart of the kitchen. Adana kebab is hand-minced lamb with red pepper, pressed onto wide skewers and cooked over charcoal. Kebabs arrive with warm flatbread, smoky ezme salad and cool cacık, just as they would in Istanbul.",
    priceLevel: 3, avgMealPrice: 720, deliveryFee: 59, minOrder: 500, time: [35, 50], vegan: false, featured: true,
    hours: "12:00 PM – 11:30 PM",
  },
  {
    name: "Bosphorus Kebab House", cuisine: "Turkish", city: "Dhaka", area: "Bashundhara R/A",
    tagline: "Wraps, mezze and grilled lamb",
    description: "Bosphorus Kebab House is built for quick, flavour-packed meals: cumin lamb wraps with crunchy slaw, falafel with hummus, and chilli ginger lamb chops. The mezze platter, with hummus, ezme and griddled flatbreads, is ideal for sharing.",
    priceLevel: 2, avgMealPrice: 450, deliveryFee: 39, minOrder: 300, time: [25, 40], vegan: true, featured: false,
    hours: "11:30 AM – 11:30 PM",
  },
  {
    name: "Istanbul Mezze Garden", cuisine: "Turkish", city: "Sylhet", area: "Zindabazar",
    tagline: "Vegetable-forward Turkish mezze",
    description: "Istanbul Mezze Garden celebrates the vegetable side of Turkish cooking: griddled aubergines with sesame dressing, spiced chickpeas with walnut sauce, couscous salad and warming çorba. Many dishes are naturally vegan, and the baklava is a must for dessert.",
    priceLevel: 2, avgMealPrice: 390, deliveryFee: 39, minOrder: 300, time: [30, 40], vegan: true, featured: false,
    hours: "12:00 PM – 10:30 PM",
  },
  // ---------- Vietnamese ----------
  {
    name: "Pho Saigon Bowl", cuisine: "Vietnamese", city: "Dhaka", area: "Banani",
    tagline: "Eight-hour beef pho and fresh herbs",
    description: "Pho Saigon Bowl simmers its beef broth for eight hours with charred onion, ginger, star anise and cinnamon. Bowls ship with broth and noodles packed separately, plus fresh herbs, lime and chilli, so your pho tastes freshly assembled when it reaches you.",
    priceLevel: 2, avgMealPrice: 490, deliveryFee: 49, minOrder: 350, time: [30, 45], vegan: false, featured: true,
    hours: "11:00 AM – 10:30 PM",
  },
  {
    name: "Hanoi Lantern", cuisine: "Vietnamese", city: "Chattogram", area: "Agrabad",
    tagline: "Light noodle salads and seafood",
    description: "Hanoi Lantern keeps things fresh and light: prawn and noodle salad with crispy shallots, salt and pepper squid, and sea bass with sizzled ginger and spring onion. Dressings are made daily with lime, fish sauce and palm sugar.",
    priceLevel: 2, avgMealPrice: 520, deliveryFee: 49, minOrder: 400, time: [30, 45], vegan: false, featured: false,
    hours: "12:00 PM – 10:00 PM",
  },
  {
    name: "Banh Mi Corner", cuisine: "Vietnamese", city: "Dhaka", area: "Dhanmondi",
    tagline: "Crunchy bánh mì and rice-paper rolls",
    description: "Banh Mi Corner bakes light, crackly baguettes every morning and fills them with lemongrass meats, pickled carrot and daikon, cucumber and fresh coriander. Rice-paper dumplings and barbecue pork buns round out a quick, affordable lunch menu.",
    priceLevel: 1, avgMealPrice: 270, deliveryFee: 29, minOrder: 200, time: [20, 30], vegan: true, featured: false,
    hours: "9:00 AM – 9:00 PM",
  },
];

export const ADMIN = { name: "Nadia Rahman", email: "admin@fooddash.app", password: "Admin@1234", city: "Dhaka", phone: "+880 1711-000101", address: "House 12, Road 7, Gulshan 2, Dhaka", bio: "Operations lead at FoodDash. I review new restaurant partners and keep the marketplace running smoothly." };
export const DEMO_USER = { name: "Arif Hossain", email: "user@fooddash.app", password: "User@1234", city: "Dhaka", phone: "+880 1711-000202", address: "Flat 4B, House 21, Road 11, Banani, Dhaka", bio: "Software engineer, weekend home cook and biryani enthusiast." };

export const CUSTOMERS = [
  ["Tanvir Ahmed", "Dhaka"], ["Sadia Islam", "Dhaka"], ["Rafiq Chowdhury", "Chattogram"], ["Mehjabin Karim", "Dhaka"],
  ["Imran Hasan", "Sylhet"], ["Farzana Akter", "Dhaka"], ["Shahriar Kabir", "Chattogram"], ["Nusrat Jahan", "Dhaka"],
  ["Zubair Alam", "Sylhet"], ["Tasnia Rahman", "Dhaka"], ["Kamrul Hasan", "Chattogram"], ["Lamia Sultana", "Dhaka"],
];

export const REVIEW_COMMENTS = {
  5: [
    "Arrived hot and well packed. Easily the best {dish} I have ordered online.",
    "Generous portions and the flavours were spot on. Ordering again this weekend.",
    "The rider was polite and the food came ten minutes earlier than estimated. Excellent.",
    "Tasted freshly made, not like typical delivery food. The {dish} was outstanding.",
    "Perfect for our office lunch. Everyone loved it and the packaging did not leak at all.",
    "Consistently great. I have ordered five times and the quality never drops.",
    "Spice level was exactly as described. Loved the {dish}, will recommend to friends.",
  ],
  4: [
    "Very tasty {dish}. Delivery took a little longer than expected but it was still warm.",
    "Good food and fair prices. I would like slightly bigger portions of the sides.",
    "Solid choice for dinner. The {dish} was the highlight of the order.",
    "Fresh ingredients and neat packaging. Would be five stars with a bit more sauce.",
    "Really enjoyed it. Ordering through FoodDash was quick and the tracking was accurate.",
  ],
  3: [
    "The {dish} was good but one item was missing from the order. Support refunded it quickly.",
    "Decent food, though it arrived lukewarm on a rainy evening.",
    "Average overall. Flavours were fine but a bit too oily for my taste.",
  ],
};

export const BLOG_POSTS = [
  {
    title: "How a 30-Minute Delivery Actually Works",
    excerpt: "From the moment you tap 'Place order' to the knock on your door: a step-by-step look at what happens behind the scenes.",
    tags: ["Delivery", "Behind the scenes"], readMinutes: 4, coverDish: "Chicken Fried Rice",
    content: `When you place an order on FoodDash, a surprising amount happens in the first sixty seconds. The restaurant's tablet chimes, the order is checked against the menu and the kitchen gets a printed ticket with your notes.

## Preparation starts immediately
Most partner kitchens begin cooking within two minutes of accepting an order. Dishes that travel badly, such as fried or crispy items, are cooked last so they spend the least time in the box.

## Matching a rider
While your food is cooking, we look for the nearest available rider whose route lets them reach the restaurant just as the food is ready. Arriving too early wastes the rider's time; arriving too late lets food cool down.

## Packaging matters
Our partners use sealed, vented containers. Vents let steam escape so fries stay crisp, while sealed lids keep curries and soups from spilling.

## The last mile
Riders carry insulated bags and follow an optimised route. You can follow every step from 'Confirmed' to 'Delivered' on your order page, and you will be notified the moment your food is on its way.`,
  },
  {
    title: "A Beginner's Guide to Thai Curries",
    excerpt: "Red, green, panang or massaman? Here is how the most popular Thai curries differ and which one to try first.",
    tags: ["Cuisine guide", "Thai"], readMinutes: 5, coverDish: "Massaman Beef curry",
    content: `Thai curries all start with a paste of herbs and spices pounded together, but the ingredients in that paste change everything.

## Red curry
Made with dried red chillies, red curry is bold and moderately spicy. It pairs well with chicken, duck and prawns.

## Panang curry
Panang is thicker and sweeter than red curry, with crushed peanuts stirred into the paste. It is a great choice if you like rich, creamy sauces.

## Massaman curry
Massaman shows Persian and Indian influence, with warm spices such as cinnamon, cardamom and clove. It is usually the mildest curry on the menu and is often made with slow-braised beef and potatoes.

## How to order
If you are new to Thai food, start with massaman or panang. Ask for jasmine rice on the side and add a fresh, sharp dish such as a papaya or noodle salad to balance the richness.`,
  },
  {
    title: "7 Smart Swaps for Healthier Takeaway",
    excerpt: "You do not have to give up delivery to eat well. Small changes to how you order make a big difference.",
    tags: ["Healthy eating", "Tips"], readMinutes: 4, coverDish: "Mediterranean Pasta Salad",
    content: `Ordering in does not have to mean eating heavy. These swaps keep the flavour while cutting excess oil, salt and sugar.

## 1. Grilled over fried
Choose tandoori, teriyaki or charcoal-grilled dishes instead of deep-fried ones.

## 2. Broth-based soups
Pho, congee and clear soups are filling and lighter than cream-based options.

## 3. Sauce on the side
Ask for dressings and sauces separately so you control how much you use.

## 4. Add a vegetable dish
Stir-fried greens, salads or dal add fibre and make the meal more balanced.

## 5. Share the dessert
Desserts travel well, so split one between two people or save half for later.

## 6. Watch the drinks
Water or unsweetened tea keeps the total calories of the order down.

## 7. Use filters
On FoodDash, the vegan-friendly filter and restaurant descriptions help you find lighter kitchens quickly.`,
  },
  {
    title: "Comfort Food Around the World: Biryani, Pho and Ramen",
    excerpt: "Three dishes, three countries, one idea: food that feels like home. Why these bowls travel so well.",
    tags: ["Cuisine guide", "Culture"], readMinutes: 5, coverDish: "Lamb Biryani",
    content: `Some dishes are more than a meal. Biryani, pho and ramen are cooked for celebrations and for ordinary weeknights, and each has a story.

## Biryani
Biryani layers spiced meat with long-grain rice and saffron, then seals the pot so everything steams together. Every region has its own version, from the rich Kolkata style with potato to the fiery Hyderabadi dum biryani.

## Pho
Vietnam's pho is all about the broth: beef bones simmered for hours with charred onion, ginger and star anise. Fresh herbs, lime and chilli are added at the table, so each bowl is personal.

## Ramen
Japanese ramen combines springy wheat noodles with a deeply savoury broth and toppings such as a soft egg, seaweed and spring onions.

## Why they travel well
All three are built from components that can be packed separately and combined at home, which is exactly how our partner kitchens send them out.`,
  },
  {
    title: "Food Safety Between Kitchen and Doorstep",
    excerpt: "Temperature, packaging and hygiene: the standards every FoodDash partner and rider follows on every order.",
    tags: ["Food safety", "Partners"], readMinutes: 3, coverDish: "Chicken Congee",
    content: `Good food is only good if it is safe. Every restaurant that joins FoodDash goes through an approval review before its menu goes live.

## Temperature control
Hot food should stay above 60°C and cold food below 5°C. Riders use insulated bags that are cleaned daily, and kitchens time cooking so food is not left waiting.

## Tamper-evident packaging
Orders are sealed in the kitchen. If you receive a bag with a broken seal, report it from your order page and our support team will make it right.

## Allergen information
Restaurants list key ingredients for each dish. If you have an allergy, add a note to your order and contact the restaurant before it is prepared.

## Ratings keep everyone honest
Your reviews are shown on each restaurant page and are monitored by our team. Consistently low scores trigger a quality review with the partner.`,
  },
  {
    title: "Taking Your Restaurant Online: A Partner Checklist",
    excerpt: "Thinking of listing your kitchen on FoodDash? Here is what makes a restaurant page convert browsers into regulars.",
    tags: ["Partners", "Business"], readMinutes: 4, coverDish: "Adana kebab",
    content: `Listing a restaurant on FoodDash takes a few minutes, but a great listing takes a little more thought.

## Use real photos
Customers decide with their eyes. Upload clear, well-lit photos of your actual dishes rather than stock images.

## Write a clear description
Explain what makes your kitchen different: a cooking technique, a family recipe or a regional speciality.

## Keep the menu focused
A shorter menu with dishes that travel well beats a long one. Mark your most popular items so new customers know where to start.

## Set realistic delivery times
It is better to promise 40 minutes and arrive in 35 than the other way round. Accurate estimates lead to better ratings.

## Reply to feedback
Read your reviews in the dashboard and act on recurring comments. Restaurants that respond to feedback see more repeat orders.

Once your listing is submitted, our team reviews it, usually within one working day, and you will see the status change to Approved in your dashboard.`,
  },
];

export const CONTACT_MESSAGES = [
  { name: "Tanvir Ahmed", email: "tanvir.ahmed@example.com", subject: "Delivery to Purbachal", message: "Do you deliver to Purbachal sector 1? The app shows no restaurants when I enter my address there.", status: "NEW" },
  { name: "Sadia Islam", email: "sadia.islam@example.com", subject: "Partnership enquiry", message: "I run a home bakery in Dhanmondi and would like to list my cakes on FoodDash. What documents do I need?", status: "READ" },
  { name: "Kamrul Hasan", email: "kamrul.hasan@example.com", subject: "Missing item refund", message: "My order last night was missing one portion of fried rice. The support chat resolved it with a refund. Thank you!", status: "RESOLVED" },
];
