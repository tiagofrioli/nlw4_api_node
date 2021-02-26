import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe("Surveys", ()=> {

    beforeAll(async()=>{
        const connection =  await createConnection();
        await connection.runMigrations();
    });

    it("Should be able to create a new survey", async()=>{
        const response = await  request(app).post('/surveys').send({
           title: "Title Example4",
           description: "Description Example4"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it('Should be able to get all surveys', async() => {
       await request(app).post('surveys').send({
           title:"Title 5 Example",
           description: "Description 5 Example",
       });

       const response = await request(app).get('/surveys');

       expect(response.body.length).toBe(2);
    })

 
})