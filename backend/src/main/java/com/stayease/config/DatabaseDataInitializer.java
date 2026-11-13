package com.stayease.config;

import com.stayease.entity.Hotel;
import com.stayease.entity.Room;
import com.stayease.repository.HotelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
public class DatabaseDataInitializer implements CommandLineRunner {

    private final HotelRepository hotelRepository;

    public DatabaseDataInitializer(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (hotelRepository.count() > 0) {
            return; // Data already initialized
        }

        List<Hotel> hotels = new ArrayList<>();

        // 1. The Grand Azure Resort - Goa
        Hotel goaResort = new Hotel(
                "The Grand Azure Beach Resort",
                "Calangute, North Goa, India",
                "Goa",
                "14 Coastal Highway, Calangute Beach Road, Goa 403516",
                "A five-star beachfront sanctuary overlooking the Arabian Sea, featuring lush tropical gardens, a private infinity pool, and world-class seafood dining.",
                4.85,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                new LinkedHashSet<>(Arrays.asList(
                        "Free Wi-Fi", "Swimming Pool", "Beach Access", "Spa & Wellness",
                        "Fine Dining Restaurant", "Cocktail Bar", "Free Breakfast", "Airport Shuttle"
                ))
        );
        addRoomsToHotel(goaResort, Arrays.asList(
                createRoom(goaResort, "GA-101", "Deluxe Ocean View", "Spacious room with a private balcony offering breathtaking views of the sunset over the sea.", new BigDecimal("5500.00"), 2, "1 King Bed", 420, "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80", Arrays.asList("Air Conditioning", "Ocean Balcony", "Minibar", "Smart TV", "Espresso Machine")),
                createRoom(goaResort, "GA-201", "Royal Ocean Suite", "Luxury suite with a separated living area, oversized marble bathroom, and direct sea vista.", new BigDecimal("8900.00"), 3, "1 King Bed + 1 Sofa Bed", 680, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", Arrays.asList("Air Conditioning", "Whirlpool Tub", "Living Lounge", "Private Balcony", "Premium Sound System")),
                createRoom(goaResort, "GA-005", "Beachfront Garden Villa", "Private secluded villa steps from the sand with a plunge pool and outdoor shower.", new BigDecimal("13500.00"), 4, "2 King Beds", 1100, "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80", Arrays.asList("Private Pool", "Direct Beach Walkway", "Butler Service", "Sun Loungers", "Kitchenette"))
        ));
        hotels.add(goaResort);

        // 2. The Royal Haveli Palace - Jaipur
        Hotel jaipurPalace = new Hotel(
                "The Royal Haveli Heritage Palace",
                "Civil Lines, Jaipur, Rajasthan, India",
                "Jaipur",
                "88 Maharaja Sawai Ram Singh Road, Jaipur 302006",
                "Authentic Rajasthani royal palace architecture seamlessly combined with modern opulent hospitality, courtyard musicians, and rooftop candlelit dining.",
                4.92,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                new LinkedHashSet<>(Arrays.asList(
                        "Free Wi-Fi", "Heritage Courtyard", "Royal Spa", "Rooftop Restaurant",
                        "Swimming Pool", "Cultural Performances", "Free Valet Parking", "24/7 Concierge"
                ))
        );
        addRoomsToHotel(jaipurPalace, Arrays.asList(
                createRoom(jaipurPalace, "RH-104", "Heritage Deluxe Chamber", "Regal hand-painted frescoes, antique wooden furnishings, and traditional jharokha window seating.", new BigDecimal("4800.00"), 2, "1 Queen Four-Poster Bed", 390, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", Arrays.asList("Air Conditioning", "Antique Decor", "Tea Set", "Rain Shower", "Free Wi-Fi")),
                createRoom(jaipurPalace, "RH-202", "Maharaja Heritage Suite", "Exclusive suite featuring royal silk fabrics, marble archways, and a private courtyard terrace.", new BigDecimal("9500.00"), 3, "1 Royal King Bed", 750, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", Arrays.asList("Private Terrace", "Freestanding Bath", "Heritage Furniture", "Welcome Drink", "Room Service"))
        ));
        hotels.add(jaipurPalace);

        // 3. Marine Bayview Skyline Hotel - Mumbai
        Hotel mumbaiHotel = new Hotel(
                "Marine Bayview Skyline Hotel",
                "Marine Drive, Nariman Point, Mumbai, India",
                "Mumbai",
                "220 Marine Drive Promenade, Mumbai 400021",
                "A premier luxury city hotel along Mumbai’s iconic Queen's Necklace, featuring panoramic skyline vistas, business lounges, and rooftop infinity dining.",
                4.78,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                new LinkedHashSet<>(Arrays.asList(
                        "Free High-Speed Wi-Fi", "Skyline Infinity Pool", "Fitness Center",
                        "Executive Lounge", "Business Center", "Valet Parking", "Multi-Cuisine Buffet"
                ))
        );
        addRoomsToHotel(mumbaiHotel, Arrays.asList(
                createRoom(mumbaiHotel, "MB-1402", "Executive Skyline Room", "Floor-to-ceiling windows with panoramic views of South Mumbai and the Marine Drive bay.", new BigDecimal("6200.00"), 2, "1 King Bed", 380, "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", Arrays.asList("City View", "Work Desk", "Ergonomic Chair", "Smart TV", "Nespresso Machine")),
                createRoom(mumbaiHotel, "MB-1801", "Bayview Presidential Suite", "High-floor luxury corner suite with sweeping bay view, private conference desk, and lounge bar.", new BigDecimal("11800.00"), 3, "1 King Bed", 850, "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80", Arrays.asList("Bay Panoramic View", "Executive Lounge Access", "Cocktail Bar", "Walk-in Closet", "Jacuzzi"))
        ));
        hotels.add(mumbaiHotel);

        // 4. Whispering Pines Alpine Retreat - Manali
        Hotel manaliHotel = new Hotel(
                "Whispering Pines Alpine Retreat",
                "Old Manali, Himachal Pradesh, India",
                "Manali",
                "Pinewood Valley Road, Old Manali 175131",
                "Cozy mountain chalet surrounded by snow-capped peaks and cedar pine forests. Enjoy warm stone fireplaces, stargazing balconies, and heated indoor wellness.",
                4.82,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                new LinkedHashSet<>(Arrays.asList(
                        "Free Wi-Fi", "Mountain Views", "Fireplace Lounge", "Heated Rooms",
                        "Trekking Guides", "Hot Tub Spa", "Organic Cafe", "Campfire Evenings"
                ))
        );
        addRoomsToHotel(manaliHotel, Arrays.asList(
                createRoom(manaliHotel, "WP-12", "Cedar Wood Classic", "Warm cedar-paneled room with radiant heating and picture windows looking over apple orchards.", new BigDecimal("3800.00"), 2, "1 Queen Bed", 320, "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80", Arrays.asList("Room Heating", "Pine Forest View", "Hot Kettle", "Cozy Duvet", "Complimentary Tea")),
                createRoom(manaliHotel, "WP-24", "Himalayan View Balcony Suite", "Duplex loft suite with a personal fireplace and glass balcony facing the Pir Panjal ranges.", new BigDecimal("6900.00"), 4, "1 King Bed + 2 Single Beds", 620, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", Arrays.asList("Stone Fireplace", "Private Mountain Balcony", "Attic Bedroom", "Heated Bathroom", "Stargazing Telescope"))
        ));
        hotels.add(manaliHotel);

        // 5. Silicon Oasis Tech Hotel - Bengaluru
        Hotel bangaloreHotel = new Hotel(
                "Silicon Oasis Tech Suites",
                "Whitefield, Bengaluru, Karnataka, India",
                "Bengaluru",
                "54 ITPL Main Road, Whitefield, Bengaluru 560066",
                "A high-tech urban sanctuary in the heart of the Silicon Valley of India, equipped with smart automation, co-working pods, and solar-powered amenities.",
                4.71,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
                new LinkedHashSet<>(Arrays.asList(
                        "Gigabit Wi-Fi", "24/7 Co-working Space", "Smart Keyless Entry",
                        "Fitness Gym", "Rooftop Cafe", "EV Charging Station", "Soundproof Meeting Rooms"
                ))
        );
        addRoomsToHotel(bangaloreHotel, Arrays.asList(
                createRoom(bangaloreHotel, "SO-304", "Smart Studio Room", "Voice-controlled room lighting, ultra-fast gigabit internet, and ergonomic Herman Miller workstation.", new BigDecimal("4200.00"), 2, "1 Queen Bed", 350, "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80", Arrays.asList("Smart Room Controls", "Gigabit LAN/Wi-Fi", "Ergonomic Desk", "Dual Monitors Option", "Wireless Charger")),
                createRoom(bangaloreHotel, "SO-502", "Executive Tech Loft", "Two-level loft apartment with living area, kitchen nook, and private terrace pod.", new BigDecimal("7200.00"), 3, "1 King Bed + Daybed", 580, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", Arrays.asList("Smart TV 65-inch", "Kitchenette", "Private Terrace", "Soundbar", "Espresso Machine"))
        ));
        hotels.add(bangaloreHotel);

        // 6. Emerald Palm Backwater Sanctuary - Kerala
        Hotel keralaHotel = new Hotel(
                "Emerald Palm Backwater Sanctuary",
                "Kumarakom, Kerala, India",
                "Kerala",
                "Vembanad Lake Shore, Kumarakom 686563",
                "An eco-luxury wellness sanctuary nestled along the serene Vembanad Lake backwaters, renowned for authentic Ayurvedic rejuvenation and private houseboat tours.",
                4.89,
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                new LinkedHashSet<>(Arrays.asList(
                        "Free Wi-Fi", "Lakefront Pool", "Ayurvedic Spa Center", "Houseboat Cruises",
                        "Farm-to-Table Restaurant", "Yoga Pavilion", "Bird Watching", "Free Breakfast"
                ))
        );
        addRoomsToHotel(keralaHotel, Arrays.asList(
                createRoom(keralaHotel, "EP-101", "Backwater Lakefront Cottage", "Traditional Kerala-style terracotta tile cottage right on the water edge with a private sit-out veranda.", new BigDecimal("5900.00"), 2, "1 King Bed", 480, "https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&w=800&q=80", Arrays.asList("Lakefront Veranda", "Open-to-Sky Shower", "Ayurvedic Toiletries", "Hammock", "Free Wi-Fi")),
                createRoom(keralaHotel, "EP-205", "Vembanad Royal Water Villa", "Overwater wooden villa with panoramic lake sunset view, floating breakfast option, and private sundeck.", new BigDecimal("10500.00"), 3, "1 King Bed", 780, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", Arrays.asList("Private Lake Sundeck", "Floating Breakfast", "Outdoor Jacuzzi", "Personal Butler", "Sunset Canoe Tour"))
        ));
        hotels.add(keralaHotel);

        hotelRepository.saveAll(hotels);
    }

    private Room createRoom(Hotel hotel, String roomNumber, String roomType, String description, BigDecimal price, int capacity, String bedType, int sqft, String imageUrl, List<String> amenities) {
        return new Room(
                hotel,
                roomNumber,
                roomType,
                description,
                price,
                capacity,
                bedType,
                sqft,
                imageUrl,
                new LinkedHashSet<>(amenities)
        );
    }

    private void addRoomsToHotel(Hotel hotel, List<Room> rooms) {
        hotel.getRooms().addAll(rooms);
    }
}
