-- Maison Amie — Voorbeelddata voor de database
-- Voer dit uit NADAT je schema.sql hebt uitgevoerd

-- 6 Suites invoegen
INSERT INTO rooms (name_nl, name_fr, name_en, description_nl, description_fr, description_en, max_guests, price_per_night, amenities, images) VALUES
(
  'Suite Lavande',
  'Suite Lavande',
  'Suite Lavande',
  'Een serene suite met uitzicht op de lavendelvelden. Voorzien van een kingsize bed, en-suite badkamer met vrijstaand bad en een privéterras.',
  'Une suite sereine avec vue sur les champs de lavande. Équipée d''un lit king size, d''une salle de bain en suite avec baignoire indépendante et d''une terrasse privée.',
  'A serene suite with views of the lavender fields. Features a king-size bed, en-suite bathroom with freestanding bath and a private terrace.',
  2, 140.00,
  '["Kingsize bed", "Privéterras", "Vrijstaand bad", "Airconditioning", "WiFi", "Nespresso"]',
  '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"]'
),
(
  'Suite Soleil',
  'Suite Soleil',
  'Suite Soleil',
  'Licht en ruimtelijk, met grote ramen die de zon binnenlaten. Perfect voor stellen die willen genieten van de warmte van de Languedoc.',
  'Lumineuse et spacieuse, avec de grandes fenêtres qui laissent entrer le soleil. Parfait pour les couples qui souhaitent profiter de la chaleur du Languedoc.',
  'Light and spacious, with large windows letting in the sun. Perfect for couples who want to enjoy the warmth of the Languedoc.',
  2, 120.00,
  '["Queensize bed", "Uitzicht op tuin", "Inloopdouche", "Airconditioning", "WiFi", "Minibar"]',
  '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"]'
),
(
  'Suite Olivier',
  'Suite Olivier',
  'Suite Olivier',
  'Geïnspireerd door de eeuwenoude olijfbomen in de tuin. Rustieke charme gecombineerd met moderne comfort, met eigen toegang tot de tuin.',
  'Inspirée par les oliviers centenaires du jardin. Charme rustique combiné avec un confort moderne, avec accès direct au jardin.',
  'Inspired by the century-old olive trees in the garden. Rustic charm combined with modern comfort, with direct garden access.',
  3, 130.00,
  '["Kingsize bed", "Eigen tuintoegang", "Badkamer met douche", "Airconditioning", "WiFi", "Zithoek"]',
  '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"]'
),
(
  'Suite Romarin',
  'Suite Romarin',
  'Suite Romarin',
  'Een knus en romantisch verblijf, gedecoreerd met Provençaalse textiel en geuren. Ideaal voor een romantisch weekend.',
  'Un séjour cosy et romantique, décoré de textiles et de parfums provençaux. Idéal pour un week-end romantique.',
  'A cosy and romantic stay, decorated with Provençal textiles and scents. Ideal for a romantic weekend.',
  2, 110.00,
  '["Tweepersoons bed", "Bad en douche", "Balkon", "Airconditioning", "WiFi", "Ontbijtmand"]',
  '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]'
),
(
  'Suite Mistral',
  'Suite Mistral',
  'Suite Mistral',
  'Onze grootste suite, vernoemd naar de beroemde wind van het zuiden. Met een aparte woonkamer, een grote badkamer en panoramisch uitzicht.',
  'Notre plus grande suite, nommée d''après le célèbre vent du sud. Avec un salon séparé, une grande salle de bain et une vue panoramique.',
  'Our largest suite, named after the famous southern wind. With a separate living room, large bathroom and panoramic views.',
  4, 175.00,
  '["Kingsize bed", "Aparte woonkamer", "Ligbad + douche", "Panoramisch uitzicht", "Airconditioning", "WiFi", "Nespresso", "Minibar"]',
  '["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"]'
),
(
  'Suite Garrigue',
  'Suite Garrigue',
  'Suite Garrigue',
  'Vernoemd naar de karakteristieke struikvegetatie van Zuid-Frankrijk. Een authentieke suite met houten balken, terracotta vloer en traditionele inrichting.',
  'Nommée d''après la végétation caractéristique du sud de la France. Une suite authentique avec des poutres en bois, un sol en terre cuite et une décoration traditionnelle.',
  'Named after the characteristic scrubland of South France. An authentic suite with wooden beams, terracotta floor and traditional furnishings.',
  2, 125.00,
  '["Tweepersoons bed", "Terracotta vloer", "Authentiek interieur", "Douche", "Airconditioning", "WiFi"]',
  '["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"]'
);

-- 5 Activiteiten invoegen
INSERT INTO activities (name_nl, name_fr, name_en, description_nl, description_fr, description_en, price, duration_minutes, max_participants, category) VALUES
(
  'Moestuinworkshop',
  'Atelier potager',
  'Kitchen Garden Workshop',
  'Leer van onze tuinman alles over het kweken van groenten en kruiden in onze prachtige moestuin. Voor beginners en gevorderden.',
  'Apprenez tout sur la culture des légumes et des herbes aromatiques dans notre magnifique potager.',
  'Learn everything about growing vegetables and herbs in our beautiful kitchen garden.',
  25.00, 120, 8, 'workshop'
),
(
  'Fietsverhuur',
  'Location de vélos',
  'Bike Rental',
  'Verken de omgeving op uw eigen tempo. Wij verhuren elektrische fietsen en gewone fietsen voor tochten door de Languedoc.',
  'Explorez la région à votre rythme avec nos vélos électriques et classiques.',
  'Explore the area at your own pace with our electric and regular bikes.',
  15.00, 480, 12, 'rental'
),
(
  'Kajakken',
  'Kayak',
  'Kayaking',
  'Een onvergetelijke dag op het water bij de Lac de Saint-Ferréol of op de rivier. Gids inbegrepen, geen ervaring vereist.',
  'Une journée inoubliable sur l''eau au Lac de Saint-Ferréol ou sur la rivière. Guide inclus.',
  'An unforgettable day on the water at Lac de Saint-Ferréol or on the river. Guide included.',
  45.00, 240, 10, 'outdoor'
),
(
  'Broodbakken',
  'Boulangerie maison',
  'Bread Baking',
  'Bak uw eigen brood in onze traditionele oven. Van het kneden van het deeg tot een knapperig brood uit de oven.',
  'Faites votre propre pain dans notre four traditionnel, du pétrissage à la cuisson.',
  'Bake your own bread in our traditional oven, from kneading to a crusty loaf from the oven.',
  30.00, 180, 6, 'workshop'
),
(
  'Pizza bakken',
  'Pizza au feu de bois',
  'Wood-fired Pizza',
  'Pizza bakken in onze houtgestookte steenoven. Maak uw eigen pizza van begin tot eind en geniet samen aan tafel.',
  'Faites votre pizza dans notre four à bois en pierre, de A à Z.',
  'Bake pizza in our wood-fired stone oven, creating your pizza from scratch.',
  25.00, 150, 8, 'workshop'
);
