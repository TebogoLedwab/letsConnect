const request = require ('supertest');
const app = require('./../../app')



   /*
      declare the token variable in a scope accessible
      by the entire test suite
    */
   let token = "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU4MjA5ZjEzODE5NDgyNWQ0NWY4M2NkIn0sImlhdCI6MTU4NTgyNDQ0MiwiZXhwIjoxNTg2MTg0NDQyfQ.zBmslUs5wZuYTV6rwyxNl8d0vj6xZd7opq4nDS0iNfU";
//
   beforeAll((done) => {
     request(app)
       .post('/auth')
       .send({
         username: "kedibone@thedigitalacademy.co.za",
         password: "123456l@",
       })
       .end((err, response) => {
         token = response.body.token; // save the token!
         done();
       });
   });

   describe('GET user by token /', () => {
     // token not being sent - should respond with a 401
     test('It should require authorization', () => {
       return request(app)
         .get('/auth')
         .then((response) => {
           expect(response.status).toBe(401);
         });
     });
     // send the token - should respond with a 200
     test('It responds with JSON', () => {
       return request(app)
         .get('/auth')
         .set('Authorization', `Bearer ${token}`)
         .send({
          username: "kedibone@thedigitalacademy.co.za",
          password: "123456l@",

         })
         .then((response) => {
          //  expect(response.status).toBe(200);
           expect(response.type).toBe('application/json');
         });
     });
   });





