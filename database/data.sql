-- =============================================================================
-- WANDERO Hotel Booking Platform - Sample Data Script
-- =============================================================================

USE stayease;

-- Clear previous sample data in order of foreign key dependency
DELETE FROM bookings;
DELETE FROM room_amenities;
DELETE FROM rooms;
DELETE FROM hotel_amenities;
DELETE FROM hotels;

-- 1. Hotels
INSERT INTO hotels (id, name, location, city, address, description, rating, image_url, created_at) VALUES
(1, 'The Grand Azure Beach Resort', 'Calangute, North Goa, India', 'Goa', '14 Coastal Highway, Calangute Beach Road, Goa 403516', 'A five-star beachfront sanctuary overlooking the Arabian Sea, featuring lush tropical gardens, a private infinity pool, and world-class seafood dining.', 4.85, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', NOW()),
(2, 'The Royal Haveli Heritage Palace', 'Civil Lines, Jaipur, Rajasthan, India', 'Jaipur', '88 Maharaja Sawai Ram Singh Road, Jaipur 302006', 'Authentic Rajasthani royal palace architecture seamlessly combined with modern opulent hospitality, courtyard musicians, and rooftop candlelit dining.', 4.92, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', NOW()),
(3, 'Marine Bayview Skyline Hotel', 'Marine Drive, Nariman Point, Mumbai, India', 'Mumbai', '220 Marine Drive Promenade, Mumbai 400021', 'A premier luxury city hotel along Mumbai’s iconic Queen\'s Necklace, featuring panoramic skyline vistas, business lounges, and rooftop infinity dining.', 4.78, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', NOW()),
(4, 'Whispering Pines Alpine Retreat', 'Old Manali, Himachal Pradesh, India', 'Manali', 'Pinewood Valley Road, Old Manali 175131', 'Cozy mountain chalet surrounded by snow-capped peaks and cedar pine forests. Enjoy warm stone fireplaces, stargazing balconies, and heated indoor wellness.', 4.82, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', NOW()),
(5, 'Silicon Oasis Tech Suites', 'Whitefield, Bengaluru, Karnataka, India', 'Bengaluru', '54 ITPL Main Road, Whitefield, Bengaluru 560066', 'A high-tech urban sanctuary in the heart of the Silicon Valley of India, equipped with smart automation, co-working pods, and solar-powered amenities.', 4.71, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', NOW()),
(6, 'Emerald Palm Backwater Sanctuary', 'Kumarakom, Kerala, India', 'Kerala', 'Vembanad Lake Shore, Kumarakom 686563', 'An eco-luxury wellness sanctuary nestled along the serene Vembanad Lake backwaters, renowned for authentic Ayurvedic rejuvenation and private houseboat tours.', 4.89, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', NOW());

-- 2. Hotel Amenities
INSERT INTO hotel_amenities (hotel_id, amenity) VALUES
(1, 'Free Wi-Fi'), (1, 'Swimming Pool'), (1, 'Beach Access'), (1, 'Spa & Wellness'), (1, 'Fine Dining Restaurant'), (1, 'Cocktail Bar'), (1, 'Free Breakfast'), (1, 'Airport Shuttle'),
(2, 'Free Wi-Fi'), (2, 'Heritage Courtyard'), (2, 'Royal Spa'), (2, 'Rooftop Restaurant'), (2, 'Swimming Pool'), (2, 'Cultural Performances'), (2, 'Free Valet Parking'), (2, '24/7 Concierge'),
(3, 'Free High-Speed Wi-Fi'), (3, 'Skyline Infinity Pool'), (3, 'Fitness Center'), (3, 'Executive Lounge'), (3, 'Business Center'), (3, 'Valet Parking'), (3, 'Multi-Cuisine Buffet'),
(4, 'Free Wi-Fi'), (4, 'Mountain Views'), (4, 'Fireplace Lounge'), (4, 'Heated Rooms'), (4, 'Trekking Guides'), (4, 'Hot Tub Spa'), (4, 'Organic Cafe'), (4, 'Campfire Evenings'),
(5, 'Gigabit Wi-Fi'), (5, '24/7 Co-working Space'), (5, 'Smart Keyless Entry'), (5, 'Fitness Gym'), (5, 'Rooftop Cafe'), (5, 'EV Charging Station'), (5, 'Soundproof Meeting Rooms'),
(6, 'Free Wi-Fi'), (6, 'Lakefront Pool'), (6, 'Ayurvedic Spa Center'), (6, 'Houseboat Cruises'), (6, 'Farm-to-Table Restaurant'), (6, 'Yoga Pavilion'), (6, 'Bird Watching'), (6, 'Free Breakfast');

-- 3. Rooms
INSERT INTO rooms (id, hotel_id, room_number, room_type, description, price_per_night, capacity, bed_type, room_size_sqft, image_url) VALUES
(1, 1, 'GA-101', 'Deluxe Ocean View', 'Spacious room with a private balcony offering breathtaking views of the sunset over the sea.', 5500.00, 2, '1 King Bed', 420, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'),
(2, 1, 'GA-201', 'Royal Ocean Suite', 'Luxury suite with a separated living area, oversized marble bathroom, and direct sea vista.', 8900.00, 3, '1 King Bed + 1 Sofa Bed', 680, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'),
(3, 1, 'GA-005', 'Beachfront Garden Villa', 'Private secluded villa steps from the sand with a plunge pool and outdoor shower.', 13500.00, 4, '2 King Beds', 1100, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'),
(4, 2, 'RH-104', 'Heritage Deluxe Chamber', 'Regal hand-painted frescoes, antique wooden furnishings, and traditional jharokha window seating.', 4800.00, 2, '1 Queen Four-Poster Bed', 390, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(5, 2, 'RH-202', 'Maharaja Heritage Suite', 'Exclusive suite featuring royal silk fabrics, marble archways, and a private courtyard terrace.', 9500.00, 3, '1 Royal King Bed', 750, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'),
(6, 3, 'MB-1402', 'Executive Skyline Room', 'Floor-to-ceiling windows with panoramic views of South Mumbai and the Marine Drive bay.', 6200.00, 2, '1 King Bed', 380, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'),
(7, 3, 'MB-1801', 'Bayview Presidential Suite', 'High-floor luxury corner suite with sweeping bay view, private conference desk, and lounge bar.', 11800.00, 3, '1 King Bed', 850, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'),
(8, 4, 'WP-12', 'Cedar Wood Classic', 'Warm cedar-paneled room with radiant heating and picture windows looking over apple orchards.', 3800.00, 2, '1 Queen Bed', 320, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'),
(9, 4, 'WP-24', 'Himalayan View Balcony Suite', 'Duplex loft suite with a personal fireplace and glass balcony facing the Pir Panjal ranges.', 6900.00, 4, '1 King Bed + 2 Single Beds', 620, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'),
(10, 5, 'SO-304', 'Smart Studio Room', 'Voice-controlled room lighting, ultra-fast gigabit internet, and ergonomic Herman Miller workstation.', 4200.00, 2, '1 Queen Bed', 350, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'),
(11, 5, 'SO-502', 'Executive Tech Loft', 'Two-level loft apartment with living area, kitchen nook, and private terrace pod.', 7200.00, 3, '1 King Bed + Daybed', 580, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'),
(12, 6, 'EP-101', 'Backwater Lakefront Cottage', 'Traditional Kerala-style terracotta tile cottage right on the water edge with a private sit-out veranda.', 5900.00, 2, '1 King Bed', 480, 'https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&w=800&q=80'),
(13, 6, 'EP-205', 'Vembanad Royal Water Villa', 'Overwater wooden villa with panoramic lake sunset view, floating breakfast option, and private sundeck.', 10500.00, 3, '1 King Bed', 780, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80');

-- 4. Room Amenities
INSERT INTO room_amenities (room_id, amenity) VALUES
(1, 'Air Conditioning'), (1, 'Ocean Balcony'), (1, 'Minibar'), (1, 'Smart TV'), (1, 'Espresso Machine'),
(2, 'Air Conditioning'), (2, 'Whirlpool Tub'), (2, 'Living Lounge'), (2, 'Private Balcony'), (2, 'Premium Sound System'),
(3, 'Private Pool'), (3, 'Direct Beach Walkway'), (3, 'Butler Service'), (3, 'Sun Loungers'), (3, 'Kitchenette'),
(4, 'Air Conditioning'), (4, 'Antique Decor'), (4, 'Tea Set'), (4, 'Rain Shower'), (4, 'Free Wi-Fi'),
(5, 'Private Terrace'), (5, 'Freestanding Bath'), (5, 'Heritage Furniture'), (5, 'Welcome Drink'), (5, 'Room Service'),
(6, 'City View'), (6, 'Work Desk'), (6, 'Ergonomic Chair'), (6, 'Smart TV'), (6, 'Nespresso Machine'),
(7, 'Bay Panoramic View'), (7, 'Executive Lounge Access'), (7, 'Cocktail Bar'), (7, 'Walk-in Closet'), (7, 'Jacuzzi'),
(8, 'Room Heating'), (8, 'Pine Forest View'), (8, 'Hot Kettle'), (8, 'Cozy Duvet'), (8, 'Complimentary Tea'),
(9, 'Stone Fireplace'), (9, 'Private Mountain Balcony'), (9, 'Attic Bedroom'), (9, 'Heated Bathroom'), (9, 'Stargazing Telescope'),
(10, 'Smart Room Controls'), (10, 'Gigabit LAN/Wi-Fi'), (10, 'Ergonomic Desk'), (10, 'Dual Monitors Option'), (10, 'Wireless Charger'),
(11, 'Smart TV 65-inch'), (11, 'Kitchenette'), (11, 'Private Terrace'), (11, 'Soundbar'), (11, 'Espresso Machine'),
(12, 'Lakefront Veranda'), (12, 'Open-to-Sky Shower'), (12, 'Ayurvedic Toiletries'), (12, 'Hammock'), (12, 'Free Wi-Fi'),
(13, 'Private Lake Sundeck'), (13, 'Floating Breakfast'), (13, 'Outdoor Jacuzzi'), (13, 'Personal Butler'), (13, 'Sunset Canoe Tour');
