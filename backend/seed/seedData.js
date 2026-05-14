const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  {
    name: { en: 'Burgers', ar: 'برجر' },
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    name: { en: 'Pizza', ar: 'بيتزا' },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },
  {
    name: { en: 'Shawarma', ar: 'شاورما' },
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400'
  },
  {
    name: { en: 'Grills', ar: 'مشاوي' },
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
  },
  {
    name: { en: 'Salads', ar: 'سلطات' },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  },
  {
    name: { en: 'Drinks', ar: 'مشروبات' },
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'
  },
  {
    name: { en: 'Desserts', ar: 'حلويات' },
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@electropi.com',
      password: 'admin123',
      phone: '+966500000000',
      address: 'Riyadh, Saudi Arabia',
      role: 'admin'
    });

    // Create regular user
    await User.create({
      name: 'Ahmed',
      email: 'ahmed@test.com',
      password: 'test123',
      phone: '+966511111111',
      address: 'Jeddah, Saudi Arabia',
      role: 'user'
    });

    console.log('Users seeded');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');

    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.name.en] = c._id;
    });

    // Create products
    const products = [
      // Burgers
      {
        name: { en: 'Classic Beef Burger', ar: 'برجر لحم كلاسيكي' },
        description: { en: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce', ar: 'قطعة لحم بقري طازجة مع خس وطماطم وصلصتنا الخاصة' },
        price: 25,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: catMap['Burgers'],
        isFeatured: true,
        preparationTime: 15
      },
      {
        name: { en: 'Double Cheese Burger', ar: 'برجر دبل تشيز' },
        description: { en: 'Double beef patty with melted cheddar and crispy bacon', ar: 'قطعتين لحم مع جبنة شيدر ذائبة وبيكون مقرمش' },
        price: 35,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        category: catMap['Burgers'],
        isFeatured: true,
        preparationTime: 18
      },
      {
        name: { en: 'Chicken Burger', ar: 'برجر دجاج' },
        description: { en: 'Crispy fried chicken fillet with coleslaw', ar: 'فيليه دجاج مقرمش مع كول سلو' },
        price: 22,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
        category: catMap['Burgers'],
        preparationTime: 15
      },
      // Pizza
      {
        name: { en: 'Margherita Pizza', ar: 'بيتزا مارجريتا' },
        description: { en: 'Classic tomato sauce, mozzarella, and fresh basil', ar: 'صلصة طماطم كلاسيكية، موتزاريلا، وريحان طازج' },
        price: 30,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: catMap['Pizza'],
        isFeatured: true,
        preparationTime: 20
      },
      {
        name: { en: 'Pepperoni Pizza', ar: 'بيتزا بيبروني' },
        description: { en: 'Loaded with pepperoni and extra mozzarella', ar: 'محملة بالبيبروني وموتزاريلا إضافية' },
        price: 38,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category: catMap['Pizza'],
        preparationTime: 20
      },
      {
        name: { en: 'BBQ Chicken Pizza', ar: 'بيتزا دجاج باربكيو' },
        description: { en: 'Grilled chicken, BBQ sauce, red onions, and cilantro', ar: 'دجاج مشوي، صلصة باربكيو، بصل أحمر، وكزبرة' },
        price: 42,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        category: catMap['Pizza'],
        preparationTime: 22
      },
      // Shawarma
      {
        name: { en: 'Chicken Shawarma', ar: 'شاورما دجاج' },
        description: { en: 'Marinated chicken with garlic sauce wrapped in fresh bread', ar: 'دجاج متبل مع صلصة ثوم ملفوف بخبز طازج' },
        price: 15,
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400',
        category: catMap['Shawarma'],
        isFeatured: true,
        preparationTime: 10
      },
      {
        name: { en: 'Meat Shawarma', ar: 'شاورما لحم' },
        description: { en: 'Tender beef shawarma with tahini and pickles', ar: 'شاورما لحم طرية مع طحينة ومخللات' },
        price: 18,
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400',
        category: catMap['Shawarma'],
        preparationTime: 10
      },
      // Grills
      {
        name: { en: 'Mixed Grill Platter', ar: 'طبق مشاوي مشكلة' },
        description: { en: 'Assorted grilled meats with rice and grilled vegetables', ar: 'لحوم مشوية متنوعة مع أرز وخضروات مشوية' },
        price: 65,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        category: catMap['Grills'],
        isFeatured: true,
        preparationTime: 30
      },
      {
        name: { en: 'Grilled Chicken', ar: 'دجاج مشوي' },
        description: { en: 'Whole grilled chicken with spices and sides', ar: 'دجاجة كاملة مشوية مع بهارات ومقبلات' },
        price: 45,
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
        category: catMap['Grills'],
        preparationTime: 25
      },
      {
        name: { en: 'Lamb Kebab', ar: 'كباب لحم' },
        description: { en: 'Seasoned lamb kebab skewers with flatbread', ar: 'أسياخ كباب لحم متبل مع خبز مسطح' },
        price: 40,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
        category: catMap['Grills'],
        preparationTime: 20
      },
      // Salads
      {
        name: { en: 'Caesar Salad', ar: 'سلطة سيزر' },
        description: { en: 'Crisp romaine lettuce with parmesan and croutons', ar: 'خس روماني مقرمش مع بارميزان وخبز محمص' },
        price: 18,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        category: catMap['Salads'],
        preparationTime: 8
      },
      {
        name: { en: 'Fattoush', ar: 'فتوش' },
        description: { en: 'Traditional Lebanese salad with crispy pita bread', ar: 'سلطة لبنانية تقليدية مع خبز بيتا مقرمش' },
        price: 15,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        category: catMap['Salads'],
        preparationTime: 8
      },
      // Drinks
      {
        name: { en: 'Fresh Orange Juice', ar: 'عصير برتقال طازج' },
        description: { en: 'Freshly squeezed orange juice', ar: 'عصير برتقال معصور طازج' },
        price: 10,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        category: catMap['Drinks'],
        preparationTime: 5
      },
      {
        name: { en: 'Mango Smoothie', ar: 'سموذي مانجو' },
        description: { en: 'Creamy mango smoothie with yogurt', ar: 'سموذي مانجو كريمي مع زبادي' },
        price: 14,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
        category: catMap['Drinks'],
        preparationTime: 5
      },
      {
        name: { en: 'Mint Lemonade', ar: 'ليموناضة بالنعناع' },
        description: { en: 'Refreshing lemonade with fresh mint leaves', ar: 'ليموناضة منعشة مع أوراق نعناع طازجة' },
        price: 8,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: catMap['Drinks'],
        preparationTime: 5
      },
      // Desserts
      {
        name: { en: 'Chocolate Cake', ar: 'كيكة شوكولاتة' },
        description: { en: 'Rich chocolate cake with ganache frosting', ar: 'كيكة شوكولاتة غنية مع تغليف غاناش' },
        price: 20,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        category: catMap['Desserts'],
        isFeatured: true,
        preparationTime: 5
      },
      {
        name: { en: 'Kunafa', ar: 'كنافة' },
        description: { en: 'Traditional Arabic cheese pastry with sugar syrup', ar: 'حلوى جبنة عربية تقليدية مع شراب السكر' },
        price: 18,
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
        category: catMap['Desserts'],
        preparationTime: 10
      },
      {
        name: { en: 'Ice Cream Sundae', ar: 'آيس كريم صنداي' },
        description: { en: 'Three scoops with chocolate sauce and whipped cream', ar: 'ثلاث كرات مع صلصة شوكولاتة وكريمة مخفوقة' },
        price: 16,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        category: catMap['Desserts'],
        preparationTime: 5
      }
    ];

    await Product.insertMany(products);
    console.log('Products seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin login: admin@electropi.com / admin123');
    console.log('User login: ahmed@test.com / test123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
