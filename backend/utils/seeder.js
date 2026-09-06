const bcrypt = require('bcryptjs');
const Storage = require('../services/storage');

const seedData = async () => {
  try {
    console.log('🌱 Checking seed data for Kissan Kart...');

    const existingUsers = await Storage.listUsers();
    if (existingUsers.length > 0) {
      console.log('🌾 Database already contains data. Seed skipped.');
      return;
    }

    console.log('🌿 Seeding fresh agricultural marketplace data...');

    const salt = await bcrypt.genSalt(10);
    const passwordHashAdmin = await bcrypt.hash('admin123', salt);
    const passwordHashFarmer = await bcrypt.hash('farmer123', salt);
    const passwordHashCustomer = await bcrypt.hash('customer123', salt);

    // 1. Create Admin
    const adminUser = await Storage.createUser({
      name: 'Priya Sharma (Admin)',
      email: 'admin@kissankart.com',
      passwordHash: passwordHashAdmin,
      phone: '+91 98765 43210',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      address: { street: 'Kisan Bhawan, MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' }
    });

    // 2. Create Farmers
    const farmerUser1 = await Storage.createUser({
      name: 'Ravi Kumar',
      email: 'ravi@greenvalley.com',
      passwordHash: passwordHashFarmer,
      phone: '+91 98451 23456',
      role: 'farmer',
      profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Green Valley Plot 12', city: 'Hubballi', state: 'Karnataka', pincode: '580020' }
    });

    const farmerProfile1 = await Storage.createFarmer({
      userId: farmerUser1._id,
      farmName: 'Green Valley Farms',
      location: 'Hubballi, Karnataka',
      description: 'Award-winning generational organic farmer passionate about native seeds and chemical-free vegetables and fruits.',
      experience: '12+ Years',
      farmingType: '100% Certified Organic & Permaculture',
      verificationStatus: 'verified',
      rating: 4.9,
      totalProducts: 6,
      bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200'
    });

    const farmerUser2 = await Storage.createUser({
      name: 'Sunita Devi',
      email: 'sunita@punjabfarms.com',
      passwordHash: passwordHashFarmer,
      phone: '+91 98140 87654',
      role: 'farmer',
      profileImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Golden Fields, GT Road', city: 'Ludhiana', state: 'Punjab', pincode: '141001' }
    });

    const farmerProfile2 = await Storage.createFarmer({
      userId: farmerUser2._id,
      farmName: 'Golden Fields Agro',
      location: 'Ludhiana, Punjab',
      description: 'Cultivating heritage grains, wheat, pulses, and traditional mustard oil using zero-budget natural farming.',
      experience: '8+ Years',
      farmingType: 'Vedic Organic Agriculture',
      verificationStatus: 'verified',
      rating: 4.8,
      totalProducts: 5,
      bannerImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200'
    });

    const farmerUser3 = await Storage.createUser({
      name: 'Ramesh Patel',
      email: 'ramesh@nashikorganics.com',
      passwordHash: passwordHashFarmer,
      phone: '+91 97654 32198',
      role: 'farmer',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Sahyadri Foothills', city: 'Nashik', state: 'Maharashtra', pincode: '422003' }
    });

    const farmerProfile3 = await Storage.createFarmer({
      userId: farmerUser3._id,
      farmName: 'Sahyadri Agro Orchards',
      location: 'Nashik, Maharashtra',
      description: 'Specializing in GI-tagged fruits, premium spices, grapes, and Alphonso mangoes ripened on the branch.',
      experience: '15+ Years',
      farmingType: 'Biodynamic Farming',
      verificationStatus: 'verified',
      rating: 4.9,
      totalProducts: 5,
      bannerImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200'
    });

    // 3. Create Customers
    const customerUser1 = await Storage.createUser({
      name: 'Ananya Sharma',
      email: 'ananya@gmail.com',
      passwordHash: passwordHashCustomer,
      phone: '+91 99001 12233',
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
      address: { street: 'Flat 402, Sunshine Apartments, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' }
    });

    const customerUser2 = await Storage.createUser({
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      passwordHash: passwordHashCustomer,
      phone: '+91 98200 44556',
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      address: { street: '7B Silver Oak, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' }
    });

    // 4. Create Agricultural Products
    const productsData = [
      {
        farmerId: farmerProfile1._id,
        name: 'Organic Desi Tomatoes',
        category: 'Vegetables',
        description: 'Naturally vine-ripened indigenous country tomatoes with high lycopene, rich tangy flavor, and zero pesticides.',
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&q=80&w=800'
        ],
        price: 60,
        unit: 'kg',
        quantity: 45,
        organic: true,
        harvestDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        farmingMethod: 'Natural Organic Composting',
        location: 'Hubballi, Karnataka',
        rating: 4.9,
        numReviews: 14
      },
      {
        farmerId: farmerProfile1._id,
        name: 'Fresh Hydroponic Spinach (Palak)',
        category: 'Vegetables',
        description: 'Tender, crisp, nutrient-dense green spinach bunches harvested at dawn and washed with pure well water.',
        images: [
          'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800'
        ],
        price: 35,
        unit: 'bunch',
        quantity: 60,
        organic: true,
        harvestDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // today morning
        farmingMethod: 'Permaculture Raised Beds',
        location: 'Hubballi, Karnataka',
        rating: 4.8,
        numReviews: 9
      },
      {
        farmerId: farmerProfile3._id,
        name: 'Ratnagiri Alphonso Mangoes (GI Tagged)',
        category: 'Fruits',
        description: 'Original Hapus Mangoes directly from coastal orchards. Naturally carbide-free, golden aromatic sweetness.',
        images: [
          'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80&w=800'
        ],
        price: 450,
        unit: 'dozen',
        quantity: 25,
        organic: true,
        harvestDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
        farmingMethod: 'Traditional Coastal Orchards',
        location: 'Ratnagiri & Nashik, Maharashtra',
        rating: 5.0,
        numReviews: 28
      },
      {
        farmerId: farmerProfile3._id,
        name: 'Kashmiri Crisp Red Apples',
        category: 'Fruits',
        description: 'Juicy, naturally sweet high-altitude apples handpicked from Himalayan foothills orchards.',
        images: [
          'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800'
        ],
        price: 180,
        unit: 'kg',
        quantity: 35,
        organic: true,
        harvestDate: new Date(Date.now() - 72 * 60 * 60 * 1000),
        farmingMethod: 'Natural Hill Orchard',
        location: 'Himalayan Foothills',
        rating: 4.9,
        numReviews: 18
      },
      {
        farmerId: farmerProfile2._id,
        name: 'Traditional Aged Basmati Rice',
        category: 'Grains',
        description: '2-year naturally aged long-grain aromatic Basmati rice grown with Himalayan meltwater.',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'
        ],
        price: 140,
        unit: 'kg',
        quantity: 80,
        organic: true,
        harvestDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Vedic Floodplain Cultivation',
        location: 'Ludhiana, Punjab',
        rating: 4.9,
        numReviews: 22
      },
      {
        farmerId: farmerProfile2._id,
        name: 'Sharbati Whole Wheat Grain',
        category: 'Grains',
        description: 'Golden MP Sharbati wheat, heavy grain with exceptional rotis, high protein, and sweet aroma.',
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
        ],
        price: 55,
        unit: 'kg',
        quantity: 120,
        organic: true,
        harvestDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Rainfed Natural Farming',
        location: 'Punjab Plains',
        rating: 4.7,
        numReviews: 11
      },
      {
        farmerId: farmerProfile2._id,
        name: 'Organic Unpolished Toor Dal',
        category: 'Pulses',
        description: 'Chemical-free unpolished pigeon pea pulses retaining natural fiber, protein, and authentic earthy taste.',
        images: [
          'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&q=80&w=800'
        ],
        price: 160,
        unit: 'kg',
        quantity: 40,
        organic: true,
        harvestDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Zero-Budget Natural Farming',
        location: 'Ludhiana, Punjab',
        rating: 4.8,
        numReviews: 15
      },
      {
        farmerId: farmerProfile3._id,
        name: 'Pure Lakadong Turmeric Powder (7% Curcumin)',
        category: 'Spices',
        description: 'World-renowned high curcumin organic turmeric harvested from pristine hills, stone ground without heat.',
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'
        ],
        price: 220,
        unit: '250g',
        quantity: 30,
        organic: true,
        harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Wild Herbal Agroforestry',
        location: 'Meghalaya & Nashik',
        rating: 5.0,
        numReviews: 31
      },
      {
        farmerId: farmerProfile1._id,
        name: 'Pure Desi Gir Cow A2 Bilona Ghee',
        category: 'Dairy',
        description: 'Handcrafted traditionally from curd of grass-fed indigenous Gir cows using wooden churner (Bilona method).',
        images: [
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800'
        ],
        price: 950,
        unit: '500ml',
        quantity: 20,
        organic: true,
        harvestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Ahimsa Ethical Gaushala',
        location: 'Hubballi, Karnataka',
        rating: 5.0,
        numReviews: 19
      },
      {
        farmerId: farmerProfile1._id,
        name: 'Raw Multi-Flora Forest Honey',
        category: 'Organic Products',
        description: '100% unpasteurized raw honey harvested ethically from wild bee hives in pristine forest reserves.',
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'
        ],
        price: 380,
        unit: '500g',
        quantity: 25,
        organic: true,
        harvestDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Ethical Wild Foraging',
        location: 'Western Ghats',
        rating: 4.9,
        numReviews: 16
      },
      {
        farmerId: farmerProfile1._id,
        name: 'Heirloom Desi Vegetable Seeds Collection',
        category: 'Seeds',
        description: 'Packet of 8 indigenous open-pollinated seed varieties (Tomatoes, Chillies, Brinjal, Okra, Spinach) for home & farm.',
        images: [
          'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=800'
        ],
        price: 199,
        unit: 'pack',
        quantity: 50,
        organic: true,
        harvestDate: new Date(),
        farmingMethod: 'Seed Saving Collective',
        location: 'Hubballi, Karnataka',
        rating: 4.8,
        numReviews: 7
      },
      {
        farmerId: farmerProfile2._id,
        name: 'Traditional Natural Sugarcane Jaggery (Gur)',
        category: 'Other Farm Products',
        description: 'Clarified using wild ladyfinger okra extract without chemical bleaching. Rich in natural iron and minerals.',
        images: [
          'https://images.unsplash.com/photo-1606851094655-b2593a9af63f?auto=format&fit=crop&q=80&w=800'
        ],
        price: 85,
        unit: 'kg',
        quantity: 75,
        organic: true,
        harvestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        farmingMethod: 'Natural Cane Boiling Unit',
        location: 'Ludhiana, Punjab',
        rating: 4.9,
        numReviews: 12
      }
    ];

    const createdProducts = [];
    for (const p of productsData) {
      const prod = await Storage.createProduct(p);
      createdProducts.push(prod);
    }

    // 5. Create Initial Sample Orders (demonstrating order statuses and revenue)
    const sampleOrder1 = await Storage.createOrder({
      orderNumber: 'KK20261001',
      customerId: customerUser1._id,
      items: [
        {
          productId: createdProducts[0]._id,
          farmerId: farmerProfile1._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          unit: createdProducts[0].unit,
          quantity: 2,
          price: createdProducts[0].price,
          subtotal: 120
        },
        {
          productId: createdProducts[8]._id,
          farmerId: farmerProfile1._id,
          name: createdProducts[8].name,
          image: createdProducts[8].images[0],
          unit: createdProducts[8].unit,
          quantity: 1,
          price: createdProducts[8].price,
          subtotal: 950
        }
      ],
      totalAmount: 1070,
      deliveryFee: 0,
      deliveryAddress: {
        fullName: 'Ananya Sharma',
        phone: '+91 99001 12233',
        street: 'Flat 402, Sunshine Apartments, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      paymentMethod: 'UPI',
      paymentStatus: 'completed',
      orderStatus: 'out_for_delivery',
      timeline: [
        { status: 'pending', title: 'Order Placed', note: 'Order placed by customer.', timestamp: new Date(Date.now() - 36 * 3600 * 1000) },
        { status: 'accepted', title: 'Confirmed by Farmer', note: 'Ravi Kumar confirmed harvest availability.', timestamp: new Date(Date.now() - 30 * 3600 * 1000) },
        { status: 'preparing', title: 'Harvested & Packed', note: 'Freshly harvested and packaged in eco-friendly crates.', timestamp: new Date(Date.now() - 18 * 3600 * 1000) },
        { status: 'out_for_delivery', title: 'Out for Delivery', note: 'Handed over to direct delivery partner.', timestamp: new Date(Date.now() - 2 * 3600 * 1000) }
      ]
    });

    const sampleOrder2 = await Storage.createOrder({
      orderNumber: 'KK20261002',
      customerId: customerUser2._id,
      items: [
        {
          productId: createdProducts[2]._id,
          farmerId: farmerProfile3._id,
          name: createdProducts[2].name,
          image: createdProducts[2].images[0],
          unit: createdProducts[2].unit,
          quantity: 1,
          price: createdProducts[2].price,
          subtotal: 450
        }
      ],
      totalAmount: 480,
      deliveryFee: 30,
      deliveryAddress: {
        fullName: 'Rahul Verma',
        phone: '+91 98200 44556',
        street: '7B Silver Oak, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050'
      },
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'preparing',
      timeline: [
        { status: 'pending', title: 'Order Placed', note: 'Order placed by customer.', timestamp: new Date(Date.now() - 12 * 3600 * 1000) },
        { status: 'accepted', title: 'Confirmed by Farmer', note: 'Ramesh Patel confirmed mango crate packaging.', timestamp: new Date(Date.now() - 8 * 3600 * 1000) },
        { status: 'preparing', title: 'Packing Fresh Produce', note: 'Packed with straw in breathable wooden boxes.', timestamp: new Date(Date.now() - 3 * 3600 * 1000) }
      ]
    });

    // 6. Sample Reviews
    await Storage.createReview({
      productId: createdProducts[0]._id,
      customerId: customerUser1._id,
      customerName: 'Ananya Sharma',
      rating: 5,
      comment: 'Super fresh, sweet, and aromatic! You can truly taste the difference of produce straight from Ravi’s farm without cold storage delay.'
    });

    await Storage.createReview({
      productId: createdProducts[2]._id,
      customerId: customerUser2._id,
      customerName: 'Rahul Verma',
      rating: 5,
      comment: 'Best Alphonso mangoes I have had in years. Heavenly fragrance and pure sweetness.'
    });

    console.log('✅ Seed completed successfully! Test credentials:');
    console.log('   Customer: ananya@gmail.com / customer123');
    console.log('   Farmer:   ravi@greenvalley.com / farmer123');
    console.log('   Admin:    admin@kissankart.com / admin123');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  const { connectDB } = require('../config/db');
  connectDB().then(() => {
    seedData().then(() => process.exit(0));
  });
}
