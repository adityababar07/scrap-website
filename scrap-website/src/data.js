export const products = [
    {
        id: 1,
        name: "Mixed Aluminium",
        price: 45,
        originalPrice: 55,
        weight: 10,
        unit: 'kg',
        category: 'Metal',
        location: 'Pune',
        image: "https://placehold.co/300x400/png?text=Aluminium",
        description: "High quality mixed aluminium scrap. Suitable for recycling and various industrial applications. Contains a mix of cans, sheets, and other aluminium forms.",
        seller: {
            name: "Rajesh Kumar",
            address: "12, Industrial Area, Pune",
            phone: "+91 98765 43210",
            email: "rajesh.k@example.com"
        }
    },
    {
        id: 2,
        name: "Copper Wire",
        price: 75,
        originalPrice: null,
        weight: 5,
        unit: 'kg',
        category: 'Metal',
        location: 'Mumbai',
        image: "https://placehold.co/300x400/png?text=Copper",
        description: "Pure copper wire scrap. Excellent conductivity and high resale value. Stripped and ready for processing.",
        seller: {
            name: "Suresh Patil",
            address: "45, MIDC, Mumbai",
            phone: "+91 98765 12345",
            email: "suresh.p@example.com"
        }
    },
    {
        id: 3,
        name: "Steel Pipes",
        price: 20,
        originalPrice: 25,
        weight: 50,
        unit: 'kg',
        category: 'Metal',
        location: 'Nagpur',
        image: "https://placehold.co/300x400/png?text=Steel",
        description: "Heavy duty steel pipes. Ideal for construction recycling or metalworks. Various lengths and diameters included.",
        seller: {
            name: "Amit Singh",
            address: "88, Steel Market, Nagpur",
            phone: "+91 91234 56789",
            email: "amit.s@example.com"
        }
    },
    {
        id: 4,
        name: "E-Waste (PCBs)",
        price: 90,
        originalPrice: 120,
        weight: 2,
        unit: 'kg',
        category: 'Electronics',
        location: 'Bangalore',
        image: "https://placehold.co/300x400/png?text=E-Waste",
        description: "Assorted printed circuit boards (PCBs) from various electronics. Contains precious metals like gold, silver, and palladium.",
        seller: {
            name: "Tech Recyclers",
            address: "Electronic City, Bangalore",
            phone: "+91 88888 99999",
            email: "info@techrecyclers.com"
        }
    },
    {
        id: 5,
        name: "Brass Fittings",
        price: 60,
        originalPrice: null,
        weight: 8,
        unit: 'kg',
        category: 'Metal',
        location: 'Delhi',
        image: "https://placehold.co/300x400/png?text=Brass",
        description: "Assorted brass fittings and valves. Durable and corrosion-resistant. Perfect for plumbing and industrial recycling.",
        seller: {
            name: "Metal Works Ltd",
            address: "Okhla Industrial Estate, Delhi",
            phone: "+91 11 2345 6789",
            email: "sales@metalworks.com"
        }
    },
];

export const categories = [
    { id: 1, name: "Metals", image: "https://placehold.co/300x300/png?text=Metals" },
    { id: 2, name: "Electronics", image: "https://placehold.co/300x300/png?text=Electronics" },
    { id: 3, name: "Plastic", image: "https://placehold.co/300x300/png?text=Plastic" },
    { id: 4, name: "Paper", image: "https://placehold.co/300x300/png?text=Paper" },
];
