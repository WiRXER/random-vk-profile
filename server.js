import express from 'express';
import fetch from 'node-fetch';

import * as dotenv from 'dotenv';
dotenv.config();

const __dirname = process.cwd();
const app = express();
const port = process.env.SERVER_PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static("public"));

app.get('/', async (req, res) => {

  const getProfileInfo = async (key, randomId) => {
    try {
      const response = await fetch(`${apiUrl}users.get?user_ids=${randomId}&fields=photo_100&access_token=${key}&v=5.131&lang=ru`)
      const profile = await response.json();

      return profile.response[0];

    } catch(err) {
      console.error(err);
    }
  }

  const serviceKey = process.env.KEY;
  const apiUrl = 'https://api.vk.com/method/';

  const getRandomId = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const interval = setInterval( async () => {

    const profileInfo = await getProfileInfo(serviceKey, getRandomId(1, 900000000));

    if (!profileInfo.deactivated || profileInfo.first_name !== 'DELETED'){
      
      res.render('index', {
        name: profileInfo.first_name,
        lastName: profileInfo.last_name,
        avatarUrl: profileInfo.photo_100,
        id: profileInfo.id
      });

      clearInterval(interval);
    }
  }, 500)

  
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})