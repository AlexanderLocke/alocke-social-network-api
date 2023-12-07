const connection = require('../config/connection'); 
const User = require('../models/User'); 
const Thought = require('../models/Thought');

// Some example users
const users = [
  {
    username: 'chris_chan',
    email: 'chris@example.com'
  },
  {
    username: 'billy_bob',
    email: 'billy@example.com'
  },
  {
    username: 'aaron_carter',
    email: 'aaron@example.com'
  },
  {
    username: 'bill_gates',
    email: 'bill@example.com'
  }
];

async function seedDatabase() {
  try {
    // Delete existing users
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Create users
    const createdUsers = await User.insertMany(users);

    const chris = createdUsers.find(user => user.username === 'chris_chan');
    const billy = createdUsers.find(user => user.username === 'billy_bob');
    const aaron = createdUsers.find(user => user.username === 'aaron_carter');
    const bill = createdUsers.find(user => user.username === 'bill_gates');


    // Create friend connections
    chris.friends.push(billy._id);
    aaron.friends.push(bill._id, chris._id);
 

    await Promise.all([chris.save(), billy.save(), aaron.save(), bill.save()]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    connection.close();
  }
}

seedDatabase();
