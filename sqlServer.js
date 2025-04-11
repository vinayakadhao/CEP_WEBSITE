const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const saltRounds = 10;


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));


mongoose.connect('mongodb://localhost:27017/cep2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginpage.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'registerpage.html'));
});


app.post('/register', async (req, res) => {
  const { fullname, email, username, pswrd, confirm_pswrd } = req.body;

  if (!fullname || !email || !username || !pswrd || !confirm_pswrd) {
    return res.send('All fields are required!');
  }

  if (pswrd !== confirm_pswrd) {
    return res.send('Passwords do not match!');
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send('User already exists!');
  }

  const hashedPassword = await bcrypt.hash(pswrd, saltRounds);

  const newUser = new User({
    fullname,
    email,
    username,
    password: hashedPassword
  });

  await newUser.save();
  res.send('Registration successful! You can now <a href ="Loginpage.html">login here</a>.');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send('Username and password are required');
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.send('User not found!');
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      
      res.sendFile(path.join(__dirname, 'farm.html')); 
    } else {
      res.send('Incorrect password!');
    }
  } catch (err) {
    console.error('❌ Compare error:', err);
    res.status(500).send('Server error while comparing passwords');
  }
});

// ✅ Start server
app.listen(3000, () => {
  console.log('🚀 Server started on http://localhost:3000');
});
