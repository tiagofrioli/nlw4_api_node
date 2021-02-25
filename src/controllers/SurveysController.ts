import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { Request, Response } from 'express';

class SurveyController{

    async create(request: Request, response:Response){

        const { title, description } = request.body;

        const surveyRepository = getCustomRepository(SurveysRepository);

        const survey = surveyRepository.create({
            title,
            description
        });

        await surveyRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request, response:Response){

        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.json(all);
    }
}

export { SurveyController }