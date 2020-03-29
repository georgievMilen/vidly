const request = require('supertest');
const {Gender} = require('../../models/gender');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genders', () => {
  beforeEach(() =>  { server = require('../../index'); });
  afterEach(async() => {
    await server.close();
    await Gender.remove({});
  });

  describe('GET /', () => {
    it('should return all genders', async () => { 
      await Gender.collection.insertMany([
        { name: 'gender1' },
        { name: 'gender2' },
      ]); 

      const res = await request(server).get('/api/genders');  
 
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'gender1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'gender2')).toBeTruthy();

    });
  });

  describe('GET /:id', () => {
    it('should return 404 if invalid ID is passed', async () => {
        const res = await request(server).get('/api/genders/' + "1");
  
        expect(res.status).toBe(404);
     });

     it('should return 404 if no gender with the given ID exists', async () => {
      
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genders/' + id);

      expect(res.status).toBe(404);
   });

    it('should return the gender if valid ID is passed', async () => {
      const gender = new Gender({ name: 'gender1' });
      await gender.save();

      const res = await request(server).get('/api/genders/' + gender._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', gender.name);
    });
  });

  describe('POST /', () => {

    let token;
    let name;

    const exec = async () => {
        return await request(server)
          .post('/api/genders')
          .set('x-auth-token', token)
          .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'gender1';
    })

    it('should return a 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return a 400 if gender is less than 5 characters', async () => {
      name = '1234';
        
      const res = await exec();

    expect(res.status).toBe(400);
    });

    it('should return a 400 if gender is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the gender if it is valid', async () => {
      await exec();
    
      const gender = await Gender.find({ name: 'gender1'});

      expect(gender).not.toBeNull();
    });

    it('should return the gender if it is valid', async () => {
        const res = await exec();

        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'gender1');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let gender; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/genders/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      gender = new Gender({ name: 'gender1' });
      await gender.save();
      
      token = new User().generateAuthToken();     
      id = gender._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if gender is less than 5 characters', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if gender is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if gender with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the gender if input is valid', async () => {
      await exec();

      const updatedGender = await Gender.findById(gender._id);

      expect(updatedGender.name).toBe(newName);
    });

    it('should return the updated gender if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let gender; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/genders/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      gender = new Gender({ name: 'gender1' });
      await gender.save();
      
      id = gender._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no gender with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the gender if input is valid', async () => {
      await exec();

      const genderInDb = await Gender.findById(id);

      expect(genderInDb).toBeNull();
    });

    it('should return the removed gender', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', gender._id.toHexString());
      expect(res.body).toHaveProperty('name', gender.name);
    });
  }); 
});